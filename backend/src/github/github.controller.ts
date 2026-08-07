import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { GithubService } from './github.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('github')
@UseGuards(JwtAuthGuard)
export class GithubController {
  constructor(private readonly githubService: GithubService) {}

  @Get('me')
  async getAuthenticatedUser() {
    return this.githubService.getAuthenticatedUser();
  }

  @Get('repos')
  async getRepositories() {
    return this.githubService.getRepositories();
  }

  @Get('repos/:owner/:repo')
  async getRepository(
    @Param('owner') owner: string,
    @Param('repo') repo: string,
  ) {
    return this.githubService.getRepository(owner, repo);
  }

  @Get('repos/:owner/:repo/issues')
  async getRepositoryIssues(
    @Param('owner') owner: string,
    @Param('repo') repo: string,
  ) {
    return this.githubService.getRepositoryIssues(owner, repo);
  }

  @Get('repos/:owner/:repo/pulls')
  async getRepositoryPullRequests(
    @Param('owner') owner: string,
    @Param('repo') repo: string,
  ) {
    return this.githubService.getRepositoryPullRequests(owner, repo);
  }

  @Get('repos/:owner/:repo/commits')
  async getRepositoryCommits(
    @Param('owner') owner: string,
    @Param('repo') repo: string,
  ) {
    return this.githubService.getRepositoryCommits(owner, repo);
  }
}