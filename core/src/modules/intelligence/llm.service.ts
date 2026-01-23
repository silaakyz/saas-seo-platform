import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class LLMService {
    private readonly logger = new Logger(LLMService.name);
    private openai: OpenAI | null = null;

    constructor(private configService: ConfigService) {
        const apiKey = this.configService.get<string>('OPENAI_API_KEY');
        if (apiKey) {
            this.openai = new OpenAI({ apiKey });
            this.logger.log('LLMService initialized with OpenAI');
        } else {
            this.logger.warn('LLMService initialized in MOCK mode (No API Key)');
        }
    }

    async complete(prompt: string): Promise<string> {
        if (!this.openai) {
            this.logger.log(`[MOCK LLM] Prompt: ${prompt.substring(0, 50)}...`);
            return "YES"; // Default mock response for binary checks
        }

        try {
            const response = await this.openai.chat.completions.create({
                model: 'gpt-4o',
                messages: [{ role: 'user', content: prompt }],
            });
            return response.choices[0].message.content || '';
        } catch (e) {
            this.logger.error(`LLM Error: ${e.message}`);
            return '';
        }
    }

    /**
     * Specialized method for semantic link validation
     */
    async shouldLink(term: string, context: string): Promise<boolean> {
        const prompt = `
      Context: "${context}"
      Term: "${term}"
      
      Should the term be linked to a definition/page about "${term}" in this specific context?
      If the term is used generally or incorrectly, answer NO.
      If it refers to the specific technology/entity, answer YES.
      Reply ONLY with YES or NO.
    `;

        const ans = await this.complete(prompt);
        return ans.trim().toUpperCase().includes('YES');
    }
}
