import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProjectsService } from '../projects/projects.service';
import { CreateActivityDto } from './dto/create-activity.dto';

@Injectable()
export class ActivityService {
  private readonly logger = new Logger(ActivityService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly projectsService: ProjectsService,
  ) {}

  /**
   * Helper to ensure userId exists
   */
  private checkUserId(userId: string) {
    if (!userId) {
      throw new UnauthorizedException('User identification missing from token.');
    }
  }

  /**
   * Return activities belonging to the authenticated user with optional pagination.
   */
  async getUserActivities(userId: string, page = 1, limit = 20) {
    this.checkUserId(userId);

    const pageNumber = Math.max(1, Number(page) || 1);
    const limitNumber = Math.max(1, Math.min(100, Number(limit) || 20));
    const skip = (pageNumber - 1) * limitNumber;

    const [activities, total] = await Promise.all([
      this.prisma.activity.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNumber,
        include: {
          project: {
            select: {
              id: true,
              name: true,
              fullName: true,
            },
          },
        },
      }),
      this.prisma.activity.count({ where: { userId } }),
    ]);

    return {
      data: activities,
      meta: {
        total,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(total / limitNumber),
      },
    };
  }

  /**
   * Return activities for a specific project after verifying ownership.
   */
  async getProjectActivities(userId: string, projectId: string) {
    this.checkUserId(userId);

    // Verify project belongs to authenticated user
    await this.projectsService.getProjectById(userId, projectId);

    return this.prisma.activity.findMany({
      where: {
        userId,
        projectId,
      },
      orderBy: { createdAt: 'desc' },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            fullName: true,
          },
        },
      },
    });
  }

  /**
   * Create an activity for the authenticated user.
   */
  async createActivity(userId: string, dto: CreateActivityDto) {
    this.checkUserId(userId);

    if (dto.projectId) {
      // Verify project belongs to authenticated user before attaching
      await this.projectsService.getProjectById(userId, dto.projectId);
    }

    return this.prisma.activity.create({
      data: {
        type: dto.type,
        title: dto.title,
        details: dto.details || null,
        user: {
          connect: { id: userId },
        },
        ...(dto.projectId && {
          project: {
            connect: { id: dto.projectId },
          },
        }),
      },
    });
  }

  /**
   * Fetch single activity by ID, ensuring ownership.
   */
  async getActivityById(userId: string, activityId: string) {
    this.checkUserId(userId);

    const activity = await this.prisma.activity.findUnique({
      where: { id: activityId },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            fullName: true,
          },
        },
      },
    });

    if (!activity) {
      throw new NotFoundException('Activity record not found.');
    }

    if (activity.userId !== userId) {
      throw new ForbiddenException('You do not have permission to access this activity.');
    }

    return activity;
  }

  /**
   * Delete an activity by ID, ensuring ownership.
   */
  async deleteActivity(userId: string, activityId: string) {
    await this.getActivityById(userId, activityId);

    return this.prisma.activity.delete({
      where: { id: activityId },
    });
  }
}