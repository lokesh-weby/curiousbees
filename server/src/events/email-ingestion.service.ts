import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { EventStatus, EventPriority } from '@prisma/client';
import { Interval } from '@nestjs/schedule';
import { simpleParser } from 'mailparser';
import * as imaps from 'imap-simple';

@Injectable()
export class EmailIngestionService implements OnModuleInit {
  private readonly logger = new Logger(EmailIngestionService.name);
  private isProcessing = false;

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  onModuleInit() {
    this.logger.log('Email Ingestion Service initialized. Polling interval active.');
  }

  @Interval(120000) // Poll every 2 minutes
  async handleEmailPolling() {
    if (this.isProcessing) {
      this.logger.debug('Previous polling iteration is still active, skipping.');
      return;
    }

    const imapUser = this.configService.get<string>('IMAP_USER');
    const imapPassword = this.configService.get<string>('IMAP_PASSWORD');
    const imapHost = this.configService.get<string>('IMAP_HOST');
    const imapPort = this.configService.get<number>('IMAP_PORT') || 993;
    const imapTls = this.configService.get<string>('IMAP_TLS') !== 'false';

    if (!imapUser || !imapPassword || !imapHost) {
      this.logger.warn('IMAP server credentials (IMAP_USER, IMAP_PASSWORD, IMAP_HOST) are not configured in .env. Email ingestion is suspended.');
      return;
    }

    this.isProcessing = true;
    this.logger.debug('Starting IMAP polling for unread academic events...');

    const config = {
      imap: {
        user: imapUser,
        password: imapPassword,
        host: imapHost,
        port: Number(imapPort),
        tls: imapTls,
        authTimeout: 8000,
        tlsOptions: { rejectUnauthorized: false },
      },
    };

    let connection: imaps.ImapSimple | null = null;

    try {
      connection = await imaps.connect(config);
      await connection.openBox('INBOX');

      // Search for unread (UNSEEN) messages
      const searchCriteria = ['UNSEEN'];
      const fetchOptions = {
        bodies: ['HEADER', 'TEXT', ''],
        markSeen: true,
      };

      const messages = await connection.search(searchCriteria, fetchOptions);
      if (messages.length > 0) {
        this.logger.log(`Found ${messages.length} unread emails.`);
      } else {
        this.logger.debug('Found 0 unread emails.');
      }

      for (const message of messages) {
        try {
          const allParts = message.parts;
          const rawBodyPart = allParts.find((part) => part.which === '');
          if (!rawBodyPart) {
            this.logger.warn(`Could not find raw body part for message UID ${message.attributes.uid}`);
            continue;
          }

          const parsed = await simpleParser(rawBodyPart.body);
          await this.processEmail(parsed, message.attributes.uid.toString());
        } catch (msgErr: any) {
          this.logger.error(`Error processing email message: ${msgErr.message}`);
        }
      }
    } catch (err: any) {
      this.logger.error(`Failed connecting to IMAP server: ${err.message}`);
    } finally {
      if (connection) {
        try {
          connection.end();
        } catch (closeErr) {}
      }
      this.isProcessing = false;
    }
  }

