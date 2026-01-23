'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Check, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function NewSite() {
    const router = useRouter();
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('http://localhost:3000/sites', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url })
            });

            if (res.ok) {
                router.push('/');
            } else {
                alert('Failed to add site');
            }
        } catch (err) {
            console.error(err);
            alert('Error connecting to backend');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-6 font-medium">
                <ArrowLeft size={16} /> Back to Dashboard
            </Link>

            <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
                <h1 className="text-2xl font-bold text-slate-800 mb-2">Connect New Website</h1>
                <p className="text-slate-500 mb-8">
                    Enter the URL of the website you want to manage.
                    The engine will automatically discover its CMS and content.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Website URL</label>
                        <input
                            type="url"
                            required
                            placeholder="https://example.com"
                            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-900 focus:outline-none"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                        />
                        <p className="text-xs text-slate-400 mt-2">
                            Must start with http:// or https://
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <Check size={20} />}
                        {loading ? 'Analyzing Site...' : 'Connect Website'}
                    </button>
                </form>
            </div>
        </div>
    );
}
