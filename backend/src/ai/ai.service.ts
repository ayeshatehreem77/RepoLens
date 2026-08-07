import {
  Injectable,
  Inject,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProjectsService } from '../projects/projects.service';
import type { IAiProvider, AiProjectContext } from './interfaces/ai-provider.interface';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly projectsService: ProjectsService,
    @Inject('AI_PROVIDER') private readonly aiProvider: IAiProvider,
  ) {}

  private checkUserId(userId: string) {
    if (!userId) {
      throw new UnauthorizedException('User identification missing from token.');
    }
  }

  private async buildProjectContext(userId: string, projectId: string): Promise<AiProjectContext> {
    this.checkUserId(userId);

    const project = await this.projectsService.getProjectById(userId, projectId);

    const [issues, pullRequests, activities] = await Promise.all([
      this.prisma.issue.findMany({
        where: { projectId },
        select: { title: true, state: true, author: true },
      }),
      this.prisma.pullRequest.findMany({
        where: { projectId },
        select: { title: true, state: true, author: true },
      }),
      this.prisma.activity.findMany({
        where: { projectId, userId },
        select: { type: true, title: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
    ]);

    return {
      project: {
        id: project.id,
        name: project.name,
        fullName: project.fullName,
        description: project.description,
        language: project.language,
        stars: project.stars,
        forks: project.forks,
        openIssues: project.openIssues,
      },
      issues,
      pullRequests,
      activities,
    };
  }

  async getProjectSummary(userId: string, projectId: string) {
    const context = await this.buildProjectContext(userId, projectId);
    const summary = await this.aiProvider.generateSummary(context);
    return {
      projectId,
      provider: this.aiProvider.name,
      summary,
    };
  }

  async analyzeProject(userId: string, projectId: string) {
    const context = await this.buildProjectContext(userId, projectId);
    const analysis = await this.aiProvider.generateAnalysis(context);
    return {
      projectId,
      provider: this.aiProvider.name,
      analysis,
    };
  }

  async askProjectQuestion(userId: string, projectId: string, question: string) {
    const context = await this.buildProjectContext(userId, projectId);
    const answer = await this.aiProvider.answerQuestion(context, question);
    return {
      projectId,
      provider: this.aiProvider.name,
      question,
      answer,
    };
  }
}