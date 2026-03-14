"use client";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ArrowRightLeft, Binary, Copy, Trash2 } from "lucide-react";
import { useEffect, useState } from 'react';

const BaseConverter = () => {
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [fromBase, setFromBase] = useState("10");
    const [toBase, setToBase] = useState("2");

    const bases = [
        { label: "Binary (2)", value: "2" },
        { label: "Octal (8)", value: "8" },
        { label: "Decimal (10)", value: "10" },
        { label: "Hexadecimal (16)", value: "16" },
    ];

    // Conversion Logic
    useEffect(() => {
        if (!input) {
            setOutput("");
            return;
        }

        try {
            // Parse the input from the source base
            const decimalValue = parseInt(input, parseInt(fromBase));

            if (isNaN(decimalValue)) {
                setOutput("Invalid Input");
            } else {
                // Convert the decimal value to the target base
                let result = decimalValue.toString(parseInt(toBase));

                // Uppercase Hex for better readability
                if (toBase === "16") result = result.toUpperCase();

                setOutput(result);
            }
        } catch (e) {
            setOutput("Error");
        }
    }, [input, fromBase, toBase]);

    const handleSwap = () => {
        setFromBase(toBase);
        setToBase(fromBase);
        setInput(output === "Invalid Input" ? "" : output);
    };

    const handleCopy = () => {
        if (output && output !== "Invalid Input") {
            navigator.clipboard.writeText(output);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">
            {/* Header */}
            <div className="flex items-center gap-2">
                <Binary className="text-zinc-500" size={24} />
                <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                    Base Converter
                </h1>
            </div>

            {/* Control Bar */}
            <div className="flex flex-col md:flex-row items-center gap-4 bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800">
                <div className="w-full space-y-1.5">
                    <label className="text-xs font-medium text-zinc-500 ml-1">From</label>
                    <Select value={fromBase} onValueChange={setFromBase}>
                        <SelectTrigger className="w-full bg-white dark:bg-zinc-950">
                            <SelectValue placeholder="Select Base" />
                        </SelectTrigger>
                        <SelectContent>
                            {bases.map((b) => (
                                <SelectItem key={b.value} value={b.value}>{b.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <button
                    onClick={handleSwap}
                    className="mt-6 p-2 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-500 transition-colors"
                    title="Swap Bases"
                >
                    <ArrowRightLeft size={20} />
                </button>

                <div className="w-full space-y-1.5">
                    <label className="text-xs font-medium text-zinc-500 ml-1">To</label>
                    <Select value={toBase} onValueChange={setToBase}>
                        <SelectTrigger className="w-full bg-white dark:bg-zinc-950">
                            <SelectValue placeholder="Select Base" />
                        </SelectTrigger>
                        <SelectContent>
                            {bases.map((b) => (
                                <SelectItem key={b.value} value={b.value}>{b.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Input/Output Display */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Input Field */}
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-zinc-500">Input</span>
                        <button
                            onClick={() => setInput("")}
                            className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Enter value..."
                        className="w-full h-40 rounded-xl border border-zinc-200 bg-white p-4 text-lg font-mono text-zinc-900 shadow-sm outline-none transition-all focus:ring-2 focus:ring-zinc-950/10 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:ring-zinc-50/10"
                    />
                </div>

                {/* Output Field */}
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-zinc-500">Output</span>
                        <button
                            onClick={handleCopy}
                            className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                        >
                            <Copy size={16} />
                        </button>
                    </div>
                    <div
                        className="w-full h-40 rounded-xl border border-zinc-200 bg-zinc-50/50 p-4 text-lg font-mono text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900/30 dark:text-zinc-50 flex items-start overflow-auto break-all"
                    >
                        {output || <span className="text-zinc-400 italic text-sm">Waiting for input...</span>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BaseConverter;