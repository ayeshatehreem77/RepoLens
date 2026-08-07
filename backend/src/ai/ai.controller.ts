import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { AiService } from './ai.service';
import { AskAiDto } from './dto/ask-ai.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('ai')
@UseGuards(JwtAuthGuard)
export class AiController {
  constructor(private readonly aiService: AiService) {}

  private extractUserId(req: any): string {
    const userId = req.user?.sub || req.user?.userId || req.user?.id;
    if (!userId) {
      throw new UnauthorizedException('User ID could not be identified from token.');
    }
    return userId;
  }

  @Get('project/:projectId/summary')
  async getProjectSummary(
    @Req() req: any,
    @Param('projectId') projectId: string,
  ) {
    const userId = this.extractUserId(req);
    return this.aiService.getProjectSummary(userId, projectId);
  }

  @Post('project/:projectId/analyze')
  async analyzeProject(
    @Req() req: any,
    @Param('projectId') projectId: string,
  ) {
    const userId = this.extractUserId(req);
    return this.aiService.analyzeProject(userId, projectId);
  }

  @Post('project/:projectId/ask')
  async askProjectQuestion(
    @Req() req: any,
    @Param('projectId') projectId: string,
    @Body() askAiDto: AskAiDto,
  ) {
    const userId = this.extractUserId(req);
    return this.aiService.askProjectQuestion(
      userId,
      projectId,
      askAiDto.question,
    );
  }
}