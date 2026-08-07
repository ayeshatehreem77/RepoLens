import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GithubService } from '../github/github.service';
import { CreateProjectDto } from './dto/create-project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly githubService: GithubService,
  ) {}

  private parseOwnerAndRepo(dto: CreateProjectDto): { owner: string; repo: string } {
    if (dto.owner && dto.repo) {
      return { owner: dto.owner, repo: dto.repo };
    }

    if (dto.githubUrl) {
      try {
        const url = new URL(dto.githubUrl);
        const pathSegments = url.pathname.split('/').filter(Boolean);
        if (pathSegments.length >= 2) {
          return { owner: pathSegments[0], repo: pathSegments[1].replace(/\.git$/, '') };
        }
      } catch (error) {
        throw new BadRequestException('Invalid GitHub URL provided.');
      }
    }

    throw new BadRequestException('Provide either owner & repo OR a valid githubUrl.');
  }

  async createProject(userId: string, createProjectDto: CreateProjectDto) {
      if (!userId) {
          throw new UnauthorizedException('Valid User ID is required to create a project.');
        }
        
        const { owner, repo } = this.parseOwnerAndRepo(createProjectDto);
        
        // Fetch repository details directly from GitHub API
        const githubRepo = await this.githubService.getRepository(owner, repo);
        
        if (!githubRepo) {
            throw new NotFoundException(`GitHub repository '${owner}/${repo}' not found.`);
        }
        
        // Check if the project is already added
        const existingProject = await this.prisma.project.findUnique({
            where: { githubUrl: githubRepo.html_url },
        });
        
        if (existingProject) {
            throw new ConflictException('This GitHub repository has already been imported into RepoLens.');
        }
        
        // Save project in Prisma database using relation connection
        return this.prisma.project.create({
            data: {
                name: githubRepo.name,
                fullName: githubRepo.full_name,
                description: githubRepo.description || null,
                githubUrl: githubRepo.html_url,
                owner: githubRepo.owner.login,
                language: githubRepo.language || null,
                stars: githubRepo.stargazers_count || 0,
                forks: githubRepo.forks_count || 0,
                openIssues: githubRepo.open_issues_count || 0,
                user: {
                    connect: { id: userId },
                },
      },
    });
  }

  async getUserProjects(userId: string) {
    return this.prisma.project.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async getProjectById(userId: string, projectId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException('Project not found.');
    }

    if (project.userId !== userId) {
      throw new ForbiddenException('You do not have permission to access this project.');
    }

    return project;
  }

  async deleteProject(userId: string, projectId: string) {
    await this.getProjectById(userId, projectId);

    return this.prisma.project.delete({
      where: { id: projectId },
    });
  }
}