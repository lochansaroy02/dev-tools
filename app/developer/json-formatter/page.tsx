"use client";

import { AlertCircle, AlignLeft, Braces, Check, Copy, Minimize2, Trash2 } from "lucide-react";
import { useState } from 'react';

const JsonFormatter = () => {
    const [input, setInput] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const handleFormat = () => {
        if (!input.trim()) return;
        try {
            const parsed = JSON.parse(input);
            const formatted = JSON.stringify(parsed, null, 2);
            setInput(formatted);
            setError(null);
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleMinify = () => {
        if (!input.trim()) return;
        try {
            const parsed = JSON.parse(input);
            const minified = JSON.stringify(parsed);
            setInput(minified);
            setError(null);
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleCopy = () => {
        if (!input) return;
        navigator.clipboard.writeText(input);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleClear = () => {
        setInput("");
        setError(null);
    };

    return (
        <div className="max-w-5xl mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Braces className="text-zinc-500" size={24} />
                    <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                        JSON Formatter
                    </h1>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={handleClear}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 transition-colors"
                    >
                        <Trash2 size={16} /> Clear
                    </button>
                    <button
                        onClick={handleCopy}
                        className="flex items-center gap-2 rounded-md bg-zinc-900 px-3 py-1.5 text-sm font-medium text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors"
                    >
                        {copied ? <Check size={16} /> : <Copy size={16} />}
                        {copied ? "Copied" : "Copy"}
                    </button>
                </div>
            </div>

            {/* Action Toolbar */}
            <div className="flex flex-wrap gap-3 p-2 bg-zinc-100/50 dark:bg-zinc-900/50 rounded-lg border border-zinc-200 dark:border-zinc-800">
                <button
                    onClick={handleFormat}
                    className="flex items-center gap-2 px-4 py-2 rounded-md bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all shadow-sm"
                >
                    <AlignLeft size={16} /> Beautify JSON
                </button>
                <button
                    onClick={handleMinify}
                    className="flex items-center gap-2 px-4 py-2 rounded-md bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all shadow-sm"
                >
                    <Minimize2 size={16} /> Minify JSON
                </button>
            </div>

            {/* Editor Area */}
            <div className="relative group">
                <textarea
                    value={input}
                    onChange={(e) => {
                        setInput(e.target.value);
                        if (error) setError(null);
                    }}
                    placeholder='Paste your raw JSON here... e.g. {"id":1,"name":"Dev"}'
                    className={`w-full min-h-100 rounded-xl border p-4 font-mono text-sm outline-none transition-all focus:ring-2 
            ${error
                            ? "border-red-500 bg-red-50/30 dark:bg-red-950/10 focus:ring-red-500/20"
                            : "border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 focus:ring-zinc-950/10 dark:focus:ring-zinc-50/10"
                        }`}
                    spellCheck={false}
                />

                {/* Error Feedback */}
                {error && (
                    <div className="absolute bottom-4 left-4 right-4 animate-in fade-in slide-in-from-bottom-2">
                        <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200 dark:bg-red-950/30 dark:border-red-900/50 text-red-600 dark:text-red-400 text-xs shadow-lg">
                            <AlertCircle size={14} className="mt-0.5 shrink-0" />
                            <span className="font-mono">{error}</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer Info */}
            <p className="text-xs text-zinc-500 text-center">
                Note: The formatter uses standard 2-space indentation. Invalid JSON will trigger a validation error.
            </p>
        </div>
    );
};

export default JsonFormatter;