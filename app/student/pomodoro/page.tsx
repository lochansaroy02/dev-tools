"use client";

import { Brain, Coffee, Lamp, Pause, Play, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from 'react';

type TimerMode = 'focus' | 'short' | 'long';

const PomodoroTimer = () => {
    const [mode, setMode] = useState<TimerMode>('focus');
    const [isActive, setIsActive] = useState(false);
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isMuted, setIsMuted] = useState(false);

    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const configs = {
        focus: { label: 'Focus', minutes: 25, color: 'text-zinc-900 dark:text-zinc-50', icon: <Lamp size={16} /> },
        short: { label: 'Short Break', minutes: 5, color: 'text-emerald-600 dark:text-emerald-400', icon: <Coffee size={16} /> },
        long: { label: 'Long Break', minutes: 15, color: 'text-blue-600 dark:text-blue-400', icon: <Brain size={16} /> },
    };

    useEffect(() => {
        if (isActive && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
            if (!isMuted) playAlarm();
        } else {
            if (timerRef.current) clearInterval(timerRef.current);
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isActive, timeLeft, isMuted]);

    const playAlarm = () => {
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
        audio.play();
    };

    const handleModeChange = (newMode: TimerMode) => {
        setMode(newMode);
        setIsActive(false);
        setTimeLeft(configs[newMode].minutes * 60);
    };

    const toggleTimer = () => setIsActive(!isActive);

    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(configs[mode].minutes * 60);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    const progress = (timeLeft / (configs[mode].minutes * 60)) * 100;

    return (
        <div className="max-w-4xl mx-auto p-6 flex flex-col items-center justify-center min-h-[80vh] space-y-12 animate-in fade-in duration-700">

            {/* Mode Selector (Segmented Control) */}
            <div className="flex p-1.5 bg-zinc-100 dark:bg-zinc-900 rounded-2xl w-full max-w-sm shadow-inner">
                {(Object.keys(configs) as TimerMode[]).map((m) => (
                    <button
                        key={m}
                        onClick={() => handleModeChange(m)}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-300 ${mode === m
                            ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 shadow-sm'
                            : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
                            }`}
                    >
                        {configs[m].icon}
                        <span className="hidden sm:inline">{configs[m].label}</span>
                    </button>
                ))}
            </div>

            {/* The Clock Face */}
            <div className="relative flex items-center justify-center group">
                {/* Outer Ring (Progress) */}
                <svg className="w-72 h-72 md:w-96 md:h-96 transform -rotate-90 transition-transform duration-500 group-hover:scale-105">
                    <circle
                        cx="50%" cy="50%" r="48%"
                        className="stroke-zinc-100 dark:stroke-zinc-900 fill-none"
                        strokeWidth="2"
                    />
                    <motion.circle
                        cx="50%" cy="50%" r="48%"
                        className={`fill-none transition-colors duration-500 ${mode === 'focus' ? 'stroke-zinc-900 dark:stroke-zinc-50' :
                            mode === 'short' ? 'stroke-emerald-500' : 'stroke-blue-500'
                            }`}
                        strokeWidth="3"
                        strokeDasharray="100"
                        animate={{ strokeDashoffset: progress }}
                        strokeLinecap="round"
                    />
                </svg>

                {/* Time Display */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.div
                        key={timeLeft}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`text-7xl md:text-9xl font-black font-mono tracking-tighter ${configs[mode].color}`}
                    >
                        {formatTime(timeLeft)}
                    </motion.div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-400 mt-2">
                        {isActive ? 'Deep Work' : 'Ready?'}
                    </p>
                </div>
            </div>

            {/* Interaction Controls */}
            <div className="flex items-center gap-8">
                <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-3 rounded-full text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                >
                    {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>

                <button
                    onClick={toggleTimer}
                    className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 group"
                >
                    {isActive ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
                </button>

                <button
                    onClick={resetTimer}
                    className="p-3 rounded-full text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                >
                    <RotateCcw size={20} />
                </button>
            </div>

            {/* Subtle Motivation Quote */}
            <AnimatePresence mode="wait">
                {mode === 'focus' && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-xs text-zinc-400 italic font-medium"
                    >
                        "The secret of getting ahead is getting started."
                    </motion.p>
                )}
            </AnimatePresence>
        </div>
    );
};

export default PomodoroTimer;