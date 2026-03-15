"use client";

import { ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center space-y-8 animate-in fade-in duration-1000">

            <div className="space-y-4 max-w-md">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <h1 className="text-6xl font-black tracking-tighter text-zinc-900 dark:text-zinc-50">404</h1>
                    <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-200 mt-2">Future Tool Detected</h2>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-zinc-500 dark:text-zinc-400 leading-relaxed"
                >
                    You've stumbled upon a tool that is currently being calibrated in our lab.
                    It will be available for your workflow very soon!
                </motion.p>
            </div>

            {/* Action Button */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-2xl font-bold hover:scale-105 active:scale-95 transition-all shadow-xl shadow-zinc-200 dark:shadow-none"
                >
                    <ArrowLeft size={18} />
                    Return to Dashboard
                </Link>
            </motion.div>



        </div>
    );
}