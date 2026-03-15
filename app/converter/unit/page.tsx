"use client";

import {
    ArrowLeft,
    ArrowRightLeft,
    Check,
    Copy,
    HardDrive,
    Info,
    Ruler,
    Settings2,
    Square,
    Thermometer,
    Weight,
    Wind,
    Zap
} from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';

// Data Structure: Icons are stored as Component References
const UNIT_DATA = {
    length: {
        title: "Length",
        icon: Ruler,
        color: "text-blue-600 bg-blue-50 dark:bg-blue-950/30",
        base: "meter",
        units: {
            millimeter: 0.001,
            centimeter: 0.01,
            meter: 1,
            kilometer: 1000,
            inch: 0.0254,
            foot: 0.3048,
            yard: 0.9144,
            mile: 1609.344,
        }
    },
    weight: {
        title: "Weight",
        icon: Weight,
        color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30",
        base: "kilogram",
        units: {
            milligram: 0.000001,
            gram: 0.001,
            kilogram: 1,
            ton: 1000,
            ounce: 0.0283495,
            pound: 0.453592,
        }
    },
    digital: {
        title: "Digital Storage",
        icon: HardDrive,
        color: "text-indigo-600 bg-indigo-50 dark:bg-indigo-950/30",
        base: "byte",
        units: {
            byte: 1,
            kilobyte: 1024,
            megabyte: 1024 ** 2,
            gigabyte: 1024 ** 3,
            terabyte: 1024 ** 4,
            petabyte: 1024 ** 5,
        }
    },
    area: {
        title: "Area",
        icon: Square,
        color: "text-purple-600 bg-purple-50 dark:bg-purple-950/30",
        base: "sq_meter",
        units: {
            sq_millimeter: 0.000001,
            sq_centimeter: 0.0001,
            sq_meter: 1,
            sq_kilometer: 1000000,
            acre: 4046.86,
            hectare: 10000,
        }
    },
    pressure: {
        title: "Pressure",
        icon: Wind,
        color: "text-cyan-600 bg-cyan-50 dark:bg-cyan-950/30",
        base: "pascal",
        units: {
            pascal: 1,
            kilopascal: 1000,
            bar: 100000,
            psi: 6894.76,
            atmosphere: 101325,
        }
    },
    temperature: {
        title: "Temperature",
        icon: Thermometer,
        color: "text-rose-600 bg-rose-50 dark:bg-rose-950/30",
        units: ["celsius", "fahrenheit", "kelvin"]
    }
};

type Category = keyof typeof UNIT_DATA;

