import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import * as xml2js from 'xml2js';

@Injectable()
export class SitemapReaderService {
    private readonly logger = new Logger(SitemapReaderService.name);

    async fetchSitemap(url: string): Promise<string[]> {
        try {
            this.logger.log(`Fetching sitemap: ${url}`);
            const response = await axios.get(url);
            const parser = new xml2js.Parser();
            const result = await parser.parseStringPromise(response.data);

            const urls: string[] = [];

            // Handle sitemapindex (nested sitemaps)
            if (result.sitemapindex && result.sitemapindex.sitemap) {
                for (const sitemap of result.sitemapindex.sitemap) {
                    if (sitemap.loc) {
                        const nestedUrls = await this.fetchSitemap(sitemap.loc[0]);
                        urls.push(...nestedUrls);
                    }
                }
            }
            // Handle urlset (actual urls)
            else if (result.urlset && result.urlset.url) {
                for (const urlEntry of result.urlset.url) {
                    if (urlEntry.loc) {
                        urls.push(urlEntry.loc[0]);
                    }
                }
            }

            this.logger.log(`Found ${urls.length} URLs in sitemap: ${url}`);
            return urls;
        } catch (error) {
            this.logger.error(`Error processing sitemap ${url}: ${error.message}`);
            return [];
        }
    }
}
