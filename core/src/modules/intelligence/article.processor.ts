import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from '../articles/entities/article.entity';
import { ContentOptimizer } from './seo-optimizer.service';
import { LinkingEngine } from './linking.engine';

@Injectable()
export class ArticleProcessor {
    private readonly logger = new Logger(ArticleProcessor.name);

    constructor(
        @InjectRepository(Article)
        private articleRepo: Repository<Article>,
        private optimizer: ContentOptimizer,
        private linker: LinkingEngine,
    ) { }

    @OnEvent('PROCESS_ARTICLE')
    async handleProcess(payload: { articleId: string; siteId: string }) {
        this.logger.log(`🔄 Processing Article: ${payload.articleId}`);

        const article = await this.articleRepo.findOne({ where: { id: payload.articleId } });
        if (!article || !article.content_raw) return;

        // 1. Rewrite Content (SEO Optimization)
        this.logger.log('Step 1: Optimizing Content...');
        let processed = await this.optimizer.optimize(article.content_raw);

        // 2. Internal Linking
        this.logger.log('Step 2: Injecting Internal Links...');
        processed = await this.linker.injectLinks(processed, payload.siteId);

        // 3. Save / Publish
        article.content = processed;
        article.status = 'PUBLISHED';
        article.version += 1;

        await this.articleRepo.save(article);
        this.logger.log('✅ Article Processed & Saved.');
    }
}
