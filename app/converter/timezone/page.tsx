"use client";

import {
    ArrowLeft,
    ArrowRightLeft,
    Calendar,
    Check,
    Clock,
    Copy,
    Globe,
    MapPin,
    Zap
} from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

// Common Timezones List
const TIMEZONES = [
    { label: "UTC (Coordinated Universal Time)", value: "UTC" },
    { label: "London (GMT/BST)", value: "Europe/London" },
    { label: "New York (EST/EDT)", value: "America/New_York" },
    { label: "Los Angeles (PST/PDT)", value: "America/Los_Angeles" },
    { label: "New Delhi (IST)", value: "Asia/Kolkata" },
    { label: "Tokyo (JST)", value: "Asia/Tokyo" },
    { label: "Dubai (GST)", value: "Asia/Dubai" },
    { label: "Sydney (AEST/AEDT)", value: "Australia/Sydney" },
    { label: "Singapore (SGT)", value: "Asia/Singapore" },
    { label: "Berlin (CET/CEST)", value: "Europe/Berlin" },
];

export default function TimezoneConverter() {
    const [fromZone, setFromZone] = useState("UTC");
    const [toZone, setToZone] = useState("Asia/Kolkata");
    const [baseTime, setBaseTime] = useState(new Date());
    const [copied, setCopied] = useState(false);
    const [is24Hour, setIs24Hour] = useState(false);

    // Sync to local time on mount
    useEffect(() => {
        const localZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        setFromZone(localZone);
    }, []);

    // Update base time every minute if it's "Live"
    // (Optional: You could add a 'Live' toggle, but here we'll keep it static for easier conversion)

    const formatTime = (date: Date, zone: string) => {
        return new Intl.DateTimeFormat('en-US', {
            timeZone: zone,
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: !is24Hour,
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        }).format(date);
    };

    const getOffset = (zone: string) => {
        const parts = new Intl.DateTimeFormat('en-US', {
            timeZone: zone,
            timeZoneName: 'shortOffset'
        }).formatToParts(new Date());
        return parts.find(p => p.type === 'timeZoneName')?.value || 'UTC';
    };

    const swapZones = () => {
        setFromZone(toZone);
        setToZone(fromZone);
    };

    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const hours = parseInt(e.target.value);
        const newDate = new Date();
        newDate.setHours(hours, 0, 0, 0);
        setBaseTime(newDate);
    };

    const copyResult = () => {
        const result = `${formatTime(baseTime, toZone)} (${getOffset(toZone)})`;
        navigator.clipboard.writeText(result);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-8 animate-in fade-in duration-700">

            {/* Header */}
            <div className="flex flex-col gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-6">
                <Link href="/" className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors w-fit">
                    <ArrowLeft size={16} /> Back to Dashboard
                </Link>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400">
                            <Clock size={24} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">Timezone Converter</h1>
                            <p className="text-sm text-zinc-500">Plan global meetings by converting time across any region.</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIs24Hour(!is24Hour)}
                        className="px-4 py-2 bg-zinc-100 dark:bg-zinc-900 rounded-xl text-xs font-bold hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-all"
                    >
                        {is24Hour ? '24H Format' : '12H Format'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Main Converter Card */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="p-8 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] shadow-sm space-y-12 relative overflow-hidden">

                        <div className="grid grid-cols-1 md:grid-cols-11 gap-6 items-center">

                            {/* FROM SECTION */}
                            <div className="md:col-span-5 space-y-4">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Origin Zone</label>
                                    <span className="text-[10px] font-mono bg-zinc-100 dark:bg-zinc-900 px-2 py-0.5 rounded text-zinc-500">{getOffset(fromZone)}</span>
                                </div>
                                <div className="space-y-3">
                                    <div className="text-3xl font-black text-zinc-900 dark:text-zinc-50">
                                        {formatTime(baseTime, fromZone).split(',')[1]}
                                    </div>
                                    <select
                                        value={fromZone}
                                        onChange={(e) => setFromZone(e.target.value)}
                                        className="w-full bg-zinc-50 dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 font-bold text-sm outline-none shadow-sm focus:border-blue-500 transition-all"
                                    >
                                        {TIMEZONES.map(tz => <option key={tz.value} value={tz.value}>{tz.label}</option>)}
                                        <option value={Intl.DateTimeFormat().resolvedOptions().timeZone}>Your Local Time</option>
                                    </select>
                                </div>
                            </div>

                            {/* SWAP */}
                            <div className="md:col-span-1 flex justify-center">
                                <button
                                    onClick={swapZones}
                                    className="p-4 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:rotate-180 transition-transform duration-500 shadow-xl"
                                >
                                    <ArrowRightLeft size={20} />
                                </button>
                            </div>

                            {/* TO SECTION */}
                            <div className="md:col-span-5 space-y-4">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Destination Zone</label>
                                    <span className="text-[10px] font-mono bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded text-blue-600">{getOffset(toZone)}</span>
                                </div>
                                <div className="space-y-3">
                                    <div className="text-3xl font-black text-blue-600 dark:text-blue-400">
                                        {formatTime(baseTime, toZone).split(',')[1]}
                                    </div>
                                    <select
                                        value={toZone}
                                        onChange={(e) => setToZone(e.target.value)}
                                        className="w-full bg-zinc-50 dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 font-bold text-sm outline-none shadow-sm focus:border-blue-500 transition-all"
                                    >
                                        {TIMEZONES.map(tz => <option key={tz.value} value={tz.value}>{tz.label}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Time Scrubber Slider */}
                        <div className="space-y-6 pt-6 border-t border-zinc-100 dark:border-zinc-800">
                            <div className="flex justify-between items-center">
                                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                                    <Zap size={14} className="text-amber-500" /> Scrub Time (24h Range)
                                </label>
                                <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                                    {baseTime.getHours()}:00
                                </span>
                            </div>
                            <input
                                type="range" min="0" max="23" step="1"
                                value={baseTime.getHours()}
                                onChange={handleSliderChange}
                                className="w-full h-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
                            />
                            <div className="flex justify-between text-[10px] font-bold text-zinc-400 px-1">
                                <span>12 AM</span>
                                <span>6 AM</span>
                                <span>12 PM</span>
                                <span>6 PM</span>
                                <span>11 PM</span>
                            </div>
                        </div>

                        {/* Action Bar */}
                        <div className="flex justify-between items-center pt-2">
                            <div className="flex items-center gap-2 text-zinc-400 text-xs font-medium">
                                <Calendar size={14} />
                                Date: {formatTime(baseTime, toZone).split(',')[0]}
                            </div>
                            <button
                                onClick={copyResult}
                                className="flex items-center gap-2 px-6 py-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl font-bold text-sm hover:scale-[1.02] active:scale-95 transition-all"
                            >
                                {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                                Copy Translation
                            </button>
                        </div>
                    </div>
                </div>

                {/* Sidebar: Common Differences */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="p-6 bg-zinc-50 dark:bg-zinc-900/50 rounded-3xl border border-zinc-200 dark:border-zinc-800 space-y-4">
                        <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                            <Globe size={14} /> Quick Reference
                        </label>
                        <div className="space-y-3">
                            {[
                                { label: "New York", val: "America/New_York" },
                                { label: "London", val: "Europe/London" },
                                { label: "Tokyo", val: "Asia/Tokyo" },
                            ].map((loc) => (
                                <div key={loc.label} className="flex items-center justify-between p-3 bg-white dark:bg-zinc-950 rounded-xl border border-zinc-100 dark:border-zinc-800">
                                    <div>
                                        <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{loc.label}</p>
                                        <p className="text-[10px] text-zinc-400">{getOffset(loc.val)}</p>
                                    </div>
                                    <div className="text-sm font-mono font-bold text-blue-500">
                                        {new Intl.DateTimeFormat('en-US', { timeZone: loc.val, hour: 'numeric', minute: 'numeric', hour12: false }).format(baseTime)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="p-6 bg-white dark:bg-zinc-950 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                        <div className="flex items-center gap-3 text-emerald-500 mb-3">
                            <MapPin size={20} />
                            <h4 className="font-bold text-sm">Local Context</h4>
                        </div>
                        <p className="text-xs text-zinc-500 leading-relaxed">
                            Your current local timezone is detected as <b>{Intl.DateTimeFormat().resolvedOptions().timeZone}</b>.
                            Use the slider to check availability for international sync calls.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}