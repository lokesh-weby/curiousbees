import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateThreadInput } from '../shared/types';
import { CreateThreadSchema } from '../shared/shared-utils';

@Injectable()
export class ThreadsService {
  constructor(private prisma: PrismaService) {}

  async getThreads(search?: string, tag?: string) {
    return this.prisma.thread.findMany({
      where: {
        ...(tag && {
          tags: {
            has: tag
          }
        }),
        ...(search && {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { content: { contains: search, mode: 'insensitive' } }
          ]
        })
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true,
            department: true
          }
        },
        _count: {
          select: { comments: true }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async getThreadById(id: string) {
    const thread = await this.prisma.thread.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true,
            department: true,
            bio: true
          }
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
                role: true,
                department: true
              }
            }
          },
          orderBy: {
            createdAt: 'asc'
          }
        }
      }
    });

    if (!thread) {
      throw new NotFoundException('Research thread not found.');
    }

    return thread;
  }

  async createThread(authorId: string, input: CreateThreadInput) {
    const parsed = CreateThreadSchema.safeParse(input);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.errors[0].message);
    }

    const { title, content, tags } = parsed.data;

    return this.prisma.thread.create({
      data: {
        title,
        content,
        tags,
        authorId
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true,
            department: true
          }
        }
      }
    });
  }

  async deleteThread(userId: string, threadId: string, userRole: string) {
    const thread = await this.prisma.thread.findUnique({
      where: { id: threadId },
      include: { author: true }
    });
    if (!thread) {
      throw new NotFoundException('Research thread not found.');
    }

    const requestingUser = await this.prisma.user.findUnique({
      where: { id: userId }
    });

    const getLocalPart = (email?: string | null) => email?.split('@')[0].toLowerCase() || '';

    const isOwner = thread.authorId === userId || 
                    (requestingUser && thread.author && getLocalPart(requestingUser.email) === getLocalPart(thread.author.email));

    if (!isOwner && userRole !== 'INSTITUTION_ADMIN') {
      throw new BadRequestException('You do not have permission to delete this thread.');
    }

    return this.prisma.thread.delete({
      where: { id: threadId }
    });
  }
}
