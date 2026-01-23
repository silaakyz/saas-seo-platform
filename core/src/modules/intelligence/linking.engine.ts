import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Keyword } from './entities/keyword.entity';
import { InternalLink } from './entities/internal-link.entity';
import { LLMService } from './llm.service';

@Injectable()
export class LinkingEngine {
    private readonly logger = new Logger(LinkingEngine.name);

    constructor(
        @InjectRepository(Keyword)
        private keywordRepo: Repository<Keyword>,
        @InjectRepository(InternalLink)
        private linkRepo: Repository<InternalLink>,
        private llmService: LLMService,
    ) { }

    /**
     * Scans content and injects links for matching keywords.
     * Uses AI to validate context.
     * Prevents loops and excessive linking.
     */
    async injectLinks(content: string, siteId: string, currentArticleId?: string): Promise<string> {
        // 1. Get Keywords excluding current article (No Self-Linking)
        let keywords = await this.keywordRepo.find({ where: { site_id: siteId } });

        if (currentArticleId) {
            keywords = keywords.filter((k: Keyword) => k.source_article_id !== currentArticleId);
        }

        if (!keywords.length) return content;

        let processedContent = content;
        let linksAdded = 0;
        const maxLinksPerArticle = 5; // Configurable limit

        for (const kw of keywords) {
            if (linksAdded >= maxLinksPerArticle) break;

            // 2. Loop Prevention
            if (currentArticleId && kw.source_article_id) {
                const existingLink = await this.linkRepo.findOne({
                    where: {
                        source_article_id: currentArticleId,
                        target_article_id: kw.source_article_id
                    }
                });
                if (existingLink) continue; // Already linked
            }

            // 3. Find match
            const regex = new RegExp(`\\b(${kw.term})\\b`, 'i');
            const match = processedContent.match(regex);

            if (match) {
                // 4. Extract Context
                const index = match.index!;
                const start = Math.max(0, index - 50);
                const end = Math.min(processedContent.length, index + 50 + kw.term.length);
                const context = processedContent.substring(start, end);

                // 5. Ask AI
                const isValid = await this.llmService.shouldLink(kw.term, context);

                if (isValid) {
                    this.logger.log(`Valid Link found: ${kw.term} -> ${kw.target_url}`);

                    processedContent = processedContent.replace(regex, `<a href="${kw.target_url}" class="autoseo-link">$1</a>`);
                    linksAdded++;

                    // 6. Persist Link Graph
                    if (currentArticleId && kw.source_article_id) {
                        try {
                            await this.linkRepo.save({
                                source_article_id: currentArticleId,
                                target_article_id: kw.source_article_id,
                                keyword_used: kw.term,
                                relevance_score: 1.0
                            });
                        } catch (e) {
                            this.logger.error(`Failed to save link record: ${e.message}`);
                        }
                    }
                }
            }
        }

        return processedContent;
    }
}
