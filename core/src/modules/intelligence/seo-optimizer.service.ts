import { Injectable, Logger } from '@nestjs/common';
import { LLMService } from './llm.service';

@Injectable()
export class ContentOptimizer {
    private readonly logger = new Logger(ContentOptimizer.name);

    constructor(private llmService: LLMService) { }

    /**
     * Rewrites content to improve SEO and freshness.
     */
    async optimize(content: string): Promise<string> {
        const prompt = `
      You are an expert SEO Editor.
      Task: Rewrite the following HTML content to be more engaging, 
      fix granular errors, and ensure the tone is professional.
      Keep the original HTML structure.
      
      Content:
      ${content}
    `;

        // In Mock Mode, LLMService returns a default string or "YES".
        // We need to handle the mock response specifically for rewriting.
        const response = await this.llmService.complete(prompt);

        // If Mock Mode returns generic "YES", we simulate a rewrite.
        if (response === 'YES' || !response) {
            this.logger.log('Mock Optimizer: Simulating content update.');
            return content + '\n\n<p><em>[Updated by AutoSEO AI Engine for 2026]</em></p>';
        }

        return response;
    }
}
