import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QueueService } from './queue.service';
import { ArticleProcessor } from './processors/article.processor';
import { Article } from '../articles/entities/article.entity';
import { ArticleVersion } from '../articles/entities/article-version.entity';
import { Keyword } from '../intelligence/entities/keyword.entity';
import { IntelligenceModule } from '../intelligence/intelligence.module';
import { ParserModule } from '../parser/parser.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Article, ArticleVersion, Keyword]),
        ParserModule,
        IntelligenceModule
    ],
    providers: [QueueService, ArticleProcessor],
    exports: [QueueService],
})
export class QueueModule { }
