import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentInput } from '../shared/types';
import { CreateCommentSchema } from '../shared/shared-utils';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class CommentsService {
  constructor(
    private prisma: PrismaService,
    private notifications: NotificationsService
  ) {}

  async createComment(authorId: string, input: CreateCommentInput) {
    const parsed = CreateCommentSchema.safeParse(input);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.errors[0].message);
    }

    const { content, threadId } = parsed.data;

    // Check if thread exists
    const threadExists = await this.prisma.thread.findUnique({
      where: { id: threadId }
    });
    if (!threadExists) {
      throw new BadRequestException('The thread does not exist.');
    }

    const newComment = await this.prisma.comment.create({
      data: {
        content,
        threadId,
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

    // Securely dispatch FCM Push Alert to the thread author asynchronously
    if (threadExists.authorId !== authorId) {
      const replierName = newComment.author?.name || 'A research colleague';
      const bodySnippet = content.substring(0, 60) + (content.length > 60 ? '...' : '');
      this.notifications.sendPushToUser(threadExists.authorId, {
        title: 'New Discussion Reply! 💬',
        body: `${replierName} commented: "${bodySnippet}"`,
        url: `/threads/${threadId}`
      }).catch(e => console.error('FCM Dispatch Failed:', e));
    }

    return newComment;
  }
}
