import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { OrchestratorService } from './orchestrator.service';
import { Article } from '../articles/entities/article.entity';
import { Site } from '../sites/entities/site.entity';
import { QueueModule } from '../queue/queue.module';

@Module({
    imports: [
        ScheduleModule.forRoot(),
        TypeOrmModule.forFeature([Article, Site]),
        QueueModule
    ],
    providers: [OrchestratorService],
})
export class OrchestratorModule { }
