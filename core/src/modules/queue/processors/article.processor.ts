import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from '../../articles/entities/article.entity';
import { ArticleVersion } from '../../articles/entities/article-version.entity';
import { Keyword } from '../../intelligence/entities/keyword.entity';
import { HtmlParserService } from '../../parser/html-parser.service';
import { DateExtractorService } from '../../parser/date-extractor.service';
import { ContentAnalysisService } from '../../intelligence/content-analysis.service';
import { LinkingEngine } from '../../intelligence/linking.engine';

@Injectable()
export class ArticleProcessor {
    private readonly logger = new Logger(ArticleProcessor.name);

    constructor(
        @InjectRepository(Article)
        private articleRepo: Repository<Article>,
        @InjectRepository(ArticleVersion)
        private articleVersionRepo: Repository<ArticleVersion>,
        @InjectRepository(Keyword)
        private keywordRepo: Repository<Keyword>,
        private htmlParser: HtmlParserService,
        private dateExtractor: DateExtractorService,
        private contentAnalysis: ContentAnalysisService,
        private linkingEngine: LinkingEngine,
    ) { }

    @OnEvent('PROCESS_ARTICLE')
    async handleProcessArticle(payload: { articleId: string; siteId: string }) {
        this.logger.log(`Processing article: ${payload.articleId}`);

        const article = await this.articleRepo.findOne({
            where: { id: payload.articleId },
            relations: ['versions'] // We might need this, or just query version directly
        });

        if (!article) {
            this.logger.error(`Article not found: ${payload.articleId}`);
            return;
        }

        // Get latest version
        const latestVersion = await this.articleVersionRepo.findOne({
            where: { article_id: article.id },
            order: { version_number: 'DESC' }
        });

        if (!latestVersion || !latestVersion.content_raw) {
            this.logger.warn(`No content to process for article: ${payload.articleId}`);
            return;
        }

        // PARSE Content
        const parsed = this.htmlParser.parse(latestVersion.content_raw, article.original_url);

        if (parsed) {
            // 1. EXTRACT KEYWORDS (AI)
            this.logger.log('Extracting keywords...');
            const keywords = await this.contentAnalysis.extractKeywords(parsed.textContent);

            // Save Keywords
            for (const term of keywords) {
                // Check dupes
                const exists = await this.keywordRepo.findOne({ where: { site_id: payload.siteId, term } });
                if (!exists) {
                    await this.keywordRepo.save({
                        site_id: payload.siteId,
                        term,
                        target_url: article.original_url,
                        source_article_id: article.id,
                        priority: 7
                    });
                }
            }
            this.logger.log(`Extracted ${keywords.length} keywords.`);

            // 2. OPTIMIZE CONTENT (AI - Rewrite) (Skipped for now, but ready)
            let finalContent = parsed.content;

            // 3. INTERNAL LINKING (Graph)
            this.logger.log('Injecting internal links...');
            finalContent = await this.linkingEngine.injectLinks(finalContent, payload.siteId, article.id);

            // Update Article Date if found
            if (!article.published_at) {
                const date = this.dateExtractor.extractDate(latestVersion.content_raw);
                if (date) {
                    article.published_at = date;
                    await this.articleRepo.save(article);
                    this.logger.log(`Updated published date: ${date}`);
                }
            }

            // UPDATE VERSION
            latestVersion.content_processed = finalContent;
            // Store keywords as JSON array
            latestVersion.focus_keywords = keywords;

            await this.articleVersionRepo.save(latestVersion);
            this.logger.log(`Successfully processed version ${latestVersion.version_number} for article ${article.id}`);
        }
    }
}
