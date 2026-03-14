"use client";

import { Banknote, Calendar, Percent } from "lucide-react";
import { useEffect, useState } from 'react';

const EmiCalculator = () => {
    const [principal, setPrincipal] = useState<number>(500000);
    const [interestRate, setInterestRate] = useState<number>(8.5);
    const [tenure, setTenure] = useState<number>(5); // In years

    const [results, setResults] = useState({
        monthlyEmi: 0,
        totalInterest: 0,
        totalPayment: 0
    });

    useEffect(() => {
        const p = principal;
        const r = interestRate / 12 / 100; // monthly interest rate
        const n = tenure * 12; // total number of months

        // EMI Formula: [P x R x (1+R)^N]/[(1+R)^N-1]
        const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);

        const totalPay = emi * n;
        const totalInt = totalPay - p;

        setResults({
            monthlyEmi: emi,
            totalInterest: totalInt,
            totalPayment: totalPay
        });
    }, [principal, interestRate, tenure]);

    const handleCopy = (val: number) => {
        navigator.clipboard.writeText(val.toFixed(2));
    };

    return (
        <div className="max-w-5xl mx-auto p-6 space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100">
                    <Percent size={20} />
                </div>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                        EMI Calculator
                    </h1>
                    <p className="text-sm text-zinc-500">Calculate monthly installments for loans and mortgages.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                {/* Controls Section */}
                <div className="space-y-6 p-6 rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 shadow-sm">

                    {/* Principal Input */}
                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <label className="text-sm font-semibold text-zinc-600 dark:text-zinc-400 flex items-center gap-2">
                                <Banknote size={16} /> Loan Amount
                            </label>
                            <span className="font-mono font-bold text-zinc-900 dark:text-zinc-50">₹{principal.toLocaleString()}</span>
                        </div>
                        <input
                            type="range" min="10000" max="10000000" step="10000"
                            value={principal} onChange={(e) => setPrincipal(Number(e.target.value))}
                            className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-zinc-900 dark:bg-zinc-800 dark:accent-zinc-100"
                        />
                    </div>

                    {/* Interest Rate Input */}
                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <label className="text-sm font-semibold text-zinc-600 dark:text-zinc-400 flex items-center gap-2">
                                <Percent size={16} /> Interest Rate (p.a)
                            </label>
                            <span className="font-mono font-bold text-zinc-900 dark:text-zinc-50">{interestRate}%</span>
                        </div>
                        <input
                            type="range" min="1" max="20" step="0.1"
                            value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value))}
                            className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-zinc-900 dark:bg-zinc-800 dark:accent-zinc-100"
                        />
                    </div>

                    {/* Tenure Input */}
                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <label className="text-sm font-semibold text-zinc-600 dark:text-zinc-400 flex items-center gap-2">
                                <Calendar size={16} /> Loan Tenure
                            </label>
                            <span className="font-mono font-bold text-zinc-900 dark:text-zinc-50">{tenure} Years</span>
                        </div>
                        <input
                            type="range" min="1" max="30" step="1"
                            value={tenure} onChange={(e) => setTenure(Number(e.target.value))}
                            className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-zinc-900 dark:bg-zinc-800 dark:accent-zinc-100"
                        />
                    </div>
                </div>

                {/* Results Section */}
                <div className="space-y-4">
                    <div className="p-8 rounded-2xl bg-zinc-900 text-zinc-50 dark:bg-white dark:text-zinc-900 shadow-xl overflow-hidden relative">
                        <p className="text-xs font-bold uppercase tracking-[0.2em] opacity-60 mb-1">Monthly EMI</p>
                        <h2 className="text-5xl font-mono font-bold tracking-tighter mb-4">
                            ₹{Math.round(results.monthlyEmi).toLocaleString()}
                        </h2>
                        <div className="flex gap-4 pt-4 border-t border-white/10 dark:border-black/5">
                            <div className="flex-1">
                                <p className="text-[10px] uppercase opacity-50 mb-1">Total Interest</p>
                                <p className="font-mono font-semibold">₹{Math.round(results.totalInterest).toLocaleString()}</p>
                            </div>
                            <div className="flex-1">
                                <p className="text-[10px] uppercase opacity-50 mb-1">Total Amount</p>
                                <p className="font-mono font-semibold">₹{Math.round(results.totalPayment).toLocaleString()}</p>
                            </div>
                        </div>
                    </div>

                    {/* Detailed Breakdown Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
                            <p className="text-[10px] font-bold uppercase text-zinc-400 mb-1">Principal Amount</p>
                            <div className="flex justify-between items-end">
                                <p className="text-xl font-mono font-bold text-zinc-800 dark:text-zinc-200">
                                    {((principal / results.totalPayment) * 100).toFixed(1)}%
                                </p>
                                <span className="text-xs text-zinc-500">₹{principal.toLocaleString()}</span>
                            </div>
                            <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-1.5 mt-2 rounded-full overflow-hidden">
                                <div className="bg-zinc-900 dark:bg-zinc-100 h-full" style={{ width: `${(principal / results.totalPayment) * 100}%` }}></div>
                            </div>
                        </div>

                        <div className="p-4 rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
                            <p className="text-[10px] font-bold uppercase text-zinc-400 mb-1">Interest Component</p>
                            <div className="flex justify-between items-end">
                                <p className="text-xl font-mono font-bold text-orange-600 dark:text-orange-400">
                                    {((results.totalInterest / results.totalPayment) * 100).toFixed(1)}%
                                </p>
                                <span className="text-xs text-zinc-500">₹{Math.round(results.totalInterest).toLocaleString()}</span>
                            </div>
                            <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-1.5 mt-2 rounded-full overflow-hidden">
                                <div className="bg-orange-500 h-full" style={{ width: `${(results.totalInterest / results.totalPayment) * 100}%` }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmiCalculator;