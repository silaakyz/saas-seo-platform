import { Controller, Post, Body, Get } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Site } from './entities/site.entity';
import { QueueService } from '../queue/queue.service';

@Controller('sites')
export class SitesController {
    constructor(
        @InjectRepository(Site)
        private sitesRepository: Repository<Site>,
        private queueService: QueueService,
    ) { }

    @Post()
    async addSite(@Body('url') url: string) {
        // 1. Save Site
        const domain = new URL(url).hostname;
        const site = this.sitesRepository.create({
            url,
            domain,
            settings: { crawl_frequency: 'daily' },
        });
        const savedSite = await this.sitesRepository.save(site);

        // 2. Trigger Crawl
        await this.queueService.addJob('CRAWL_SITE', {
            siteId: savedSite.id,
            url: savedSite.url,
        });

        return { message: 'Site added and crawling started', site: savedSite };
    }

    @Get()
    async findAll() {
        return this.sitesRepository.find({ relations: ['articles'] });
    }
}
