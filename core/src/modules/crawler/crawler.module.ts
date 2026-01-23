import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CrawlerService } from './crawler.service';
import { SitemapReaderService } from './sitemap-reader.service';
import { Article } from '../articles/entities/article.entity';
import { ArticleVersion } from '../articles/entities/article-version.entity';
import { Site } from '../sites/entities/site.entity';
import { Keyword } from '../intelligence/entities/keyword.entity';
import { QueueModule } from '../queue/queue.module';

import { CrawlerController } from './crawler.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Article, ArticleVersion, Site, Keyword]), QueueModule],
    controllers: [CrawlerController],
    providers: [CrawlerService, SitemapReaderService],
    exports: [CrawlerService],
})
export class CrawlerModule { }
