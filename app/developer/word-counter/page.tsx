"use client";

import { Clock, Copy, Trash2, Type } from "lucide-react";
import { useState } from 'react';

const WordCounter = () => {
    const [text, setText] = useState("");

    // Logic to calculate stats
    const charCount = text.length;
    const wordCount = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
    const lineCount = text.trim() === "" ? 0 : text.split(/\n/).length;
    const readingTime = Math.ceil(wordCount / 200); // Avg 200 wpm

    const handleClear = () => setText("");
    const handleCopy = () => {
        if (text) navigator.clipboard.writeText(text);
    };

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-2 mb-2">
                <Type className="text-zinc-500" size={24} />
                <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                    Word Counter
                </h1>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: "Words", value: wordCount },
                    { label: "Characters", value: charCount },
                    { label: "Lines", value: lineCount },
                    { label: "Reading Time", value: `${readingTime} min`, icon: <Clock size={14} /> },
                ].map((stat) => (
                    <div key={stat.label} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
                        <p className="text-sm font-medium text-zinc-500 flex items-center gap-1">
                            {stat.label} {stat.icon}
                        </p>
                        <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Input Area */}
            <div className="relative">
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Paste or type your text here..."
                    className="min-h-75 w-full rounded-xl border border-zinc-200 bg-white p-4 text-zinc-900 shadow-sm outline-none transition-all focus:ring-2 focus:ring-zinc-950/10 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:ring-zinc-50/10"
                />

                {/* Floating Actions */}
                <div className="absolute bottom-4 right-4 flex gap-2">
                    <button
                        onClick={handleCopy}
                        className="flex items-center gap-2 rounded-md bg-zinc-100 px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                    >
                        <Copy size={16} /> Copy
                    </button>
                    <button
                        onClick={handleClear}
                        className="flex items-center gap-2 rounded-md bg-zinc-100 px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                    >
                        <Trash2 size={16} /> Clear
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WordCounter;