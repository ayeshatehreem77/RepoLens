import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GithubService } from '../github/github.service';
import { ProjectsService } from '../projects/projects.service';

@Injectable()
export class PullRequestsService {
  private readonly logger = new Logger(PullRequestsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly githubService: GithubService,
    private readonly projectsService: ProjectsService,
  ) {}

  /**
   * Helper to ensure the project exists and belongs to the authenticated user.
   */
  private async validateProjectOwnership(userId: string, projectId: string) {
    if (!userId) {
      throw new UnauthorizedException('User identification missing from token.');
    }
    return this.projectsService.getProjectById(userId, projectId);
  }

  /**
   * Fetch PRs directly from GitHub for a project.
   */
  async getGithubPullRequestsForProject(userId: string, projectId: string) {
    const project = await this.validateProjectOwnership(userId, projectId);

    return this.githubService.getRepositoryPullRequests(
      project.owner,
      project.name,
    );
  }

  /**
   * Fetch PRs from GitHub and upsert them into Prisma database.
   */
  async syncPullRequestsForProject(userId: string, projectId: string) {
    const project = await this.validateProjectOwnership(userId, projectId);

    const githubPrs = await this.githubService.getRepositoryPullRequests(
      project.owner,
      project.name,
    );

    const syncedPrs = await Promise.all(
      githubPrs.map(async (pr: any) => {
        const githubId = pr.id;

        return this.prisma.pullRequest.upsert({
          where: {
            projectId_githubId: {
              projectId: project.id,
              githubId,
            },
          },
          update: {
            number: pr.number,
            title: pr.title,
            body: pr.body || null,
            state: pr.state,
            author: pr.user?.login || null,
            reviewStatus: null, // Safe default since standard list pulls endpoint doesn't include full review states
            comments: pr.comments || 0,
            changedFiles: pr.changed_files || 0,
            updatedAt: new Date(pr.updated_at),
          },
          create: {
            githubId,
            number: pr.number,
            title: pr.title,
            body: pr.body || null,
            state: pr.state,
            author: pr.user?.login || null,
            reviewStatus: null,
            comments: pr.comments || 0,
            changedFiles: pr.changed_files || 0,
            createdAt: new Date(pr.created_at),
            updatedAt: new Date(pr.updated_at),
            projectId: project.id,
          },
        });
      }),
    );

    return syncedPrs;
  }

  /**
   * Get a single database PR by ID, ensuring user ownership of the parent project.
   */
  async getPullRequestById(userId: string, prId: string) {
    const pr = await this.prisma.pullRequest.findUnique({
      where: { id: prId },
      include: { project: true },
    });

    if (!pr) {
      throw new NotFoundException('Pull request not found.');
    }

    if (pr.project.userId !== userId) {
      throw new ForbiddenException('You do not have access to this pull request.');
    }

    return pr;
  }
}