  private async processEmail(parsedMail: any, uid: string) {
    const subject = parsedMail.subject || '';
    const messageId = parsedMail.messageId || `msg-uid-${uid}`;
    const senderEmail = parsedMail.from?.value?.[0]?.address || 'unknown@srmist.edu.in';
    const rawBody = parsedMail.text || '';

    // 1. FILTER LOGIC: Only process emails whose subject contains "event" (case-insensitive)
    if (!subject.toLowerCase().includes('event')) {
      this.logger.debug(`Skipping email message ${messageId}: Subject "${subject}" does not contain "event".`);
      return;
    }

    // 2. DEDUPLICATION: Ignore already processed emails using messageId
    const existing = await this.prisma.event.findUnique({
      where: { messageId },
    });

    if (existing) {
      this.logger.log(`Skipping duplicate email message: ${messageId} is already processed.`);
      return;
    }

    this.logger.log(`Processing event email: "${subject}" from <${senderEmail}>`);

    // 3. PARSING LOGIC
    const parsedData = this.parseEmailBody(rawBody);

    // Fallbacks and Mappings
    // Map email subject to title if title from body is missing
    const eventTitle = parsedData.title || this.cleanSubject(subject);
    
    // Parse Date
    let eventDate = new Date();
    if (parsedData.date) {
      const parsedDate = new Date(parsedData.date);
      if (!isNaN(parsedDate.getTime())) {
        eventDate = parsedDate;
      }
    }

    // Map priority
    let eventPriority: EventPriority = EventPriority.MEDIUM;
    if (parsedData.priority) {
      const pUpper = parsedData.priority.toUpperCase();
      if (pUpper === 'LOW') eventPriority = EventPriority.LOW;
      else if (pUpper === 'MEDIUM' || pUpper === 'NORMAL') eventPriority = EventPriority.MEDIUM;
      else if (pUpper === 'HIGH') eventPriority = EventPriority.HIGH;
      else if (pUpper === 'CRITICAL') eventPriority = EventPriority.CRITICAL;
    }

    try {
      // 4. PERSISTENCE: Create event in database
      const newEvent = await this.prisma.event.create({
        data: {
          title: eventTitle,
          eventType: parsedData.eventType || 'Manual Entry',
          speaker: parsedData.speaker || null,
          department: parsedData.department || null,
          date: eventDate,
          time: parsedData.time || '10:00 AM',
          venue: parsedData.venue || 'TBA',
          topic: parsedData.topic || null,
          organizerEmail: senderEmail,
          status: EventStatus.REVIEW_REQUIRED, // Default to REVIEW_REQUIRED ("pending" review status)
          priority: eventPriority,
          description: parsedData.description || rawBody || null,
          category: parsedData.category || null,
          registrationLink: parsedData.registrationLink || null,
          messageId,
        },
      });

      this.logger.log(`Successfully created event from email: "${newEvent.title}" (ID: ${newEvent.id})`);
    } catch (dbErr: any) {
      this.logger.error(`Database error while persisting event from email: ${dbErr.message}`);
    }
  }

  private parseEmailBody(text: string): any {
    const lines = text.split(/\r?\n/);
    const result: any = {
      eventType: '',
      title: '',
      topic: '',
      speaker: '',
      department: '',
      date: '',
      time: '',
      venue: '',
      category: '',
      priority: '',
      registrationLink: '',
      description: '',
    };

    const extractValue = (line: string, key: string): string | null => {
      const escapedKey = key.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const regex = new RegExp(`^${escapedKey}:\\s*(.*)$`, 'i');
      const match = line.match(regex);
      return match ? match[1].trim() : null;
    };

    let readingDescription = false;
    let descriptionLines: string[] = [];

    for (const line of lines) {
      const trimmed = line.trim();

      if (readingDescription) {
        descriptionLines.push(line);
        continue;
      }

      if (trimmed.toLowerCase().startsWith('description:')) {
        readingDescription = true;
        const rest = trimmed.substring('description:'.length).trim();
        if (rest) {
          descriptionLines.push(rest);
        }
        continue;
      }

      const evType = extractValue(trimmed, 'Event Type');
      if (evType !== null) { result.eventType = evType; continue; }

      const title = extractValue(trimmed, 'Title');
      if (title !== null) { result.title = title; continue; }

      const topic = extractValue(trimmed, 'Topic');
      if (topic !== null) { result.topic = topic; continue; }

      const speaker = extractValue(trimmed, 'Speaker');
      if (speaker !== null) { result.speaker = speaker; continue; }

      const dept = extractValue(trimmed, 'Department');
      if (dept !== null) { result.department = dept; continue; }

      const date = extractValue(trimmed, 'Date');
      if (date !== null) { result.date = date; continue; }

      const time = extractValue(trimmed, 'Time');
      if (time !== null) { result.time = time; continue; }

      const venue = extractValue(trimmed, 'Venue');
      if (venue !== null) { result.venue = venue; continue; }

      const category = extractValue(trimmed, 'Category');
      if (category !== null) { result.category = category; continue; }

      const priority = extractValue(trimmed, 'Priority');
      if (priority !== null) { result.priority = priority; continue; }

      const regLink = extractValue(trimmed, 'Registration Link');
      if (regLink !== null) { result.registrationLink = regLink; continue; }
    }

    result.description = descriptionLines.join('\n').trim();
    return result;
  }

  private cleanSubject(subject: string): string {
    // Remove "Event:" prefix if it exists in a case-insensitive way
    return subject.replace(/^event:\s*/i, '').trim();
  }
}
