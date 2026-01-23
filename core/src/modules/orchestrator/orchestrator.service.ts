import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Article } from '../articles/entities/article.entity';
import { Site } from '../sites/entities/site.entity';
import { QueueService } from '../queue/queue.service';

@Injectable()
export class OrchestratorService {
    private readonly logger = new Logger(OrchestratorService.name);

    constructor(
        @InjectRepository(Article)
        private articleRepo: Repository<Article>,
        @InjectRepository(Site)
        private siteRepo: Repository<Site>,
        private queueService: QueueService,
    ) { }

    /**
     * Stale Content Refresher
     * Runs every day at 3 AM.
     * Finds articles that are due for update.
     */
    @Cron(CronExpression.EVERY_DAY_AT_3AM)
    async refreshStaleContent() {
        this.logger.log('⏰ Running Stale Content Refresher...');

        const now = new Date();
        const staleArticles = await this.articleRepo.find({
            where: {
                next_update_at: LessThan(now),
            },
            take: 50 // Process in batches to avoid overload
        });

        this.logger.log(`Found ${staleArticles.length} outdated articles.`);

        for (const article of staleArticles) {
            this.logger.log(`Queueing refresh for: ${article.title}`);

            // Re-crawl
            this.queueService.addJob('CRAWL_SITE', {
                url: article.original_url,
                siteId: article.site_id
            });

            // Update next check time immediately to prevent double queueing (it will be properly set after crawl)
            article.next_update_at = new Date(Date.now() + 24 * 60 * 60 * 1000); // +1 day temp
            await this.articleRepo.save(article);
        }
    }

    /**
     * Periodic Discovery
     * Runs every 3 days.
     * Re-scans sitemaps to find new URLs.
     */
    @Cron('0 0 */3 * *') // Every 3 days at midnight
    async runPeriodicDiscovery() {
        this.logger.log('🔭 Running Periodic Discovery...');

        const sites = await this.siteRepo.find();

        for (const site of sites) {
            if (site.sitemap_url) {
                this.logger.log(`Queueing discovery for site: ${site.domain}`);
                this.queueService.addJob('CRAWL_SITE', {
                    url: site.sitemap_url,
                    siteId: site.id
                });
            }
        }
    }
}
