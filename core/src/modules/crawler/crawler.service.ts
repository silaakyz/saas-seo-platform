import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PlaywrightCrawler, Dataset } from 'crawlee';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArticleVersion } from '../articles/entities/article-version.entity';
import { Article } from '../articles/entities/article.entity';
import { Site } from '../sites/entities/site.entity';
import { Keyword } from '../intelligence/entities/keyword.entity';
import { QueueService } from '../queue/queue.service';
import { SitemapReaderService } from './sitemap-reader.service';

@Injectable()
export class CrawlerService implements OnModuleInit {
    private readonly logger = new Logger(CrawlerService.name);
    private crawler: PlaywrightCrawler;

    constructor(
        @InjectRepository(Article)
        private articlesRepository: Repository<Article>,
        @InjectRepository(ArticleVersion)
        private articleVersionRepo: Repository<ArticleVersion>,
        @InjectRepository(Site)
        private sitesRepository: Repository<Site>,
        @InjectRepository(Keyword)
        private keywordRepo: Repository<Keyword>,
        private queueService: QueueService,
        private sitemapReader: SitemapReaderService,
    ) { }

    onModuleInit() {
        this.crawler = new PlaywrightCrawler({
            launchContext: {
                launchOptions: { headless: true },
            },
            requestHandler: async ({ request, page, enqueueLinks, log }) => {
                const title = await page.title();
                const content = await page.content();

                let publishedDate: Date = new Date();
                try {
                    const dateMeta = await page.getAttribute('meta[property="article:published_time"]', 'content');
                    if (dateMeta) publishedDate = new Date(dateMeta);
                } catch (e) { }

                log.info(`Processed ${request.url}: ${title}`);

                let article = await this.articlesRepository.findOne({ where: { original_url: request.url } });
                let isNew = false;

                if (!article) {
                    isNew = true;
                    article = this.articlesRepository.create({
                        original_url: request.url,
                        title: title,
                        content_raw: content,
                        published_at: publishedDate,
                        last_crawled_at: new Date(),
                        site_id: request.userData.siteId,
                        status: 'DISCOVERED',
                        version: 1
                    });
                    await this.articlesRepository.save(article);
                } else {
                    article.content_raw = content;
                    article.last_crawled_at = new Date();
                    article.version = (article.version || 1) + 1;
                    await this.articlesRepository.save(article);
                }

                // Create Version History
                const version = this.articleVersionRepo.create({
                    article_id: article.id,
                    version_number: article.version,
                    content_raw: content,
                    created_at: new Date()
                });
                await this.articleVersionRepo.save(version);

                // 1. Trigger Automation (Rewrite + Link)
                this.queueService.addJob('PROCESS_ARTICLE', {
                    articleId: article.id,
                    siteId: request.userData.siteId
                });

                // 2. AUTO-KEYWORD: Create a keyword from the title
                try {
                    // Check if title is suitable (not too long)
                    if (title && title.length < 100) {
                        const existingKw = await this.keywordRepo.findOne({ where: { term: title, site_id: request.userData.siteId } });
                        if (!existingKw) {
                            await this.keywordRepo.save({
                                site_id: request.userData.siteId,
                                term: title,
                                target_url: request.url,
                                priority: 5
                            });
                            log.info(`➕ Auto-created keyword: "${title}"`);
                        }
                    }
                } catch (e) {
                    log.warning(`Failed to auto-create keyword: ${e.message}`);
                }

                await enqueueLinks({
                    strategy: 'same-domain',
                    userData: { siteId: request.userData.siteId }
                });
            },
        });
    }

    @OnEvent('CRAWL_SITE')
    async handleCrawlSite(payload: { siteId: string; url: string }) {
        this.logger.log(`Starting crawl for site: ${payload.url}`);

        let urlsToCrawl = [payload.url];

        // Check for sitemap
        if (payload.url.endsWith('.xml') || payload.url.includes('sitemap')) {
            this.logger.log(`Detected sitemap URL: ${payload.url}`);
            const sitemapUrls = await this.sitemapReader.fetchSitemap(payload.url);
            if (sitemapUrls.length > 0) {
                urlsToCrawl = sitemapUrls;
                this.logger.log(`Queueing ${sitemapUrls.length} URLs from sitemap.`);
            }
        }

        // Limit for MVP to avoid killing the process
        if (urlsToCrawl.length > 50) {
            this.logger.warn(`Sitemap has ${urlsToCrawl.length} URLs. Limiting to 50 for MVP.`);
            urlsToCrawl = urlsToCrawl.slice(0, 50);
        }

        const requests = urlsToCrawl.map(url => ({
            url,
            userData: { siteId: payload.siteId }
        }));

        await this.crawler.run(requests);
    }
}