export default function UnitConverter() {
    const [category, setCategory] = useState<Category>("length");
    const [inputValue, setInputValue] = useState<string>("1");
    const [fromUnit, setFromUnit] = useState<string>("meter");
    const [toUnit, setToUnit] = useState<string>("kilometer");
    const [copied, setCopied] = useState(false);

    const handleCategoryChange = (newCat: Category) => {
        setCategory(newCat);
        if (newCat === 'temperature') {
            setFromUnit('celsius');
            setToUnit('fahrenheit');
        } else {
            const units = Object.keys(UNIT_DATA[newCat].units!);
            setFromUnit(units[0]);
            setToUnit(units[1] || units[0]);
        }
    };

    const result = useMemo(() => {
        const val = parseFloat(inputValue);
        if (isNaN(val)) return "0";

        if (category === 'temperature') {
            let celsius = val;
            if (fromUnit === 'fahrenheit') celsius = (val - 32) / 1.8;
            if (fromUnit === 'kelvin') celsius = val - 273.15;

            if (toUnit === 'celsius') return celsius.toFixed(2);
            if (toUnit === 'fahrenheit') return (celsius * 1.8 + 32).toFixed(2);
            if (toUnit === 'kelvin') return (celsius + 273.15).toFixed(2);
        } else {
            const factors = UNIT_DATA[category].units as Record<string, number>;
            const valueInBase = val * factors[fromUnit];
            const converted = valueInBase / factors[toUnit];

            return converted < 0.000001 || converted > 100000000
                ? converted.toExponential(4)
                : converted.toLocaleString(undefined, { maximumFractionDigits: 6 });
        }
        return "0";
    }, [category, inputValue, fromUnit, toUnit]);

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-8 animate-in fade-in duration-700">

            {/* Header */}
            <div className="flex flex-col gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-6">
                <Link href="/" className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors w-fit">
                    <ArrowLeft size={16} /> Back to Dashboard
                </Link>
                <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-lg shadow-zinc-500/20">
                        <Ruler size={24} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">Unit Converter</h1>
                        <p className="text-sm text-zinc-500">Fast, precise conversion across multiple scientific and digital categories.</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Category Sidebar */}
                <div className="lg:col-span-4 space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 px-2 flex items-center gap-2">
                        <Settings2 size={12} /> Selection
                    </label>
                    {Object.entries(UNIT_DATA).map(([id, data]) => {
                        const Icon = data.icon;
                        return (
                            <button
                                key={id}
                                onClick={() => handleCategoryChange(id as Category)}
                                className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all group ${category === id
                                    ? 'border-zinc-900 dark:border-zinc-100 bg-white dark:bg-zinc-950 shadow-md'
                                    : 'border-transparent bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}
                            >
                                <div className={`p-2.5 rounded-xl transition-colors ${category === id ? data.color : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-500'}`}>
                                    <Icon size={20} />
                                </div>
                                <span className={`font-bold text-sm ${category === id ? 'text-zinc-900 dark:text-zinc-50' : 'text-zinc-500 group-hover:text-zinc-700 dark:group-hover:text-zinc-300'}`}>
                                    {data.title}
                                </span>
                            </button>
                        )
                    })}
                </div>

                {/* Converter Main UI */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="p-10 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] shadow-sm relative overflow-hidden">

                        {/* Background Decoration Icon */}
                        <div className="absolute -top-6 -right-6 p-12 opacity-[0.03] dark:opacity-[0.05] pointer-events-none text-zinc-900 dark:text-zinc-100">
                            {(() => {
                                const CategoryIcon = UNIT_DATA[category].icon;
                                return <CategoryIcon size={240} />;
                            })()}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-11 gap-8 items-center relative z-10">
                            <div className="md:col-span-5 space-y-4">
                                <input
                                    type="number"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    className="w-full text-5xl font-black bg-transparent border-b-2 border-zinc-100 dark:border-zinc-800 focus:border-zinc-900 dark:focus:border-zinc-100 outline-none py-2 transition-all placeholder:text-zinc-200"
                                />
                                <select
                                    value={fromUnit}
                                    onChange={(e) => setFromUnit(e.target.value)}
                                    className="w-full bg-zinc-50 dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800 font-bold text-sm outline-none capitalize cursor-pointer hover:border-zinc-300 transition-colors"
                                >
                                    {category === 'temperature'
                                        ? (UNIT_DATA.temperature.units as string[]).map(u => <option key={u} value={u}>{u}</option>)
                                        : Object.keys(UNIT_DATA[category].units!).map(u => <option key={u} value={u}>{u.replace('_', ' ')}</option>)
                                    }
                                </select>
                            </div>

                            <div className="md:col-span-1 flex justify-center">
                                <button
                                    onClick={() => { setFromUnit(toUnit); setToUnit(fromUnit); }}
                                    className="p-4 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:rotate-180 transition-transform duration-500 shadow-xl"
                                >
                                    <ArrowRightLeft size={20} />
                                </button>
                            </div>

                            <div className="md:col-span-5 space-y-4 text-right md:text-left">
                                <div className="w-full text-5xl font-black py-2 truncate text-indigo-600 dark:text-indigo-400 min-h-[60px]">
                                    {result}
                                </div>
                                <select
                                    value={toUnit}
                                    onChange={(e) => setToUnit(e.target.value)}
                                    className="w-full bg-zinc-50 dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800 font-bold text-sm outline-none capitalize cursor-pointer hover:border-zinc-300 transition-colors"
                                >
                                    {category === 'temperature'
                                        ? (UNIT_DATA.temperature.units as string[]).map(u => <option key={u} value={u}>{u}</option>)
                                        : Object.keys(UNIT_DATA[category].units!).map(u => <option key={u} value={u}>{u.replace('_', ' ')}</option>)
                                    }
                                </select>
                            </div>
                        </div>

                        <div className="mt-12 flex justify-between items-center pt-8 border-t border-zinc-100 dark:border-zinc-800">
                            <div className="flex items-center gap-2 text-zinc-400 text-xs font-bold uppercase tracking-widest">
                                <Info size={14} className="text-indigo-500" /> Scientific Mode Active
                            </div>
                            <button
                                onClick={() => { navigator.clipboard.writeText(result.toString().replace(/,/g, '')); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                                className="flex items-center gap-2 px-6 py-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl font-bold text-xs hover:scale-105 active:scale-95 transition-all shadow-lg"
                            >
                                {copied ? <Check size={14} /> : <Copy size={14} />}
                                {copied ? 'Copied!' : 'Copy Result'}
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-3xl border border-indigo-100 dark:border-indigo-900/50 flex gap-4 items-start">
                            <Zap className="text-indigo-600 mt-1 shrink-0" size={20} />
                            <div className="space-y-1">
                                <h4 className="font-bold text-sm text-indigo-900 dark:text-indigo-300">Precision Engine</h4>
                                <p className="text-[11px] text-indigo-700/70 dark:text-indigo-400/70 leading-relaxed">
                                    Conversions are processed using 64-bit IEEE 754 floating point arithmetic for maximum accuracy.
                                </p>
                            </div>
                        </div>
                        <div className="p-6 bg-emerald-50 dark:bg-emerald-900/20 rounded-3xl border border-emerald-100 dark:border-emerald-900/50 flex gap-4 items-start">
                            <Settings2 className="text-emerald-600 mt-1 shrink-0" size={20} />
                            <div className="space-y-1">
                                <h4 className="font-bold text-sm text-emerald-900 dark:text-emerald-300">Base Unit</h4>
                                <p className="text-[11px] text-emerald-700/70 dark:text-emerald-400/70 leading-relaxed">
                                    Current normalization unit: <b className="capitalize">{(UNIT_DATA[category] as any).base || 'N/A'}</b>.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}