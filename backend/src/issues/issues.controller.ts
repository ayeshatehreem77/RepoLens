import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { IssuesService } from './issues.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('issues')
@UseGuards(JwtAuthGuard)
export class IssuesController {
  constructor(private readonly issuesService: IssuesService) {}

  private extractUserId(req: any): string {
    const userId = req.user?.sub || req.user?.userId || req.user?.id;
    if (!userId) {
      throw new UnauthorizedException('User ID could not be identified from token.');
    }
    return userId;
  }

  @Get('project/:projectId')
  async getGithubIssuesForProject(
    @Req() req: any,
    @Param('projectId') projectId: string,
  ) {
    const userId = this.extractUserId(req);
    return this.issuesService.getGithubIssuesForProject(userId, projectId);
  }

  @Post('project/:projectId/sync')
  async syncIssuesForProject(
    @Req() req: any,
    @Param('projectId') projectId: string,
  ) {
    const userId = this.extractUserId(req);
    return this.issuesService.syncIssuesForProject(userId, projectId);
  }

  @Get(':id')
  async getIssueById(@Req() req: any, @Param('id') issueId: string) {
    const userId = this.extractUserId(req);
    return this.issuesService.getIssueById(userId, issueId);
  }
}