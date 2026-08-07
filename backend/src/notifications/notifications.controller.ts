import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  private extractUserId(req: any): string {
    const userId = req.user?.sub || req.user?.userId || req.user?.id;
    if (!userId) {
      throw new UnauthorizedException('User ID could not be identified from token.');
    }
    return userId;
  }

  @Get()
  async getUserNotifications(
    @Req() req: any,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const userId = this.extractUserId(req);
    return this.notificationsService.getUserNotifications(userId, page, limit);
  }

  @Get('unread')
  async getUnreadNotifications(@Req() req: any) {
    const userId = this.extractUserId(req);
    return this.notificationsService.getUnreadNotifications(userId);
  }

  @Get('unread-count')
  async getUnreadCount(@Req() req: any) {
    const userId = this.extractUserId(req);
    return this.notificationsService.getUnreadCount(userId);
  }

  @Post()
  async createNotification(
    @Req() req: any,
    @Body() createNotificationDto: CreateNotificationDto,
  ) {
    const userId = this.extractUserId(req);
    return this.notificationsService.createNotification(
      userId,
      createNotificationDto,
    );
  }

  @Patch('read-all')
  async markAllAsRead(@Req() req: any) {
    const userId = this.extractUserId(req);
    return this.notificationsService.markAllAsRead(userId);
  }

  @Patch(':id/read')
  async markAsRead(@Req() req: any, @Param('id') notificationId: string) {
    const userId = this.extractUserId(req);
    return this.notificationsService.markAsRead(userId, notificationId);
  }

  @Delete(':id')
  async deleteNotification(
    @Req() req: any,
    @Param('id') notificationId: string,
  ) {
    const userId = this.extractUserId(req);
    return this.notificationsService.deleteNotification(userId, notificationId);
  }
}