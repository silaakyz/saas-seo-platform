import { Controller, Post, Body, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Controller('crawler')
export class CrawlerController {
    private readonly logger = new Logger(CrawlerController.name);

    constructor(private eventEmitter: EventEmitter2) { }

    @Post('start')
    async startCrawl(@Body() body: { url: string; siteId?: string }) {
        const siteId = body.siteId || 'default-site-id'; // For MVP
        this.logger.log(`Received crawl request for: ${body.url}`);

        this.eventEmitter.emit('CRAWL_SITE', {
            siteId,
            url: body.url
        });

        return {
            message: 'Crawl process started',
            url: body.url,
            siteId
        };
    }
}
