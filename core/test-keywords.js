// Native fetch (Node 18+)
async function test() {
    console.log('🧪 Testing Keywords Logic...');

    // 1. Add Keyword
    // We need a siteId first. I'll pick the one from my verify-db output manually or fetch it.
    // Fetch sites first
    const sitesRes = await fetch('http://localhost:3000/sites');
    const sites = await sitesRes.json();
    if (sites.length === 0) { console.log('❌ No sites found. Crawl first.'); return; }
    const siteId = sites[0].id;
    console.log(`📍 Using Site ID: ${siteId}`);

    const kwRes = await fetch('http://localhost:3000/keywords', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            siteId,
            term: 'NestJS',
            url: 'https://nestjs.com'
        })
    });
    console.log('📝 Add Keyword:', await kwRes.json());

    // 2. Test Linking
    const content = "I love NestJS framework.";
    const linkRes = await fetch('http://localhost:3000/keywords/test-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ siteId, content })
    });
    const linkResult = await linkRes.json();
    console.log('🔗 Link Result:', linkResult);
}

test();
