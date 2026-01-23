import { Controller, Post, Body } from '@nestjs/common';
import { ContentOptimizer } from './seo-optimizer.service';

@Controller('intelligence')
export class IntelligenceController {
    constructor(private optimizer: ContentOptimizer) { }

    @Post('rewrite')
    async rewrite(@Body('content') content: string) {
        const optimized = await this.optimizer.optimize(content);
        return {
            originalLength: content.length,
            optimizedLength: optimized.length,
            result: optimized
        };
    }
}
