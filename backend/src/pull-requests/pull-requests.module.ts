import { Module } from '@nestjs/common';
import { PullRequestsService } from './pull-requests.service';
import { PullRequestsController } from './pull-requests.controller';
import { GithubModule } from '../github/github.module';
import { ProjectsModule } from '../projects/projects.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [GithubModule, ProjectsModule, PrismaModule],
  controllers: [PullRequestsController],
  providers: [PullRequestsService],
  exports: [PullRequestsService],
})
export class PullRequestsModule {}