import { Injectable, Logger } from '@nestjs/common';
import { LLMService } from './llm.service';

@Injectable()
export class ContentAnalysisService {
    private readonly logger = new Logger(ContentAnalysisService.name);

    constructor(private llmService: LLMService) { }

    async extractKeywords(content: string): Promise<string[]> {
        // Truncate content for LLM context window limits (rough valid approximation)
        const truncatedContent = content.substring(0, 3000);

        const prompt = `
            Analyze the following text and extract the top 5 most relevant SEO keywords or phrases.
            Return ONLY a comma-separated list of keywords. 
            Do not number them.
            
            Text:
            "${truncatedContent}"
        `;

        const response = await this.llmService.complete(prompt);

        if (!response || response === 'YES' || response === 'NO') {
            // Mock Fallback
            this.logger.log('Mock Keyword Extraction used.');
            return ['mock keyword 1', 'seo automation', 'ai content'];
        }

        // Clean and split
        return response.split(',')
            .map(k => k.trim())
            .filter(k => k.length > 2);
    }
}
