# ⚛️ Next.js & React Entegrasyon Kılavuzu

Patronunuz haklı! Modern web dünyası Next.js ve React üzerinde dönüyor. İyi haber şu ki: **Bu proje, Next.js ile %100 uyumludur.**

Şu anki Python (FastAPI) backend'i, bir **"Microservice" (Mikro Servis)** olarak çalışır. Yani React uygulamanız, veri tabanına veya yapay zekaya doğrudan bağlanmaz; bu Python servisine istek atar ve cevabı alır.

## 🏗️ Mimari: Headless AI
*   **Backend (Bu Proje):** Ağır işleri yapar (AI, Vektör Arama, Crawling).
*   **Frontend (Sizin Next.js Projeniz):** Kullanıcı arayüzünü sunar ve API'den gelen veriyi gösterir.

---

## 💻 Örnek Entegrasyon Kodları

Aşağıdaki kodları mevcut Next.js projenizin `components` klasörüne ekleyerek hemen kullanmaya başlayabilirsiniz.

### 1. Akıllı Linkleme Bileşeni (`AutoLinker.tsx`)
Blog editörünüzde, yazar yazı yazarken "Link Öner" butonuna bastığında çalışır.

```tsx
import { useState } from 'react';

export default function AutoLinker({ content }: { content: string }) {
  const [linkedContent, setLinkedContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAutoLink = async () => {
    setLoading(true);
    try {
      // Python Backend'e İstek Atıyoruz
      const response = await fetch('https://api.sizin-seo-platformunuz.com/autolink', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: content }), // Backend 'query' bekliyor
      });

      const data = await response.json();
      setLinkedContent(data.enriched); // 'enriched' HTML döner
    } catch (error) {
      console.error('AI Linkleme Hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <button 
        onClick={handleAutoLink}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        {loading ? '✨ Yapay Zeka Düşünüyor...' : '✨ Otomatik Linkle'}
      </button>

      {linkedContent && (
        <div className="mt-4 p-4 bg-white border rounded shadow-sm">
          <h3 className="font-bold mb-2">Önizleme:</h3>
          <div dangerouslySetInnerHTML={{ __html: linkedContent }} />
        </div>
      )}
    </div>
  );
}
```

### 2. İlgili İçerikler Bileşeni (`RelatedPosts.tsx`)
Blog yazısının altında "Bunları da beğenebilirsiniz" kısmını yapay zeka ile doldurmak için.

```tsx
// app/blog/[slug]/page.tsx içinde server component örneği
async function getRelatedPosts(currentPostContent: string) {
  const res = await fetch('https://api.sizin-seo-platformunuz.com/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      query: currentPostContent, 
      top_k: 3 
    }),
  });
  
  return res.json();
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  // ... makale verisini çek ...
  const relatedPosts = await getRelatedPosts(article.summary);

  return (
    <article>
      {/* ... Makale İçeriği ... */}
      
      <section className="mt-10">
        <h2 className="text-2xl font-bold">🤖 Sizin İçin Seçtiklerimiz</h2>
        <div className="grid grid-cols-3 gap-4">
          {relatedPosts.results.map((post: any) => (
            <a href={post.url} key={post.id} className="block p-4 border hover:shadow">
              <h3>{post.title}</h3>
              <p className="text-sm text-gray-500">{post.similarity_score}% Alaka</p>
            </a>
          ))}
        </div>
      </section>
    </article>
  );
}
```

---

## 🚀 Patronunuz İçin Yönetici Özeti

> "Bu proje bir **API Servisi** olarak tasarlandı. Bizim Next.js veya React uygulamamız, bu servisi tıpkı Stripe veya Google Maps API'sini kullandığı gibi kullanacak.
>
> 1.  **Teknoloji Uyumu:** HTTP/REST standartlarını kullandığı için dilden bağımsızdır. React, Vue, Mobile App fark etmez.
> 2.  **Kolay Entegrasyon:** Mevcut CMS'inize (Strapi, Custom, WordPress) dokunmadan yanına eklenebilir.
> 3.  **Ölçeklenebilirlik:** Ağır yapay zeka işlemleri Python sunucusunda yapılır, Next.js uygulamanızı yavaşlatmaz."
