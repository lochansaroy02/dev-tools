"use client";

import { AlertCircle, Copy, FileJson, Key, Lock, ShieldCheck, Trash2 } from "lucide-react";
import { useEffect, useState } from 'react';

const JwtDecoder = () => {
    const [token, setToken] = useState("");
    const [decoded, setDecoded] = useState<{ header: any; payload: any; signature: string } | null>(null);
    const [error, setError] = useState<string | null>(null);

    const decodeToken = (input: string) => {
        if (!input.trim()) {
            setDecoded(null);
            setError(null);
            return;
        }

        const parts = input.split('.');
        if (parts.length !== 3) {
            setError("Invalid JWT: A token must have 3 parts separated by dots.");
            setDecoded(null);
            return;
        }

        try {
            const base64UrlDecode = (str: string) => {
                const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(
                    window.atob(base64)
                        .split('')
                        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                        .join('')
                );
                return JSON.parse(jsonPayload);
            };

            setDecoded({
                header: base64UrlDecode(parts[0]),
                payload: base64UrlDecode(parts[1]),
                signature: parts[2],
            });
            setError(null);
        } catch (err) {
            setError("Failed to decode token. Ensure it is a valid Base64Url encoded JWT.");
            setDecoded(null);
        }
    };

    useEffect(() => {
        decodeToken(token);
    }, [token]);

    const handleCopy = (obj: any) => {
        navigator.clipboard.writeText(JSON.stringify(obj, null, 2));
    };

    return (
        <div className="max-w-5xl mx-auto p-6 space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800">
                    <ShieldCheck className="text-zinc-900 dark:text-zinc-100" size={20} />
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                    JWT Decoder
                </h1>
            </div>

            {/* Input Area */}
            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <label className="text-sm font-semibold text-zinc-500">Encoded Token</label>
                    <button onClick={() => setToken("")} className="text-xs text-zinc-400 hover:text-red-500 flex items-center gap-1">
                        <Trash2 size={14} /> Clear
                    </button>
                </div>
                <textarea
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="Paste your JWT here..."
                    className="w-full h-32 rounded-xl border border-zinc-200 bg-white p-4 text-sm font-mono text-zinc-900 shadow-sm outline-none focus:ring-2 focus:ring-zinc-950/10 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50"
                />
                {error && (
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 dark:bg-red-950/20 dark:border-red-900/30 dark:text-red-400 text-sm">
                        <AlertCircle size={16} /> {error}
                    </div>
                )}
            </div>

            {/* Decoded Results */}
            {decoded && (
                <div className="grid grid-cols-1 gap-6">
                    {/* Header Card */}
                    <div className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 overflow-hidden shadow-sm">
                        <div className="flex items-center justify-between bg-rose-50/50 px-4 py-2 border-b border-rose-100 dark:bg-rose-950/10 dark:border-rose-900/20">
                            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
                                <FileJson size={16} />
                                <span className="text-xs font-bold uppercase tracking-wider">Header</span>
                            </div>
                            <button onClick={() => handleCopy(decoded.header)} className="text-zinc-400 hover:text-zinc-600"><Copy size={14} /></button>
                        </div>
                        <pre className="p-4 text-sm font-mono text-zinc-700 dark:text-zinc-300 overflow-auto">
                            {JSON.stringify(decoded.header, null, 2)}
                        </pre>
                    </div>

                    {/* Payload Card */}
                    <div className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 overflow-hidden shadow-sm">
                        <div className="flex items-center justify-between bg-purple-50/50 px-4 py-2 border-b border-purple-100 dark:bg-purple-950/10 dark:border-purple-900/20">
                            <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                                <Lock size={16} />
                                <span className="text-xs font-bold uppercase tracking-wider">Payload (Claims)</span>
                            </div>
                            <button onClick={() => handleCopy(decoded.payload)} className="text-zinc-400 hover:text-zinc-600"><Copy size={14} /></button>
                        </div>
                        <pre className="p-4 text-sm font-mono text-zinc-700 dark:text-zinc-300 overflow-auto">
                            {JSON.stringify(decoded.payload, null, 2)}
                        </pre>
                    </div>

                    {/* Signature Card */}
                    <div className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 overflow-hidden shadow-sm">
                        <div className="flex items-center justify-between bg-blue-50/50 px-4 py-2 border-b border-blue-100 dark:bg-blue-950/10 dark:border-blue-900/20">
                            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                                <Key size={16} />
                                <span className="text-xs font-bold uppercase tracking-wider">Signature</span>
                            </div>
                        </div>
                        <div className="p-4 text-xs font-mono text-zinc-500 break-all leading-relaxed">
                            {decoded.signature}
                            <p className="mt-3 text-[10px] text-zinc-400 italic">Note: Signature verification requires the secret key (Not performed here for security).</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JwtDecoder;