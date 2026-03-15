"use client";

import {
    differenceInDays,
    differenceInHours,
    differenceInMinutes,
    differenceInSeconds,
    differenceInWeeks,
    format,
    intervalToDuration
} from "date-fns";
import {
    ArrowLeft,
    ArrowRightLeft,
    CalendarDays,
    Calendar as CalendarIcon,
    Clock,
    Hash,
    History,
    Info,
    Timer
} from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';

// UI Imports
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar"; // Your provided component
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

export default function DateDifference() {
    // Initializing with your example dates: 09-09-1998 and 25-09-2023
    const [startDate, setStartDate] = useState<Date | undefined>(new Date(1998, 8, 9));
    const [endDate, setEndDate] = useState<Date | undefined>(new Date(2023, 8, 25));

    const stats = useMemo(() => {
        if (!startDate || !endDate) return null;

        // Sort dates so the difference is always positive
        const first = startDate < endDate ? startDate : endDate;
        const second = startDate < endDate ? endDate : startDate;

        return {
            breakdown: intervalToDuration({ start: first, end: second }),
            totalDays: differenceInDays(second, first),
            totalWeeks: differenceInWeeks(second, first),
            totalHours: differenceInHours(second, first),
            totalMinutes: differenceInMinutes(second, first),
            totalSeconds: differenceInSeconds(second, first),
        };
    }, [startDate, endDate]);

    const swapDates = () => {
        setStartDate(endDate);
        setEndDate(startDate);
    };

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-8 animate-in fade-in duration-700">

            {/* Header */}
            <div className="flex flex-col gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-6">
                <Link href="/" className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors w-fit">
                    <ArrowLeft size={16} /> Back to Dashboard
                </Link>
                <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400">
                        <CalendarDays size={24} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">Age & Date Difference</h1>
                        <p className="text-sm text-zinc-500">Compare two dates to see exactly how much time has passed.</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Main Selection Area */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="p-8 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] shadow-sm space-y-10">

                        <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">

                            {/* DATE ONE */}
                            <div className="md:col-span-5 space-y-2">
                                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Initial Date</label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className="w-full h-16 justify-start text-left font-bold rounded-2xl border-2 px-4 shadow-sm hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all">
                                            <CalendarIcon className="mr-3 h-5 w-5 text-indigo-500" />
                                            {startDate ? format(startDate, "PPP") : <span>Select Date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0 rounded-2xl border-zinc-200 dark:border-zinc-800" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={startDate}
                                            onSelect={setStartDate}
                                            captionLayout="dropdown" // THIS ENABLES THE QUICK JUMP
                                            fromYear={1900}
                                            toYear={2030}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>

                            {/* SWAP ICON */}
                            <div className="md:col-span-1 flex justify-center pt-6">
                                <button onClick={swapDates} className="p-3 rounded-full bg-zinc-100 dark:bg-zinc-900 text-zinc-500 hover:text-indigo-500 transition-all">
                                    <ArrowRightLeft size={18} />
                                </button>
                            </div>

                            {/* DATE TWO */}
                            <div className="md:col-span-5 space-y-2">
                                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Final Date</label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className="w-full h-16 justify-start text-left font-bold rounded-2xl border-2 px-4 shadow-sm hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all">
                                            <CalendarIcon className="mr-3 h-5 w-5 text-emerald-500" />
                                            {endDate ? format(endDate, "PPP") : <span>Select Date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0 rounded-2xl border-zinc-200 dark:border-zinc-800" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={endDate}
                                            onSelect={setEndDate}
                                            captionLayout="dropdown" // THIS ENABLES THE QUICK JUMP
                                            fromYear={1900}
                                            toYear={2030}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>

                        {/* The "Big 3" Result Breakdown */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                                <Info size={14} /> Duration Breakdown
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <ResultTile value={stats?.breakdown.years} label="Years" />
                                <ResultTile value={stats?.breakdown.months} label="Months" />
                                <ResultTile value={stats?.breakdown.days} label="Days" />
                            </div>
                        </div>
                    </div>

                    {/* Technical Summary Cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <SummaryCard icon={<CalendarDays size={14} />} label="Total Days" value={stats?.totalDays} />
                        <SummaryCard icon={<History size={14} />} label="Total Weeks" value={stats?.totalWeeks} />
                        <SummaryCard icon={<Timer size={14} />} label="Total Hours" value={stats?.totalHours} />
                        <SummaryCard icon={<Hash size={14} />} label="Total Seconds" value={stats?.totalSeconds} />
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="p-8 bg-zinc-100 dark:bg-zinc-900 rounded-[2.5rem] text-zinc-800 dark:text-zinc-200 space-y-4 shadow-xl">
                        <Clock size={32} className="opacity-50" />
                        <h4 className="text-xl font-bold leading-tight">Fast Navigation</h4>
                        <p className="text-sm opacity-80 leading-relaxed">
                            Inside the calendar popover, you can click the <b>Month</b> or <b>Year</b> label to open a dropdown. This allows you to jump directly to any year (like 1998) without manual scrolling.
                        </p>
                    </div>

                    <div className="p-6 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-sm space-y-3">
                        <div className="flex items-center gap-2 text-indigo-500 font-bold text-sm">
                            <Info size={16} />
                            <span>How it works</span>
                        </div>
                        <p className="text-xs text-zinc-500 leading-relaxed">
                            We use the <b>ISO-8601</b> standard to calculate intervals. Total seconds and minutes are calculated based on the precise start of the day (00:00:00).
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Sub-components for clean UI
function ResultTile({ value, label }: { value?: number, label: string }) {
    return (
        <div className="bg-zinc-50 dark:bg-zinc-900/50 p-6 rounded-[2rem] border border-zinc-100 dark:border-zinc-800 text-center">
            <div className="text-5xl font-black text-zinc-900 dark:text-zinc-50">{value ?? 0}</div>
            <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">{label}</div>
        </div>
    )
}

function SummaryCard({ icon, label, value }: { icon: any, label: string, value?: number }) {
    return (
        <div className="p-5 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-sm">
            <div className="flex items-center gap-2 text-zinc-400 text-[10px] font-bold uppercase tracking-wider mb-2">
                {icon} {label}
            </div>
            <div className="text-xl font-black text-zinc-900 dark:text-zinc-50">
                {value?.toLocaleString() ?? 0}
            </div>
        </div>
    );
}