import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { ActivityService } from './activity.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('activity')
@UseGuards(JwtAuthGuard)
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  private extractUserId(req: any): string {
    const userId = req.user?.sub || req.user?.userId || req.user?.id;
    if (!userId) {
      throw new UnauthorizedException('User ID could not be identified from token.');
    }
    return userId;
  }

  @Get()
  async getUserActivities(
    @Req() req: any,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const userId = this.extractUserId(req);
    return this.activityService.getUserActivities(userId, page, limit);
  }

  @Get('project/:projectId')
  async getProjectActivities(
    @Req() req: any,
    @Param('projectId') projectId: string,
  ) {
    const userId = this.extractUserId(req);
    return this.activityService.getProjectActivities(userId, projectId);
  }

  @Post()
  async createActivity(
    @Req() req: any,
    @Body() createActivityDto: CreateActivityDto,
  ) {
    const userId = this.extractUserId(req);
    return this.activityService.createActivity(userId, createActivityDto);
  }

  @Get(':id')
  async getActivityById(@Req() req: any, @Param('id') activityId: string) {
    const userId = this.extractUserId(req);
    return this.activityService.getActivityById(userId, activityId);
  }

  @Delete(':id')
  async deleteActivity(@Req() req: any, @Param('id') activityId: string) {
    const userId = this.extractUserId(req);
    return this.activityService.deleteActivity(userId, activityId);
  }
}