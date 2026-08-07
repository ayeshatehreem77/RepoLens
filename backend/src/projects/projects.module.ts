import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { GithubModule } from '../github/github.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [GithubModule, PrismaModule],
  controllers: [ProjectsController],
  providers: [ProjectsService],
  exports: [ProjectsService],
})
export class ProjectsModule {}