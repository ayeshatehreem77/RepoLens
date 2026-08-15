import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { PullRequestsService } from './pull-requests.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('pull-requests')
@UseGuards(JwtAuthGuard)
export class PullRequestsController {
  constructor(private readonly pullRequestsService: PullRequestsService) {}

  private extractUserId(req: any): string {
    const userId = req.user?.sub || req.user?.userId || req.user?.id;
    if (!userId) {
      throw new UnauthorizedException('User ID could not be identified from token.');
    }
    return userId;
  }

  @Get('project/:projectId')
  async getGithubPullRequestsForProject(
    @Req() req: any,
    @Param('projectId') projectId: string,
  ) {
    const userId = this.extractUserId(req);
    return this.pullRequestsService.getGithubPullRequestsForProject(
      userId,
      projectId,
    );
  }

  @Post('project/:projectId/sync')
  async syncPullRequestsForProject(
    @Req() req: any,
    @Param('projectId') projectId: string,
  ) {
    const userId = this.extractUserId(req);
    return this.pullRequestsService.syncPullRequestsForProject(
      userId,
      projectId,
    );
  }

  @Get(':id')
  async getPullRequestById(@Req() req: any, @Param('id') prId: string) {
    const userId = this.extractUserId(req);
    return this.pullRequestsService.getPullRequestById(userId, prId);
  }
}