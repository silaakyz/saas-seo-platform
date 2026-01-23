import { Injectable, Logger } from '@nestjs/common';
import { Readability } from '@mozilla/readability';
import { JSDOM } from 'jsdom';

export interface ParsedContent {
    title: string;
    content: string;
    textContent: string;
    excerpt: string;
    byline: string;
    siteName: string;
}

@Injectable()
export class HtmlParserService {
    private readonly logger = new Logger(HtmlParserService.name);

    parse(html: string, url: string): ParsedContent | null {
        try {
            const doc = new JSDOM(html, { url });
            const reader = new Readability(doc.window.document);
            const article = reader.parse();

            if (!article) {
                this.logger.warn(`Failed to parse content from ${url}`);
                return null;
            }

            return {
                title: article.title || '',
                content: article.content || '',
                textContent: article.textContent || '',
                excerpt: article.excerpt || '',
                byline: article.byline || '',
                siteName: article.siteName || ''
            };
        } catch (error) {
            this.logger.error(`Error parsing HTML from ${url}: ${error.message}`);
            return null;
        }
    }
}
