"use client";

import { generateHash, HashType } from "@/lib/hash-utils";
import { Check, Copy, Fingerprint, ShieldCheck, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

const HashGenerator = () => {
    const [input, setInput] = useState("");
    const [hashes, setHashes] = useState<{ type: HashType; value: string }[]>([]);
    const [copiedType, setCopiedType] = useState<string | null>(null);

    const supportedTypes: HashType[] = ["MD5", "SHA-1", "SHA-256", "SHA-512", "SHA-3", "Base64"];

    useEffect(() => {
        const results = supportedTypes.map((type) => ({
            type,
            value: generateHash(input, type),
        }));
        setHashes(results);
    }, [input]);

    const copyToClipboard = (text: string, type: string) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        // toast.success("copied")
        setCopiedType(type);
        setTimeout(() => setCopiedType(null), 2000);
    };

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800">
                        <Fingerprint className="text-zinc-900 dark:text-zinc-100" size={20} />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                        Hash Generator
                    </h1>
                </div>
                <p className="text-sm text-zinc-500 ml-11">Securely generate cryptographic hashes in your browser.</p>
            </div>

            {/* Input Section */}
            <div className="space-y-3">
                <div className="flex justify-between items-center px-1">
                    <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Plaintext Input</label>
                    <button
                        onClick={() => setInput("")}
                        className="text-xs flex items-center gap-1.5 text-zinc-400 hover:text-red-500 transition-colors font-medium"
                    >
                        <Trash2 size={14} /> Clear
                    </button>
                </div>
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter text here..."
                    className="w-full h-32 rounded-xl border border-zinc-200 bg-white p-4 text-zinc-900 shadow-sm outline-none transition-all focus:ring-4 focus:ring-zinc-950/5 focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:ring-zinc-50/5 dark:focus:border-zinc-600 font-mono text-sm"
                />
            </div>

            {/* Results Grid */}
            <div className="space-y-4">
                {hashes.map((hash) => (
                    <div
                        key={hash.type}
                        className="group relative flex flex-col rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950 overflow-hidden"
                    >
                        {/* Label Bar */}
                        <div className="flex items-center justify-between border-b border-zinc-100 bg-zinc-50/50 px-4 py-2 dark:border-zinc-800 dark:bg-zinc-900/50">
                            <div className="flex items-center gap-2">
                                <ShieldCheck size={14} className="text-zinc-400" />
                                <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                                    {hash.type}
                                </span>
                            </div>
                            <button
                                onClick={() => copyToClipboard(hash.value, hash.type)}
                                className="flex items-center  cursor-pointer  gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                            >
                                {copiedType === hash.type ? (
                                    <><Check size={14} className="text-green-500" /> Copied</>
                                ) : (
                                    <><Copy size={14} /> Copy</>
                                )}
                            </button>
                        </div>

                        {/* Hash Value Block */}
                        <div className="p-4">
                            <code className="block w-full font-mono text-sm text-zinc-600 dark:text-zinc-400 break-all leading-relaxed">
                                {hash.value || <span className="text-zinc-300 dark:text-zinc-700 italic">Waiting for input...</span>}
                            </code>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HashGenerator;