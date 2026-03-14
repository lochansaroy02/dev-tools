"use client";

import { Calendar, Coins, TrendingUp } from "lucide-react";
import { useEffect, useState } from 'react';

const SipCalculator = () => {
    const [monthlyInvestment, setMonthlyInvestment] = useState<number>(5000);
    const [expectedReturn, setExpectedReturn] = useState<number>(12);
    const [tenure, setTenure] = useState<number>(10);

    const [results, setResults] = useState({
        totalInvested: 0,
        estimatedReturns: 0,
        totalValue: 0
    });

    useEffect(() => {
        const P = monthlyInvestment;
        const i = expectedReturn / 100 / 12; // Monthly interest rate
        const n = tenure * 12; // Total number of months

        // SIP Formula: M = P × ({[1 + i]^n – 1} / i) × (1 + i)
        const totalValue = P * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
        const invested = P * n;
        const returns = totalValue - invested;

        setResults({
            totalInvested: invested,
            estimatedReturns: returns,
            totalValue: totalValue
        });
    }, [monthlyInvestment, expectedReturn, tenure]);

    return (
        <div className="max-w-5xl mx-auto p-6 space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100">
                    <TrendingUp size={20} />
                </div>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                        SIP Calculator
                    </h1>
                    <p className="text-sm text-zinc-500">Calculate the future value of your monthly investments.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                {/* Controls Section */}
                <div className="space-y-8 p-6 rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 shadow-sm">

                    {/* Monthly Investment */}
                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <label className="text-sm font-semibold text-zinc-600 dark:text-zinc-400 flex items-center gap-2">
                                <Coins size={16} /> Monthly Investment
                            </label>
                            <span className="font-mono font-bold text-zinc-900 dark:text-zinc-50">₹{monthlyInvestment.toLocaleString()}</span>
                        </div>
                        <input
                            type="range" min="500" max="100000" step="500"
                            value={monthlyInvestment} onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
                            className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-zinc-900 dark:bg-zinc-800 dark:accent-zinc-100"
                        />
                    </div>

                    {/* Expected Return Rate */}
                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <label className="text-sm font-semibold text-zinc-600 dark:text-zinc-400 flex items-center gap-2">
                                <TrendingUp size={16} /> Expected Return Rate (p.a)
                            </label>
                            <span className="font-mono font-bold text-zinc-900 dark:text-zinc-50">{expectedReturn}%</span>
                        </div>
                        <input
                            type="range" min="1" max="30" step="0.5"
                            value={expectedReturn} onChange={(e) => setExpectedReturn(Number(e.target.value))}
                            className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-zinc-900 dark:bg-zinc-800 dark:accent-zinc-100"
                        />
                    </div>

                    {/* Tenure */}
                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <label className="text-sm font-semibold text-zinc-600 dark:text-zinc-400 flex items-center gap-2">
                                <Calendar size={16} /> Time Period (Years)
                            </label>
                            <span className="font-mono font-bold text-zinc-900 dark:text-zinc-50">{tenure} Yr</span>
                        </div>
                        <input
                            type="range" min="1" max="40" step="1"
                            value={tenure} onChange={(e) => setTenure(Number(e.target.value))}
                            className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-zinc-900 dark:bg-zinc-800 dark:accent-zinc-100"
                        />
                    </div>
                </div>

                {/* Results Section */}
                <div className="space-y-4">
                    <div className="p-8 rounded-2xl bg-zinc-900 text-zinc-50 dark:bg-white dark:text-zinc-900 shadow-xl overflow-hidden relative">
                        <p className="text-xs font-bold uppercase tracking-[0.2em] opacity-60 mb-1">Estimated Returns</p>
                        <h2 className="text-5xl font-mono font-bold tracking-tighter mb-4">
                            ₹{Math.round(results.estimatedReturns).toLocaleString()}
                        </h2>
                        <div className="flex gap-4 pt-4 border-t border-white/10 dark:border-black/5">
                            <div className="flex-1">
                                <p className="text-[10px] uppercase opacity-50 mb-1">Invested Amount</p>
                                <p className="font-mono font-semibold">₹{(results.totalInvested).toLocaleString()}</p>
                            </div>
                            <div className="flex-1">
                                <p className="text-[10px] uppercase opacity-50 mb-1">Total Value</p>
                                <p className="font-mono font-semibold">₹{Math.round(results.totalValue).toLocaleString()}</p>
                            </div>
                        </div>
                    </div>

                    {/* Breakdown Visuals */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
                            <p className="text-[10px] font-bold uppercase text-zinc-400 mb-1">Principal Invested</p>
                            <div className="flex justify-between items-end">
                                <p className="text-xl font-mono font-bold text-zinc-800 dark:text-zinc-200">
                                    {((results.totalInvested / results.totalValue) * 100).toFixed(1)}%
                                </p>
                                <span className="text-xs text-zinc-500">₹{results.totalInvested.toLocaleString()}</span>
                            </div>
                            <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-1.5 mt-2 rounded-full overflow-hidden">
                                <div className="bg-zinc-400 h-full" style={{ width: `${(results.totalInvested / results.totalValue) * 100}%` }}></div>
                            </div>
                        </div>

                        <div className="p-4 rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
                            <p className="text-[10px] font-bold uppercase text-zinc-400 mb-1">Wealth Gained</p>
                            <div className="flex justify-between items-end">
                                <p className="text-xl font-mono font-bold text-emerald-600 dark:text-emerald-400">
                                    {((results.estimatedReturns / results.totalValue) * 100).toFixed(1)}%
                                </p>
                                <span className="text-xs text-zinc-500">₹{Math.round(results.estimatedReturns).toLocaleString()}</span>
                            </div>
                            <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-1.5 mt-2 rounded-full overflow-hidden">
                                <div className="bg-emerald-500 h-full" style={{ width: `${(results.estimatedReturns / results.totalValue) * 100}%` }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SipCalculator;