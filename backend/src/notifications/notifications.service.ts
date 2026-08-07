import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(private readonly prisma: PrismaService) {}

  private checkUserId(userId: string) {
    if (!userId) {
      throw new UnauthorizedException('User identification missing from token.');
    }
  }

  /**
   * Fetch paginated notifications for the authenticated user, newest first.
   */
  async getUserNotifications(userId: string, page = 1, limit = 20) {
    this.checkUserId(userId);

    const pageNumber = Math.max(1, Number(page) || 1);
    const limitNumber = Math.max(1, Math.min(100, Number(limit) || 20));
    const skip = (pageNumber - 1) * limitNumber;

    const [notifications, total] = await Promise.all([
      this.prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNumber,
      }),
      this.prisma.notification.count({ where: { userId } }),
    ]);

    return {
      data: notifications,
      meta: {
        total,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(total / limitNumber),
      },
    };
  }

  /**
   * Fetch all unread notifications for the authenticated user.
   */
  async getUnreadNotifications(userId: string) {
    this.checkUserId(userId);

    return this.prisma.notification.findMany({
      where: {
        userId,
        isRead: false,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get the total unread notification count.
   */
  async getUnreadCount(userId: string) {
    this.checkUserId(userId);

    const count = await this.prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    });

    return { unreadCount: count };
  }

  /**
   * Create a notification record bound to the authenticated user.
   */
  async createNotification(userId: string, dto: CreateNotificationDto) {
    this.checkUserId(userId);

    return this.prisma.notification.create({
      data: {
        title: dto.title,
        message: dto.message,
        type: dto.type,
        user: {
          connect: { id: userId },
        },
      },
    });
  }

  /**
   * Mark a single notification as read after ownership verification.
   */
  async markAsRead(userId: string, notificationId: string) {
    this.checkUserId(userId);

    const notification = await this.prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found.');
    }

    if (notification.userId !== userId) {
      throw new ForbiddenException('You do not have access to this notification.');
    }

    return this.prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });
  }

  /**
   * Mark all notifications belonging to the user as read.
   */
  async markAllAsRead(userId: string) {
    this.checkUserId(userId);

    const result = await this.prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: { isRead: true },
    });

    return {
      message: 'All notifications marked as read.',
      count: result.count,
    };
  }

  /**
   * Delete a notification after checking ownership.
   */
  async deleteNotification(userId: string, notificationId: string) {
    this.checkUserId(userId);

    const notification = await this.prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found.');
    }

    if (notification.userId !== userId) {
      throw new ForbiddenException('You do not have permission to delete this notification.');
    }

    return this.prisma.notification.delete({
      where: { id: notificationId },
    });
  }
}