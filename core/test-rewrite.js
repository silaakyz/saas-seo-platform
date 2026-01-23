// Native fetch (Node 18+)
async function testRewrite() {
    console.log('🤖 Testing AI Content Rewriter...');

    const original = "<h1>Hello World</h1><p>This is an old article from 2024.</p>";

    try {
        const res = await fetch('http://localhost:3000/intelligence/rewrite', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: original })
        });

        const data = await res.json();
        console.log('📝 Result:', data);
    } catch (e) {
        console.error('Error:', e);
    }
}

testRewrite();
