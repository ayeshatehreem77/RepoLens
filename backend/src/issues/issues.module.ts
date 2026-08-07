import { Module } from '@nestjs/common';
import { IssuesService } from './issues.service';
import { IssuesController } from './issues.controller';
import { GithubModule } from '../github/github.module';
import { ProjectsModule } from '../projects/projects.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [GithubModule, ProjectsModule, PrismaModule],
  controllers: [IssuesController],
  providers: [IssuesService],
  exports: [IssuesService],
})
export class IssuesModule {}