import { Injectable } from '@nestjs/common';
import { JSDOM } from 'jsdom';

@Injectable()
export class DateExtractorService {
    extractDate(html: string): Date | null {
        try {
            const dom = new JSDOM(html);
            const doc = dom.window.document;

            // Common meta tags for dates
            const metaTags = [
                'meta[property="article:published_time"]',
                'meta[name="article:published_time"]',
                'meta[property="og:updated_time"]',
                'meta[name="date"]',
                'meta[name="pubdate"]',
                'time[itemprop="datePublished"]',
            ];

            for (const selector of metaTags) {
                const element = doc.querySelector(selector);
                const content = element ? (element.getAttribute('content') || element.getAttribute('datetime')) : null;
                if (content) {
                    const date = new Date(content);
                    // Check if valid date
                    if (!isNaN(date.getTime())) {
                        return date;
                    }
                }
            }

            // Fallback: Check for URL date patterns (e.g. /2024/01/24/...)
            // Todo: Implement URL date regex if needed

            return null;
        } catch (e) {
            return null;
        }
    }
}
