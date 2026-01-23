import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContentAnalysisService } from './content-analysis.service';
import { LinkingEngine } from './linking.engine';
import { Keyword } from './entities/keyword.entity';
import { InternalLink } from './entities/internal-link.entity';
import { Article } from '../articles/entities/article.entity';
import { KeywordsController } from './keywords.controller';
import { LLMService } from './llm.service';
import { ContentOptimizer } from './seo-optimizer.service';
import { IntelligenceController } from './intelligence.controller';
import { ArticleProcessor } from './article.processor';

@Module({
    imports: [TypeOrmModule.forFeature([Keyword, Article, InternalLink])],
    controllers: [KeywordsController, IntelligenceController],
    providers: [ContentAnalysisService, LinkingEngine, LLMService, ContentOptimizer, ArticleProcessor],
    exports: [ContentAnalysisService, LinkingEngine, LLMService, ContentOptimizer],
})
export class IntelligenceModule { }
