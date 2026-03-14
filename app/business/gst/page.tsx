"use client";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Briefcase, Copy } from "lucide-react";
import { useEffect, useState } from 'react';

const GstCalculator = () => {
    const [amount, setAmount] = useState<string>("");
    const [gstRate, setGstRate] = useState<string>("18");
    const [mode, setMode] = useState<"exclusive" | "inclusive">("exclusive");
    const [results, setResults] = useState({
        netAmount: 0,
        gstAmount: 0,
        totalAmount: 0,
        cgst: 0,
        sgst: 0
    });

    useEffect(() => {
        const val = parseFloat(amount);
        if (isNaN(val)) {
            setResults({ netAmount: 0, gstAmount: 0, totalAmount: 0, cgst: 0, sgst: 0 });
            return;
        }

        const rate = parseFloat(gstRate);
        let net, gst, total;

        if (mode === "exclusive") {
            // Adding GST to base price
            net = val;
            gst = (val * rate) / 100;
            total = val + gst;
        } else {
            // Extracting GST from total price
            total = val;
            net = val / (1 + rate / 100);
            gst = total - net;
        }

        setResults({
            netAmount: net,
            gstAmount: gst,
            totalAmount: total,
            cgst: gst / 2,
            sgst: gst / 2
        });
    }, [amount, gstRate, mode]);

    const handleCopy = (val: number) => {
        navigator.clipboard.writeText(val.toFixed(2));
    };

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100">
                    <Briefcase size={20} />
                </div>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                        GST Calculator
                    </h1>
                    <p className="text-sm text-zinc-500">Calculate inclusive and exclusive GST values.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Input Column */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="space-y-4 p-6 rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
                        {/* Calculation Mode */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Calculation Mode</label>
                            <div className="flex p-1 bg-zinc-100 dark:bg-zinc-900 rounded-lg">
                                <button
                                    onClick={() => setMode("exclusive")}
                                    className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${mode === "exclusive" ? "bg-white shadow-sm text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50" : "text-zinc-500"}`}
                                >
                                    Add GST
                                </button>
                                <button
                                    onClick={() => setMode("inclusive")}
                                    className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${mode === "inclusive" ? "bg-white shadow-sm text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50" : "text-zinc-500"}`}
                                >
                                    Remove GST
                                </button>
                            </div>
                        </div>

                        {/* Amount Input */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                                {mode === "exclusive" ? "Net Amount" : "Total Amount"}
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 font-medium">₹</span>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="0.00"
                                    className="w-full pl-8 pr-4 py-2 rounded-lg border border-zinc-200 bg-transparent outline-none focus:ring-2 focus:ring-zinc-900/5 dark:border-zinc-800 dark:focus:ring-zinc-50/5 font-mono"
                                />
                            </div>
                        </div>

                        {/* GST Rate Select */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">GST Rate (%)</label>
                            <Select value={gstRate} onValueChange={setGstRate}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Rate" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="5">5% (Essentials)</SelectItem>
                                    <SelectItem value="12">12% (Standard)</SelectItem>
                                    <SelectItem value="18">18% (Standard Plus)</SelectItem>
                                    <SelectItem value="28">28% (Luxury)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* Results Column */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <ResultCard label="Net Amount (Base)" value={results.netAmount} onCopy={() => handleCopy(results.netAmount)} />
                        <ResultCard label="Total GST" value={results.gstAmount} onCopy={() => handleCopy(results.gstAmount)} highlight />
                        <ResultCard label="CGST (50%)" value={results.cgst} onCopy={() => handleCopy(results.cgst)} sub />
                        <ResultCard label="SGST (50%)" value={results.sgst} onCopy={() => handleCopy(results.sgst)} sub />
                    </div>

                    <div className="p-6 rounded-2xl bg-zinc-900 text-zinc-50 dark:bg-white dark:text-zinc-900 shadow-xl overflow-hidden relative">
                        <div className="relative z-10 flex justify-between items-end">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-[0.2em] opacity-60 mb-1">Final Total</p>
                                <h2 className="text-4xl font-mono font-bold tracking-tighter">
                                    ₹{results.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </h2>
                            </div>
                            <button
                                onClick={() => handleCopy(results.totalAmount)}
                                className="p-2 rounded-full bg-white/10 hover:bg-white/20 dark:bg-black/5 dark:hover:bg-black/10 transition-colors"
                            >
                                <Copy size={20} />
                            </button>
                        </div>
                        {/* Visual background decoration */}
                        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-32 h-32 bg-white/5 rounded-full blur-3xl" />
                    </div>
                </div>
            </div>
        </div>
    );
};

const ResultCard = ({ label, value, onCopy, highlight = false, sub = false }: { label: string, value: number, onCopy: () => void, highlight?: boolean, sub?: boolean }) => (
    <div className={`p-4 rounded-xl border transition-all group ${sub ? "border-zinc-100 dark:border-zinc-900" : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm"}`}>
        <div className="flex justify-between items-center mb-1">
            <span className={`text-[10px] font-bold uppercase tracking-widest ${highlight ? "text-emerald-600 dark:text-emerald-400" : "text-zinc-400"}`}>
                {label}
            </span>
            <button onClick={onCopy} className="opacity-0 group-hover:opacity-100 transition-opacity text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100">
                <Copy size={14} />
            </button>
        </div>
        <p className={`text-xl font-mono font-bold ${highlight ? "text-emerald-600 dark:text-emerald-400" : "text-zinc-800 dark:text-zinc-200"}`}>
            ₹{value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
    </div>
);

export default GstCalculator;