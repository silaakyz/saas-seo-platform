import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { SitesModule } from './modules/sites/sites.module';
import { ArticlesModule } from './modules/articles/articles.module';
import { CrawlerModule } from './modules/crawler/crawler.module';
import { IntelligenceModule } from './modules/intelligence/intelligence.module';
import { QueueModule } from './modules/queue/queue.module';
import { OrchestratorModule } from './modules/orchestrator/orchestrator.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    SitesModule,
    ArticlesModule,
    CrawlerModule,
    IntelligenceModule,
    QueueModule,
    OrchestratorModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
