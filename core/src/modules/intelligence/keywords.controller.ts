import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Keyword } from './entities/keyword.entity';
import { LinkingEngine } from './linking.engine';

@Controller('keywords')
export class KeywordsController {
    constructor(
        @InjectRepository(Keyword)
        private keywordRepo: Repository<Keyword>,
        private linkingEngine: LinkingEngine,
    ) { }

    @Post()
    async addKeyword(@Body() body: { siteId: string; term: string; url: string }) {
        const kw = this.keywordRepo.create({
            site_id: body.siteId,
            term: body.term,
            target_url: body.url
        });
        return this.keywordRepo.save(kw);
    }

    @Get()
    async findAll(@Query('siteId') siteId: string) {
        return this.keywordRepo.find({ where: { site_id: siteId } });
    }

    /**
     * Test endpoint to see linking in action
     */
    @Post('test-link')
    async testLink(@Body() body: { siteId: string; content: string }) {
        const linked = await this.linkingEngine.injectLinks(body.content, body.siteId);
        return { original: body.content, linked };
    }
}
