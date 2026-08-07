import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { MockAiProvider } from './providers/mock-ai.provider';
import { ProjectsModule } from '../projects/projects.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [ProjectsModule, PrismaModule],
  controllers: [AiController],
  providers: [
    AiService,
    MockAiProvider,
    {
      provide: 'AI_PROVIDER',
      useFactory: (mockProvider: MockAiProvider) => {
        const providerName = process.env.AI_PROVIDER || 'mock';
        // When you implement OpenAI/Gemini providers later, switch here:
        // if (providerName === 'openai') return openAiProvider;
        return mockProvider;
      },
      inject: [MockAiProvider],
    },
  ],
  exports: [AiService],
})
export class AiModule {}