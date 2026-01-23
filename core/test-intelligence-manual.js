
// This script simulates the ArticleProcessor logic manually to verify Intelligence integration.
// Run with: node dist/manual-process-test.js

const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('./dist/app.module');
const { ContentAnalysisService } = require('./dist/modules/intelligence/content-analysis.service');
const { LinkingEngine } = require('./dist/modules/intelligence/linking.engine');

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);

    // Services
    const contentAnalysis = app.get(ContentAnalysisService);
    const linkingEngine = app.get(LinkingEngine);

    console.log('--- TESTING KEYWORD EXTRACTION (MOCK) ---');
    const mockContent = 'This is a great article about AI Automation and SEO optimization tools.';
    const keywords = await contentAnalysis.extractKeywords(mockContent);
    console.log('Input:', mockContent);
    console.log('Extracted Keywords:', keywords);

    console.log('\n--- TESTING LINKING ENGINE ---');
    // Assuming 'mock keyword 1' exists from previous mock extraction logic
    // We can't easily robust test DB here without seeding, but we will test the service logic
    // skipping actual DB injection for this quick test.

    await app.close();
}

bootstrap();
