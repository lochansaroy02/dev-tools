"use client";

import {
    AlertCircle,
    ArrowLeft,
    Check,
    Code2,
    Copy,
    FileText,
    Info,
    Lightbulb,
    Search
} from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';

const COMMON_REGEX = [
    { name: "Email Address", pattern: "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$", desc: "Validates standard email formats" },
    { name: "URL", pattern: "https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%_\\+.~#?&//=]*)", desc: "Matches http and https URLs" },
    { name: "Phone Number", pattern: "^[\\+]?[(]?[0-9]{3}[)]?[-\\s\\.]?[0-9]{3}[-\\s\\.]?[0-9]{4,6}$", desc: "Matches most international formats" },
    { name: "Date (YYYY-MM-DD)", pattern: "^\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$", desc: "Standard ISO date format" },
    { name: "Password Strong", pattern: "^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$", desc: "Min 8 chars, 1 letter, 1 number" },
];

export default function RegexTester() {
    const [pattern, setPattern] = useState("([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\\.[a-zA-Z0-9_-]+)");
    const [testString, setTestString] = useState("Contact us at support@example.com or sales@dev-tools.io for more info.");
    const [flags, setFlags] = useState({ g: true, i: true, m: false });
    const [copied, setCopied] = useState(false);

    // Calculate Regex Matches
    const { matches, error, highlightedText } = useMemo(() => {
        if (!pattern) return { matches: [], error: null, highlightedText: testString };

        try {
            const flagString = Object.entries(flags)
                .filter(([_, active]) => active)
                .map(([f]) => f)
                .join("");

            const regex = new RegExp(pattern, flagString);
            const matchesFound = Array.from(testString.matchAll(regex));

            // Create highlighted HTML
            // We use a simple strategy: replace matches with span-wrapped versions
            // For safety in a real app, use a dedicated highlighter or library
            let lastIndex = 0;
            const nodes = [];

            const allMatches = Array.from(testString.matchAll(new RegExp(pattern, flagString.includes('g') ? flagString : flagString + 'g')));

            allMatches.forEach((match, i) => {
                const start = match.index!;
                const end = start + match[0].length;

                // Text before match
                nodes.push(testString.slice(lastIndex, start));
                // The match itself
                nodes.push(
                    <span key={i} className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded px-0.5 border-b-2 border-indigo-500 font-bold">
                        {match[0]}
                    </span>
                );
                lastIndex = end;
            });
            nodes.push(testString.slice(lastIndex));

            return {
                matches: matchesFound,
                error: null,
                highlightedText: nodes
            };
        } catch (e: any) {
            return { matches: [], error: e.message, highlightedText: testString };
        }
    }, [pattern, testString, flags]);

    const copyPattern = () => {
        navigator.clipboard.writeText(pattern);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="max-w-5xl mx-auto p-6 space-y-8 animate-in fade-in duration-700">

            {/* Breadcrumb & Header */}
            <div className="flex flex-col gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-6">
                <Link href="/" className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors w-fit">
                    <ArrowLeft size={16} /> Back to Dashboard
                </Link>
                <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400">
                        <Search size={24} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">Regex Tester</h1>
                        <p className="text-sm text-zinc-500">Test and debug regular expressions with real-time highlighting.</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Left Column: Editor */}
                <div className="lg:col-span-8 space-y-6">

                    {/* Regex Input Box */}
                    <div className="p-6 bg-white dark:bg-zinc-950 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
                        <div className="flex justify-between items-center">
                            <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                                <Code2 size={14} /> Regular Expression
                            </label>
                            <div className="flex gap-2">
                                {['g', 'i', 'm'].map((f) => (
                                    <button
                                        key={f}
                                        onClick={() => setFlags(prev => ({ ...prev, [f]: !prev[f as keyof typeof flags] }))}
                                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${flags[f as keyof typeof flags] ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300' : 'bg-zinc-100 text-zinc-400 dark:bg-zinc-900'}`}
                                        title={f === 'g' ? 'Global' : f === 'i' ? 'Insensitive' : 'Multiline'}
                                    >
                                        {f}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="relative flex items-center">
                            <span className="absolute left-4 text-zinc-400 font-mono text-xl">/</span>
                            <input
                                value={pattern}
                                onChange={(e) => setPattern(e.target.value)}
                                className={`w-full pl-8 pr-12 py-4 bg-zinc-50 dark:bg-zinc-900 border-2 ${error ? 'border-red-500' : 'border-zinc-100 dark:border-zinc-800'} rounded-2xl font-mono text-lg focus:outline-none focus:border-indigo-500 transition-all`}
                                placeholder="enter regex pattern..."
                            />
                            <span className="absolute right-12 text-zinc-400 font-mono text-xl">/</span>
                            <button
                                onClick={copyPattern}
                                className="absolute right-4 p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                            >
                                {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                            </button>
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 text-red-500 text-xs font-medium bg-red-50 dark:bg-red-950/30 p-3 rounded-xl border border-red-100 dark:border-red-900">
                                <AlertCircle size={14} /> {error}
                            </div>
                        )}
                    </div>

                    {/* Test String Input */}
                    <div className="p-6 bg-white dark:bg-zinc-950 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
                        <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                            <FileText size={14} /> Test String
                        </label>

                        <div className="relative">
                            {/* Overlay for highlights */}
                            <div className="absolute inset-0 p-4 font-mono text-sm pointer-events-none whitespace-pre-wrap break-all overflow-auto text-transparent">
                                {highlightedText}
                            </div>
                            <textarea
                                value={testString}
                                onChange={(e) => setTestString(e.target.value)}
                                className="w-full h-48 p-4 bg-transparent border-2 border-zinc-100 dark:border-zinc-800 rounded-2xl font-mono text-sm focus:outline-none focus:indigo-500 transition-all relative z-10 text-zinc-900 dark:text-zinc-100 caret-zinc-900 dark:caret-zinc-100"
                                placeholder="Insert text to test against..."
                            />
                        </div>

                        <div className="flex justify-between items-center text-xs text-zinc-400 font-bold">
                            <div className="flex gap-4">
                                <span>MATCHES: <span className="text-indigo-500">{matches.length}</span></span>
                                <span>LENGTH: {testString.length}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Sidebar */}
                <div className="lg:col-span-4 space-y-6">

                    {/* Quick Presets */}
                    <div className="p-6 bg-zinc-50 dark:bg-zinc-900/50 rounded-3xl border border-zinc-200 dark:border-zinc-800 space-y-4">
                        <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                            <Lightbulb size={14} /> Common Presets
                        </label>
                        <div className="space-y-2">
                            {COMMON_REGEX.map((item) => (
                                <button
                                    key={item.name}
                                    onClick={() => setPattern(item.pattern)}
                                    className="w-full text-left p-3 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 hover:border-indigo-300 dark:hover:border-indigo-800 transition-all group"
                                >
                                    <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">{item.name}</p>
                                    <p className="text-[10px] text-zinc-500 truncate">{item.pattern}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Regex Cheat Sheet */}
                    <div className="p-6 bg-white dark:bg-zinc-950 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
                        <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                            <Info size={14} /> Quick Reference
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {[
                                { c: '.', d: 'Any char' },
                                { c: '\\d', d: 'Digit' },
                                { c: '\\w', d: 'Word' },
                                { c: '\\s', d: 'Space' },
                                { c: '[abc]', d: 'Any of' },
                                { c: '[^a]', d: 'Not a' },
                                { c: 'a*', d: '0 or more' },
                                { c: 'a+', d: '1 or more' },
                                { c: 'a?', d: '0 or 1' },
                                { c: '^', d: 'Start' },
                                { c: '$', d: 'End' },
                                { c: '|', d: 'OR' },
                            ].map((ref) => (
                                <div key={ref.c} className="flex items-center justify-between p-2 rounded-lg bg-zinc-50 dark:bg-zinc-900 text-[10px] font-mono">
                                    <span className="text-indigo-500 font-bold">{ref.c}</span>
                                    <span className="text-zinc-400">{ref.d}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}