import { Module } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { ActivityController } from './activity.controller';
import { ProjectsModule } from '../projects/projects.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [ProjectsModule, PrismaModule],
  controllers: [ActivityController],
  providers: [ActivityService],
  exports: [ActivityService],
})
export class ActivityModule {}