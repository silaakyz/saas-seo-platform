// Native fetch is available in Node 18+

async function testCrawl() {
    console.log('🚀 Triggering Crawl for https://docs.nestjs.com ...');

    try {
        const response = await fetch('http://localhost:3000/sites', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: 'https://docs.nestjs.com' })
        });

        const data = await response.json();
        console.log('✅ Response:', data);

        console.log('⏳ Waiting 10 seconds for crawler to work...');
        await new Promise(r => setTimeout(r, 10000));

        console.log('🔍 Checking Results...');
        const sitesRes = await fetch('http://localhost:3000/sites');
        const sites = await sitesRes.json();

        console.log('📊 Sites Found:', JSON.stringify(sites, null, 2));
    } catch (e) {
        console.error('❌ Error:', e);
    }
}

testCrawl();
