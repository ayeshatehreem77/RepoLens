import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  private extractUserId(req: any): string {
    const userId = req.user?.sub || req.user?.userId || req.user?.id;
    if (!userId) {
      throw new UnauthorizedException('User ID could not be identified from authentication token.');
    }
    return userId;
  }

  @Post()
  async createProject(@Req() req: any, @Body() createProjectDto: CreateProjectDto) {
    const userId = this.extractUserId(req);
    return this.projectsService.createProject(userId, createProjectDto);
  }

  @Get()
  async getUserProjects(@Req() req: any) {
    const userId = this.extractUserId(req);
    return this.projectsService.getUserProjects(userId);
  }

  @Get(':id')
  async getProjectById(@Req() req: any, @Param('id') projectId: string) {
    const userId = this.extractUserId(req);
    return this.projectsService.getProjectById(userId, projectId);
  }

  @Delete(':id')
  async deleteProject(@Req() req: any, @Param('id') projectId: string) {
    const userId = this.extractUserId(req);
    return this.projectsService.deleteProject(userId, projectId);
  }
}