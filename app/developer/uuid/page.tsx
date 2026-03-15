"use client";

import {
    ArrowLeft,
    Check,
    Copy,
    Hash,
    History as HistoryIcon,
    Info,
    Layers,
    RefreshCcw,
    Settings2,
    Trash2
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function UuidGenerator() {
    const [count, setCount] = useState(5);
    const [uuids, setUuids] = useState<string[]>([]);
    const [history, setHistory] = useState<string[][]>([]);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [isUppercase, setIsUppercase] = useState(false);

    // Native v4 UUID generation using Web Crypto API
    const generateBatch = () => {
        const newBatch = Array.from({ length: Math.min(count, 100) }, () => {
            const uuid = crypto.randomUUID();
            return isUppercase ? uuid.toUpperCase() : uuid;
        });

        setUuids(newBatch);
        // Add to history (limit to last 5 batches)
        setHistory(prev => [newBatch, ...prev].slice(0, 5));
    };

    // Generate on initial load
    useEffect(() => {
        generateBatch();
    }, []);

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const copyAll = () => {
        navigator.clipboard.writeText(uuids.join('\n'));
        setCopiedId('all');
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <div className="max-w-5xl mx-auto p-6 space-y-8 animate-in fade-in duration-700">

            {/* Header */}
            <div className="flex flex-col gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-6">
                <Link href="/" className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors w-fit">
                    <ArrowLeft size={16} /> Back to Dashboard
                </Link>
                <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400">
                        <Hash size={24} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">UUID Generator</h1>
                        <p className="text-sm text-zinc-500">Generate cryptographically strong Universally Unique Identifiers (v4).</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Left Column: Configuration */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="p-6 bg-white dark:bg-zinc-950 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6">
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-400">
                            <Settings2 size={14} /> Configuration
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Quantity</label>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="range" min="1" max="50" step="1"
                                        value={count}
                                        onChange={(e) => setCount(Number(e.target.value))}
                                        className="flex-1 h-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
                                    />
                                    <span className="text-lg font-mono font-black text-zinc-900 dark:text-zinc-100 w-8">{count}</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-100 dark:border-zinc-800">
                                <span className="text-sm font-bold text-zinc-600 dark:text-zinc-400">Uppercase</span>
                                <button
                                    onClick={() => setIsUppercase(!isUppercase)}
                                    className={`w-12 h-6 rounded-full transition-colors relative ${isUppercase ? 'bg-orange-500' : 'bg-zinc-200 dark:bg-zinc-800'}`}
                                >
                                    <motion.div
                                        animate={{ x: isUppercase ? 26 : 4 }}
                                        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                                    />
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={generateBatch}
                            className="w-full flex items-center justify-center gap-2 py-4 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-2xl font-bold hover:scale-[1.02] active:scale-95 transition-all"
                        >
                            <RefreshCcw size={18} /> Generate New Batch
                        </button>
                    </div>

                    {/* History Sidebar */}
                    {history.length > 1 && (
                        <div className="p-6 bg-zinc-50 dark:bg-zinc-900/50 rounded-3xl border border-zinc-200 dark:border-zinc-800 space-y-4">
                            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-zinc-400">
                                <div className="flex items-center gap-2"><HistoryIcon size={14} /> History</div>
                                <button onClick={() => setHistory([])} className="hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                            </div>
                            <div className="space-y-2">
                                {history.slice(1).map((batch, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setUuids(batch)}
                                        className="w-full text-left p-3 text-[10px] font-mono rounded-xl bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 hover:border-orange-300 transition-all truncate opacity-60 hover:opacity-100"
                                    >
                                        {batch[0]}...
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column: Results */}
                <div className="lg:col-span-8 space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-400">
                            <Layers size={14} /> Generated UUIDs
                        </div>
                        <button
                            onClick={copyAll}
                            className="flex items-center gap-2 text-xs font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                        >
                            {copiedId === 'all' ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                            Copy All
                        </button>
                    </div>

                    <div className="space-y-2">
                        <AnimatePresence mode="popLayout">
                            {uuids.map((uuid, index) => (
                                <motion.div
                                    key={uuid + index}
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ delay: index * 0.02 }}
                                    className="group flex items-center justify-between p-4 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl hover:border-orange-200 dark:hover:border-orange-900/50 transition-all shadow-sm"
                                >
                                    <code className="text-sm md:text-base font-mono font-bold text-zinc-800 dark:text-zinc-200 break-all">
                                        {uuid}
                                    </code>
                                    <button
                                        onClick={() => copyToClipboard(uuid, uuid)}
                                        className={`p-2 rounded-xl transition-all ${copiedId === uuid ? 'bg-green-50 text-green-600' : 'text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}
                                    >
                                        {copiedId === uuid ? <Check size={18} /> : <Copy size={18} />}
                                    </button>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Educational Note */}
                    <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl text-blue-800 dark:text-blue-300 text-sm">
                        <Info size={20} className="shrink-0 mt-0.5" />
                        <div className="space-y-1">
                            <p className="font-bold">What is UUID v4?</p>
                            <p className="opacity-80">
                                Version 4 UUIDs are generated using random numbers. The probability of a duplicate is
                                effectively zero ($1$ in $2^{128}$), making them perfect for primary keys in databases
                                and unique session identifiers.
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}