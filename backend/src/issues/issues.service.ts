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
export class IssuesService {
  private readonly logger = new Logger(IssuesService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly githubService: GithubService,
    private readonly projectsService: ProjectsService,
  ) {}

  /**
   * Validates that the project exists and belongs to the authenticated user.
   */
  private async validateProjectOwnership(userId: string, projectId: string) {
    if (!userId) {
      throw new UnauthorizedException('User identification missing from token.');
    }
    return this.projectsService.getProjectById(userId, projectId);
  }

  /**
   * Fetch issues directly from GitHub for a project.
   */
  async getGithubIssuesForProject(userId: string, projectId: string) {
    const project = await this.validateProjectOwnership(userId, projectId);
    
    // Fetch issues using existing GithubService instance
    const issues = await this.githubService.getRepositoryIssues(
      project.owner,
      project.name,
    );

    // Filter out pull requests (GitHub REST API includes PRs in the issues endpoint)
    return issues.filter((issue: any) => !issue.pull_request);
  }

  /**
   * Fetch issues from GitHub and upsert them into the database.
   */
  async syncIssuesForProject(userId: string, projectId: string) {
    const project = await this.validateProjectOwnership(userId, projectId);

    const githubIssues = await this.githubService.getRepositoryIssues(
      project.owner,
      project.name,
    );

    // Filter out pull requests
    const pureIssues = githubIssues.filter((issue: any) => !issue.pull_request);

    // Process each issue with upsert based on @@unique([projectId, githubId])
    const syncedIssues = await Promise.all(
      pureIssues.map(async (issue: any) => {
        const githubId = issue.id;
        const labelsData = issue.labels
          ? issue.labels.map((label: any) =>
              typeof label === 'string' ? label : label.name,
            )
          : [];

        return this.prisma.issue.upsert({
          where: {
            projectId_githubId: {
              projectId: project.id,
              githubId,
            },
          },
          update: {
            number: issue.number,
            title: issue.title,
            body: issue.body || null,
            state: issue.state,
            author: issue.user?.login || null,
            labels: labelsData,
            comments: issue.comments || 0,
            updatedAt: new Date(issue.updated_at),
          },
          create: {
            githubId,
            number: issue.number,
            title: issue.title,
            body: issue.body || null,
            state: issue.state,
            author: issue.user?.login || null,
            labels: labelsData,
            comments: issue.comments || 0,
            createdAt: new Date(issue.created_at),
            updatedAt: new Date(issue.updated_at),
            projectId: project.id,
          },
        });
      }),
    );

    return syncedIssues;
  }

  /**
   * Get a single database issue by ID, ensuring user ownership of the parent project.
   */
  async getIssueById(userId: string, issueId: string) {
    const issue = await this.prisma.issue.findUnique({
      where: { id: issueId },
      include: { project: true },
    });

    if (!issue) {
      throw new NotFoundException('Issue not found.');
    }

    if (issue.project.userId !== userId) {
      throw new ForbiddenException('You do not have access to this issue.');
    }

    return issue;
  }
}