"use client";

import { ArrowRightLeft, Calendar, Clock, Copy, Hash, Trash2 } from "lucide-react";
import { useEffect, useState } from 'react';

const TimestampConverter = () => {
    const [unixInput, setUnixInput] = useState<string>(Math.floor(Date.now() / 1000).toString());
    const [dateResult, setDateResult] = useState({
        local: "",
        utc: "",
        relative: ""
    });

    // Relative time helper
    const getRelativeTime = (epoch: number) => {
        const formatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
        const diff = epoch - Math.floor(Date.now() / 1000);

        if (Math.abs(diff) < 60) return formatter.format(diff, 'second');
        if (Math.abs(diff) < 3600) return formatter.format(Math.floor(diff / 60), 'minute');
        if (Math.abs(diff) < 86400) return formatter.format(Math.floor(diff / 3600), 'hour');
        return formatter.format(Math.floor(diff / 86400), 'day');
    };

    useEffect(() => {
        try {
            const ms = unixInput.length > 11 ? parseInt(unixInput) : parseInt(unixInput) * 1000;
            const date = new Date(ms);

            if (isNaN(date.getTime())) throw new Error();

            setDateResult({
                local: date.toLocaleString(),
                utc: date.toUTCString(),
                relative: getRelativeTime(Math.floor(ms / 1000))
            });
        } catch {
            setDateResult({ local: "Invalid Timestamp", utc: "Invalid Timestamp", relative: "-" });
        }
    }, [unixInput]);

    const handleCopy = (text: string) => navigator.clipboard.writeText(text);

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100">
                    <Clock size={20} />
                </div>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                        Timestamp Converter
                    </h1>
                    <p className="text-sm text-zinc-500">Convert between Unix epochs and human-readable dates.</p>
                </div>
            </div>

            {/* Input Section */}
            <div className="p-6 rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950 space-y-4">
                <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold text-zinc-500 flex items-center gap-2">
                        <Hash size={14} /> Unix Timestamp (Seconds or MS)
                    </label>
                    <button onClick={() => setUnixInput("")} className="text-zinc-400 hover:text-red-500 transition-colors">
                        <Trash2 size={16} />
                    </button>
                </div>
                <input
                    type="text"
                    value={unixInput}
                    onChange={(e) => setUnixInput(e.target.value)}
                    placeholder="e.g. 1739481527"
                    className="w-full text-2xl font-mono tracking-wider bg-transparent outline-none text-zinc-900 dark:text-zinc-50"
                />
                <div className="flex gap-2">
                    <button
                        onClick={() => setUnixInput(Math.floor(Date.now() / 1000).toString())}
                        className="text-xs px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200"
                    >
                        Now
                    </button>
                </div>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                    { label: "Local Time", value: dateResult.local, icon: <Calendar size={16} /> },
                    { label: "UTC / GMT", value: dateResult.utc, icon: <Clock size={16} /> },
                    { label: "Relative", value: dateResult.relative, icon: <ArrowRightLeft size={16} /> },
                ].map((item) => (
                    <div key={item.label} className="group p-4 rounded-xl border border-zinc-200 bg-zinc-50/50 dark:border-zinc-800 dark:bg-zinc-900/30">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                                {item.icon} {item.label}
                            </span>
                            <button
                                onClick={() => handleCopy(item.value)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                            >
                                <Copy size={14} />
                            </button>
                        </div>
                        <p className="font-mono text-sm text-zinc-700 dark:text-zinc-300 wrap-break-word">
                            {item.value}
                        </p>
                    </div>
                ))}
            </div>

            {/* Quick Reference Table */}
            <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800">
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 mb-4">Quick Reference</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="space-y-1">
                        <p className="text-[10px] text-zinc-400 uppercase font-bold">1 Minute</p>
                        <p className="text-sm font-mono text-zinc-600">60 sec</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] text-zinc-400 uppercase font-bold">1 Hour</p>
                        <p className="text-sm font-mono text-zinc-600">3,600 sec</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] text-zinc-400 uppercase font-bold">1 Day</p>
                        <p className="text-sm font-mono text-zinc-600">86,400 sec</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] text-zinc-400 uppercase font-bold">1 Year</p>
                        <p className="text-sm font-mono text-zinc-600">31,536,000 sec</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TimestampConverter;