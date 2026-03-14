"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
    ArrowRightLeft,
    BookOpen,
    Calculator,
    GraduationCap,
    Info,
    Plus,
    Settings2,
    Trash2
} from "lucide-react";
import { useState } from "react";

type Scale = 4 | 10;
type Course = { id: string; name: string; credits: number; grade: number };

export default function AcademicCalculator() {
    const [activeTab, setActiveTab] = useState<"converter" | "calculator">("converter");
    const [scale, setScale] = useState<Scale>(10);

    // Converter State
    const [convertDirection, setConvertDirection] = useState<"percToGpa" | "gpaToPerc">("percToGpa");
    const [inputValue, setInputValue] = useState<string>("");

    // Semester Calculator State
    const [courses, setCourses] = useState<Course[]>([
        { id: "1", name: "Mathematics", credits: 4, grade: scale === 10 ? 9 : 4 },
        { id: "2", name: "Physics", credits: 3, grade: scale === 10 ? 8 : 3 },
    ]);

    // --- CONVERSION LOGIC ---
    // Note: These are standard linear approximations. 
    // 10.0 Scale often uses the CBSE multiplier (9.5). 4.0 Scale is mapped linearly to 100%.
    const getConvertedValue = () => {
        const val = parseFloat(inputValue);
        if (isNaN(val)) return "0.00";

        if (convertDirection === "percToGpa") {
            if (scale === 10) return Math.min((val / 9.5), 10).toFixed(2);
            if (scale === 4) return Math.min((val / 25), 4).toFixed(2);
        } else {
            if (scale === 10) return Math.min((val * 9.5), 100).toFixed(2);
            if (scale === 4) return Math.min((val * 25), 100).toFixed(2);
        }
        return "0.00";
    };

    // --- SEMESTER CALCULATOR LOGIC ---
    const addCourse = () => {
        setCourses([...courses, { id: Math.random().toString(), name: `Course ${courses.length + 1}`, credits: 3, grade: scale === 10 ? 8 : 3 }]);
    };

    const removeCourse = (id: string) => {
        setCourses(courses.filter((c) => c.id !== id));
    };

    const updateCourse = (id: string, field: keyof Course, value: string | number) => {
        setCourses(courses.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
    };

    const calculateSGPA = () => {
        const totalCredits = courses.reduce((sum, c) => sum + Number(c.credits), 0);
        const totalPoints = courses.reduce((sum, c) => sum + Number(c.credits) * Number(c.grade), 0);
        return totalCredits === 0 ? "0.00" : (totalPoints / totalCredits).toFixed(2);
    };

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-6">
                <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                        <GraduationCap size={28} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">Academic Hub</h1>
                        <p className="text-sm text-zinc-500">GPA conversion and semester planning tools.</p>
                    </div>
                </div>

                {/* Global Scale Toggle */}
                <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-900 p-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800">
                    <Settings2 size={16} className="text-zinc-400 ml-2" />
                    <div className="flex gap-1">
                        <button
                            onClick={() => setScale(4)}
                            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${scale === 4 ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm" : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"}`}
                        >
                            4.0 Scale
                        </button>
                        <button
                            onClick={() => setScale(10)}
                            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${scale === 10 ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm" : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"}`}
                        >
                            10.0 Scale
                        </button>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-2">
                <button
                    onClick={() => setActiveTab("converter")}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${activeTab === "converter" ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-md" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800"}`}
                >
                    <ArrowRightLeft size={18} /> Quick Converter
                </button>
                <button
                    onClick={() => setActiveTab("calculator")}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${activeTab === "calculator" ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-md" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800"}`}
                >
                    <Calculator size={18} /> SGPA Calculator
                </button>
            </div>

            {/* Main Content Area */}
            <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-10 shadow-sm overflow-hidden relative">
                <AnimatePresence mode="wait">

                    {/* TAB 1: QUICK CONVERTER */}
                    {activeTab === "converter" && (
                        <motion.div
                            key="converter"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-8 max-w-xl mx-auto"
                        >
                            <div className="flex justify-center mb-8">
                                <div className="bg-zinc-100 dark:bg-zinc-900 p-1.5 rounded-2xl inline-flex gap-1">
                                    <button onClick={() => setConvertDirection("percToGpa")} className={`px-4 py-2 text-sm font-bold rounded-xl transition-all ${convertDirection === "percToGpa" ? "bg-white dark:bg-zinc-800 shadow-sm text-zinc-900 dark:text-white" : "text-zinc-500"}`}>% to GPA</button>
                                    <button onClick={() => setConvertDirection("gpaToPerc")} className={`px-4 py-2 text-sm font-bold rounded-xl transition-all ${convertDirection === "gpaToPerc" ? "bg-white dark:bg-zinc-800 shadow-sm text-zinc-900 dark:text-white" : "text-zinc-500"}`}>GPA to %</button>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row items-center gap-6">
                                <div className="flex-1 w-full relative">
                                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 block">
                                        Enter {convertDirection === "percToGpa" ? "Percentage" : "GPA"}
                                    </label>
                                    <input
                                        type="number"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        placeholder={convertDirection === "percToGpa" ? "e.g., 85" : `e.g., ${scale === 10 ? '8.5' : '3.5'}`}
                                        className="w-full text-4xl font-black bg-transparent border-b-2 border-zinc-200 dark:border-zinc-800 focus:border-indigo-500 outline-none py-2 transition-colors placeholder:text-zinc-300 dark:placeholder:text-zinc-700"
                                    />
                                    <span className="absolute right-0 bottom-4 text-xl font-bold text-zinc-400">
                                        {convertDirection === "percToGpa" ? "%" : "GPA"}
                                    </span>
                                </div>

                                <div className="text-zinc-300 dark:text-zinc-700 hidden sm:block">
                                    <ArrowRightLeft size={32} />
                                </div>

                                <div className="flex-1 w-full relative bg-zinc-50 dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800 text-center">
                                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 block">
                                        Calculated {convertDirection === "percToGpa" ? "GPA" : "Percentage"}
                                    </label>
                                    <div className="text-5xl font-black text-indigo-600 dark:text-indigo-400">
                                        {getConvertedValue()}
                                    </div>
                                    <span className="text-sm font-bold text-zinc-400 mt-1 block">
                                        {convertDirection === "percToGpa" ? `out of ${scale}.0` : "%"}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-blue-800 dark:text-blue-300 text-sm">
                                <Info size={20} className="shrink-0 mt-0.5" />
                                <p>
                                    <strong>Formula used:</strong>{" "}
                                    {scale === 10
                                        ? "Percentage = GPA × 9.5 (Standard AICTE/CBSE approximation)"
                                        : "Percentage = GPA × 25 (Standard linear approximation)"}. Note that exact conversion formulas can vary by university!
                                </p>
                            </div>
                        </motion.div>
                    )}

                    {/* TAB 2: SGPA CALCULATOR */}
                    {activeTab === "calculator" && (
                        <motion.div
                            key="calculator"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-6"
                        >
                            <div className="flex justify-between items-end mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                                        <BookOpen size={20} className="text-indigo-500" />
                                        Semester Courses
                                    </h3>
                                    <p className="text-sm text-zinc-500">Add your courses and credits to calculate your weighted SGPA.</p>
                                </div>
                                <div className="text-right bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-2xl border border-indigo-100 dark:border-indigo-900">
                                    <p className="text-xs font-bold text-indigo-500 uppercase tracking-wider">Estimated SGPA</p>
                                    <p className="text-4xl font-black text-indigo-700 dark:text-indigo-400">{calculateSGPA()}</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {/* Headers */}
                                <div className="grid grid-cols-12 gap-4 px-4 text-xs font-bold text-zinc-400 uppercase tracking-wider">
                                    <div className="col-span-5 sm:col-span-6">Course Name</div>
                                    <div className="col-span-3 sm:col-span-2 text-center">Credits</div>
                                    <div className="col-span-3 sm:col-span-3 text-center">Grade (out of {scale})</div>
                                    <div className="col-span-1"></div>
                                </div>

                                {/* Course List */}
                                <AnimatePresence>
                                    {courses.map((course) => (
                                        <motion.div
                                            key={course.id}
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            className="grid grid-cols-12 gap-2 sm:gap-4 items-center bg-zinc-50 dark:bg-zinc-900 p-2 pl-4 rounded-xl border border-zinc-100 dark:border-zinc-800"
                                        >
                                            <div className="col-span-5 sm:col-span-6">
                                                <input
                                                    type="text"
                                                    value={course.name}
                                                    onChange={(e) => updateCourse(course.id, "name", e.target.value)}
                                                    className="w-full bg-transparent border-none focus:ring-0 text-sm font-semibold outline-none text-zinc-900 dark:text-zinc-100"
                                                    placeholder="e.g. Data Structures"
                                                />
                                            </div>
                                            <div className="col-span-3 sm:col-span-2">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={course.credits || ""}
                                                    onChange={(e) => updateCourse(course.id, "credits", Number(e.target.value))}
                                                    className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2 text-center text-sm font-bold outline-none focus:border-indigo-500"
                                                />
                                            </div>
                                            <div className="col-span-3 sm:col-span-3">
                                                <input
                                                    type="number"
                                                    step="0.1"
                                                    min="0"
                                                    max={scale}
                                                    value={course.grade || ""}
                                                    onChange={(e) => updateCourse(course.id, "grade", Number(e.target.value))}
                                                    className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2 text-center text-sm font-bold outline-none focus:border-indigo-500"
                                                />
                                            </div>
                                            <div className="col-span-1 flex justify-center">
                                                <button
                                                    onClick={() => removeCourse(course.id)}
                                                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>

                            <button
                                onClick={addCourse}
                                className="w-full py-4 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-500 font-bold text-sm flex items-center justify-center gap-2 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                            >
                                <Plus size={18} /> Add Another Course
                            </button>

                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}