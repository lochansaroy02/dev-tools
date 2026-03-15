"use client";

import {
    Activity,
    AlertTriangle,
    ArrowLeft,
    Check,
    CheckCircle2,
    Clock,
    Code2,
    Copy,
    FileText,
    HardDrive,
    List,
    Plus,
    Send,
    Server,
    Trash2,
    XCircle
} from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';
import React, { useState } from 'react';

// Types
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
type KeyValue = { id: string; key: string; value: string; active: boolean };
type ResponseData = {
    status: number;
    statusText: string;
    time: number;
    size: number;
    data: string;
    headers: Record<string, string>;
} | null;

const METHODS: { method: HttpMethod; color: string; bg: string }[] = [
    { method: 'GET', color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20' },
    { method: 'POST', color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/20' },
    { method: 'PUT', color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20' },
    { method: 'PATCH', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20' },
    { method: 'DELETE', color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20' },
];

export default function ApiTester() {
    const [method, setMethod] = useState<HttpMethod>('GET');
    const [url, setUrl] = useState('https://jsonplaceholder.typicode.com/users/1');

    // Request States
    const [reqTab, setReqTab] = useState<'params' | 'headers' | 'body'>('params');
    const [params, setParams] = useState<KeyValue[]>([{ id: '1', key: '', value: '', active: true }]);
    const [headers, setHeaders] = useState<KeyValue[]>([
        { id: '1', key: 'Accept', value: 'application/json', active: true }
    ]);
    const [body, setBody] = useState('{\n  \n}');

    // Response States
    const [resTab, setResTab] = useState<'body' | 'headers'>('body');
    const [isLoading, setIsLoading] = useState(false);
    const [response, setResponse] = useState<ResponseData>(null);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const currentMethodStyle = METHODS.find(m => m.method === method);

    // ==========================================
    // SMART BI-DIRECTIONAL URL/PARAMS SYNC
    // ==========================================

    // 1. When URL changes -> Update Params array
    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newUrl = e.target.value;
        setUrl(newUrl);

        try {
            const urlToParse = newUrl.includes('://') ? newUrl : `http://${newUrl}`;
            const parsedUrl = new URL(urlToParse);
            const entries = Array.from(parsedUrl.searchParams.entries());

            if (entries.length > 0) {
                const syncedParams = entries.map(([key, value], idx) => ({
                    id: `param-${Date.now()}-${idx}`,
                    key,
                    value,
                    active: true
                }));
                syncedParams.push({ id: `empty-${Date.now()}`, key: '', value: '', active: true }); // Always leave an empty row
                setParams(syncedParams);
            } else {
                setParams([{ id: `empty-${Date.now()}`, key: '', value: '', active: true }]);
            }
        } catch {
            // Fail silently while typing incomplete URLs
        }
    };

    // 2. When Params change -> Update URL string
    const syncUrlFromParams = (updatedParams: KeyValue[]) => {
        try {
            const baseUrlStr = url.split('?')[0];
            const searchParams = new URLSearchParams();

            updatedParams.forEach(p => {
                if (p.active && p.key) searchParams.append(p.key, p.value);
            });

            const queryString = searchParams.toString();
            setUrl(queryString ? `${baseUrlStr}?${queryString}` : baseUrlStr);
        } catch (e) {
            console.error(e);
        }
    };

    // 3. Custom Param Handlers
    const updateParam = (id: string, field: keyof KeyValue, value: any) => {
        const newParams = params.map(item => item.id === id ? { ...item, [field]: value } : item);
        setParams(newParams);
        syncUrlFromParams(newParams);
    };
    const addParam = () => {
        setParams([...params, { id: Math.random().toString(), key: '', value: '', active: true }]);
    };
    const removeParam = (id: string) => {
        const newParams = params.filter(item => item.id !== id);
        setParams(newParams);
        syncUrlFromParams(newParams);
    };

    // Generic Handlers (For Headers only)
    const updateHeader = (id: string, field: keyof KeyValue, value: any) => {
        setHeaders(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
    };
    const addHeader = () => {
        setHeaders(prev => [...prev, { id: Math.random().toString(), key: '', value: '', active: true }]);
    };
    const removeHeader = (id: string) => {
        setHeaders(prev => prev.filter(item => item.id !== id));
    };

    // ==========================================
    // REQUEST HANDLER
    // ==========================================
    const handleSend = async () => {
        if (!url) return;
        setIsLoading(true);
        setError(null);
        setResponse(null);

        const startTime = performance.now();

        try {
            const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);

            const reqHeaders: Record<string, string> = {};
            headers.filter(h => h.active && h.key).forEach(h => {
                reqHeaders[h.key] = h.value;
            });

            const proxyPayload = {
                targetUrl: urlObj.toString(),
                method: method,
                headers: reqHeaders,
                body: method !== 'GET' ? body.trim() : null
            };

            if (proxyPayload.body && !proxyPayload.headers['Content-Type']) {
                proxyPayload.headers['Content-Type'] = 'application/json';
            }

            // Fire proxy request
            const res = await fetch('/api/proxy', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(proxyPayload)
            });

            const endTime = performance.now();
            const proxyResponse = await res.json();

            if (!res.ok || proxyResponse.error) {
                throw new Error(proxyResponse.error || 'The proxy server failed to reach the destination.');
            }

            const sizeKb = new Blob([proxyResponse.data]).size / 1024;
            let formattedData = proxyResponse.data;
            try {
                formattedData = JSON.stringify(JSON.parse(proxyResponse.data), null, 2);
            } catch (e) {
                // Not JSON
            }

            setResponse({
                status: proxyResponse.status,
                statusText: proxyResponse.statusText,
                time: Math.round(endTime - startTime),
                size: Number(sizeKb.toFixed(2)),
                data: formattedData,
                headers: proxyResponse.headers,
            });

        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            setIsLoading(false);
            setResTab('body');
        }
    };

    const copyResponse = () => {
        if (response?.data) {
            navigator.clipboard.writeText(response.data);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    // Reusable Editor UI
    const renderKeyValueEditor = (
        items: KeyValue[],
        onUpdate: (id: string, field: keyof KeyValue, value: any) => void,
        onAdd: () => void,
        onRemove: (id: string) => void
    ) => (
        <div className="space-y-z">
            {items.map((item) => (
                <div key={item.id} className="flex items-center  space-y-2 gap-1">
                    <input
                        type="checkbox"
                        checked={item.active}
                        onChange={(e) => onUpdate(item.id, 'active', e.target.checked)}
                        className="w-4 h-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-900"
                    />
                    <input
                        placeholder="Key"
                        value={item.key}
                        onChange={(e) => onUpdate(item.id, 'key', e.target.value)}
                        className="flex-1 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 font-mono"
                    />
                    <input
                        placeholder="Value"
                        value={item.value}
                        onChange={(e) => onUpdate(item.id, 'value', e.target.value)}
                        className="flex-1 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 font-mono"
                    />
                    <button
                        onClick={() => onRemove(item.id)}
                        className="p-2 text-zinc-400 hover:text-red-500 transition-colors"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            ))}
            <button
                onClick={onAdd}
                className="flex items-center gap-2 text-xs font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors mt-2"
            >
                <Plus size={14} /> Add Row
            </button>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto p-6 space-y-6 animate-in fade-in duration-700">

            {/* Header */}
            <div className="flex flex-col gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-6">
                <Link href="/" className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors w-fit">
                    <ArrowLeft size={16} /> Back to Dashboard
                </Link>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400">
                            <Server size={24} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">API Tester</h1>
                            <p className="text-sm text-zinc-500">Test REST endpoints instantly from your browser.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* URL Bar */}
            <div className="flex flex-col md:flex-row gap-2">
                <div className="relative flex-1 flex items-center">
                    <select
                        value={method}
                        onChange={(e) => setMethod(e.target.value as HttpMethod)}
                        className={`absolute left-0 h-full px-4 appearance-none bg-transparent font-black text-sm outline-none cursor-pointer border-r border-zinc-200 dark:border-zinc-800 rounded-l-2xl ${currentMethodStyle?.color}`}
                    >
                        {METHODS.map(m => <option key={m.method} value={m.method} className="text-zinc-900 dark:text-zinc-100">{m.method}</option>)}
                    </select>
                    <input
                        type="text"
                        value={url}
                        onChange={handleUrlChange}
                        placeholder="https://api.example.com/v1/users?page=1"
                        className="w-full pl-28 pr-4 py-4 bg-white dark:bg-zinc-950 border-2 border-zinc-200 dark:border-zinc-800 rounded-2xl text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-mono shadow-sm"
                    />
                </div>
                <button
                    onClick={handleSend}
                    disabled={isLoading || !url}
                    className="flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-indigo-500/20"
                >
                    {isLoading ? (
                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                            <Activity size={18} />
                        </motion.div>
                    ) : (
                        <><Send size={18} /> Send</>
                    )}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* LEFT PANEL: REQUEST */}
                <div className="bg-white dark:bg-zinc-950 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden flex flex-col h-150">
                    <div className="flex border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                        {[
                            { id: 'params', label: 'Params', icon: <List size={14} /> },
                            { id: 'headers', label: 'Headers', icon: <Code2 size={14} /> },
                            { id: 'body', label: 'Body', icon: <FileText size={14} /> },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setReqTab(tab.id as any)}
                                className={`flex items-center gap-2 flex-1 justify-center py-3 text-sm font-bold transition-colors border-b-2 ${reqTab === tab.id ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-zinc-950' : 'border-transparent text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}`}
                            >
                                {tab.icon} {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="p-4 flex-1 overflow-y-auto">
                        {reqTab === 'params' && renderKeyValueEditor(params, updateParam, addParam, removeParam)}
                        {reqTab === 'headers' && renderKeyValueEditor(headers, updateHeader, addHeader, removeHeader)}
                        {reqTab === 'body' && (
                            <div className="h-full flex flex-col">
                                <div className="flex justify-end mb-2">
                                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest bg-zinc-100 dark:bg-zinc-900 px-2 py-1 rounded">JSON</span>
                                </div>
                                <textarea
                                    value={body}
                                    onChange={(e) => setBody(e.target.value)}
                                    disabled={method === 'GET'}
                                    placeholder={method === 'GET' ? "Body is disabled for GET requests." : "Enter JSON body here..."}
                                    className="flex-1 w-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 font-mono text-sm focus:outline-none focus:border-indigo-500 disabled:opacity-50 resize-none text-zinc-900 dark:text-zinc-100"
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT PANEL: RESPONSE */}
                <div className="bg-white dark:bg-zinc-950 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden flex flex-col h-150">

                    <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 text-sm">
                        {response ? (
                            <div className="flex gap-4">
                                <span className={`font-bold flex items-center gap-1 ${response.status >= 200 && response.status < 300 ? 'text-emerald-500' : 'text-red-500'}`}>
                                    {response.status >= 200 && response.status < 300 ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                                    {response.status} {response.statusText}
                                </span>
                                <span className="text-zinc-500 font-mono flex items-center gap-1"><Clock size={14} /> {response.time} ms</span>
                                <span className="text-zinc-500 font-mono flex items-center gap-1"><HardDrive size={14} /> {response.size} KB</span>
                            </div>
                        ) : (
                            <span className="text-zinc-400 font-bold">Awaiting Request...</span>
                        )}

                        {response && (
                            <div className="flex gap-2">
                                <button onClick={() => setResTab('body')} className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${resTab === 'body' ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100' : 'text-zinc-500 hover:text-zinc-700'}`}>Body</button>
                                <button onClick={() => setResTab('headers')} className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${resTab === 'headers' ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100' : 'text-zinc-500 hover:text-zinc-700'}`}>Headers</button>
                            </div>
                        )}
                    </div>

                    <div className="flex-1 overflow-auto relative bg-zinc-950">
                        {error ? (
                            <div className="p-8 flex flex-col items-center justify-center text-center h-full text-red-400">
                                <AlertTriangle size={48} className="mb-4 opacity-50" />
                                <p className="font-bold text-lg mb-2">Request Failed</p>
                                <p className="text-sm opacity-80 max-w-sm">{error}</p>
                            </div>
                        ) : response ? (
                            resTab === 'body' ? (
                                <div className="relative h-full">
                                    <button onClick={copyResponse} className="absolute top-4 right-4 p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition-colors">
                                        {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                                    </button>
                                    <pre className="p-4 font-mono text-sm text-zinc-300 whitespace-pre-wrap break-all">
                                        {response.data}
                                    </pre>
                                </div>
                            ) : (
                                <div className="p-4 space-y-2">
                                    {Object.entries(response.headers).map(([k, v]) => (
                                        <div key={k} className="flex flex-col sm:flex-row sm:gap-4 font-mono text-sm border-b border-zinc-800/50 pb-2">
                                            <span className="text-indigo-400 font-bold min-w-50 break-all">{k}</span>
                                            <span className="text-zinc-300 break-all">{v}</span>
                                        </div>
                                    ))}
                                </div>
                            )
                        ) : (
                            <div className="p-8 flex flex-col items-center justify-center text-center h-full text-zinc-600 dark:text-zinc-500">
                                <Server size={48} className="mb-4 opacity-20" />
                                <p className="font-bold">Enter a URL and hit Send</p>
                                <p className="text-xs mt-2 opacity-70">Try using JSONPlaceholder for testing.</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}