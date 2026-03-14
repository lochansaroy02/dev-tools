"use client";

import { CaseUpper, Check, Copy, Trash2 } from "lucide-react";
import { useState } from 'react';

const CaseConverter = () => {
    const [text, setText] = useState<string>("");
    const [isCopied, setIsCopied] = useState<boolean>(false); // Added state for copy feedback

    const handleClear = () => setText("");

    const handleCopy = () => {
        if (text) {
            navigator.clipboard.writeText(text);
            setIsCopied(true);

            setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
        }
    };

    const getMatches = (str: string) => {
        return str.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g) ?? [];
    };

    // Transformation Logic
    const transform = (type: string) => {
        if (!text) return; // Guard clause for empty text

        switch (type) {
            case 'upper':
                setText(text.toUpperCase());
                break;
            case 'lower':
                setText(text.toLowerCase());
                break;
            case 'sentence':
                setText(text.toLowerCase().replace(/(^\s*\w|[\.\!\?]\s*\w)/g, c => c.toUpperCase()));
                break;
            case 'title':
                setText(text.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '));
                break;
            case 'camel':
                setText(text.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase()));
                break;
            case 'pascal':
                const camel = text.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
                setText(camel.charAt(0).toUpperCase() + camel.slice(1));
                break;
            case 'snake':
                setText(getMatches(text).map(x => x.toLowerCase()).join('_'));
                break;
            case 'kebab':
                setText(getMatches(text).map(x => x.toLowerCase()).join('-'));
                break;
            default:
                break;
        }
    };

    const buttons = [
        { label: "UPPERCASE", type: "upper" },
        { label: "lowercase", type: "lower" },
        { label: "Sentence case", type: "sentence" },
        { label: "Title Case", type: "title" },
        { label: "camelCase", type: "camel" },
        { label: "PascalCase", type: "pascal" },
        { label: "snake_case", type: "snake" },
        { label: "kebab-case", type: "kebab" },
    ];

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-2 mb-2">
                <CaseUpper className="text-zinc-500" size={24} />
                <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                    Case Converter
                </h1>
            </div>

            {/* Input Area */}
            <div className="relative">
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Type or paste text to convert..."
                    className="min-h-62.5 w-full rounded-xl border border-zinc-200 bg-white p-4 text-zinc-900 shadow-sm outline-none transition-all focus:ring-2 focus:ring-zinc-950/10 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:ring-zinc-50/10 font-mono"
                />

                <div className="absolute bottom-4 right-4 flex gap-2 items-center">
                    <button
                        onClick={handleCopy}
                        className="flex items-center cursor-pointer gap-1.5 px-3 py-2 rounded-md bg-zinc-100 dark:bg-zinc-800 text-xs font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                    >
                        {isCopied ? (
                            <>
                                <Check size={14} className="text-green-500" /> Copied
                            </>
                        ) : (
                            <>
                                <Copy size={14} /> Copy
                            </>
                        )}
                    </button>
                    <button
                        onClick={handleClear}
                        className="p-2 rounded-md bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700 transition-colors"
                        title="Clear text"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>

            {/* Conversion Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {buttons.map((btn) => (
                    <button
                        key={btn.type}
                        onClick={() => transform(btn.type)}
                        className="flex items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 shadow-sm transition-all hover:bg-zinc-50 active:scale-95 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-900"
                    >
                        {btn.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default CaseConverter;