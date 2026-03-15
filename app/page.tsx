"use client";

import {
  ArrowRight,
  Binary,
  Braces,
  Calendar,
  CaseUpper,
  ClipboardList,
  Clock,
  Code2,
  DollarSign,
  File,
  FileText,
  Fingerprint,
  GitCompare,
  GraduationCap,
  Hash,
  Image as ImageIcon,
  List,
  Percent,
  Receipt,
  RefreshCcw,
  Ruler,
  Search,
  Server,
  ShieldCheck,
  Shuffle,
  Sparkles,
  Timer,
  TrendingUp,
  Type
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react"; // Changed to framer-motion (standard)
import { useRouter } from 'next/navigation';
import { useState } from "react";

export default function Dashboard() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  // A helper function to distribute your nice pastel colors across all the new tools automatically
  const getThemeColor = (index: number) => {
    const colors = [
      "bg-blue-50 dark:bg-blue-950/30 text-blue-600",
      "bg-purple-50 dark:bg-purple-950/30 text-purple-600",
      "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600",
      "bg-orange-50 dark:bg-orange-950/30 text-orange-600",
      "bg-pink-50 dark:bg-pink-950/30 text-pink-600",
      "bg-cyan-50 dark:bg-cyan-950/30 text-cyan-600",
      "bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600",
      "bg-yellow-50 dark:bg-yellow-950/30 text-yellow-600",
      "bg-rose-50 dark:bg-rose-950/30 text-rose-600",
    ];
    return colors[index % colors.length];
  };


  const categories = [
    {
      title: "Developer Tools",
      icon: <Code2 className="text-blue-500" size={20} />,
      tools: [
        { title: "JSON Formatter", desc: "Beautify and validate JSON", link: "/developer/json-formatter", icon: <Braces size={20} /> },
        { title: "Regex Tester", desc: "Debug regex in real-time", link: "/developer/regex-tester", icon: <Code2 size={20} /> },
        { title: "JWT Decoder", desc: "Decode and inspect tokens", link: "/developer/jwt-decoder", icon: <ShieldCheck size={20} /> },
        { title: "Hash Generator", desc: "MD5, SHA-256 secure hashes", link: "/developer/hash-generator", icon: <Fingerprint size={20} /> },
        { title: "UUID Generator", desc: "Generate unique identifiers", link: "/developer/uuid", icon: <Hash size={20} /> },
        { title: "Timestamp Converter", desc: "Epoch to human dates", link: "/developer/timestamp", icon: <Clock size={20} /> },
        { title: "Base64 Encode/Decode", desc: "Encode or decode strings", link: "/developer/base64", icon: <Binary size={20} /> },
        { title: "API Request Tester", desc: "Test REST API endpoints", link: "/developer/api-tester", icon: <Server size={20} /> }
      ]
    },
    {
      title: "Text Tools",
      icon: <Type className="text-purple-500" size={20} />,
      tools: [
        { title: "Word Counter", desc: "Text length & reading time", link: "/text/word-counter", icon: <Type size={20} /> },
        { title: "Character Counter", desc: "Count exact characters", link: "/text/character-counter", icon: <Type size={20} /> },
        { title: "Case Converter", desc: "Camel, snake & pascal case", link: "/text/case-converter", icon: <CaseUpper size={20} /> },
        { title: "Text Diff Checker", desc: "Compare two text blocks", link: "/text/diff-checker", icon: <GitCompare size={20} /> },
        { title: "Remove Duplicate Lines", desc: "Clean up messy lists", link: "/text/remove-duplicates", icon: <List size={20} /> },
        { title: "Random Text Generator", desc: "Lorem Ipsum & placeholders", link: "/text/random-text", icon: <Shuffle size={20} /> }
      ]
    },
    {
      title: "Converters",
      icon: <RefreshCcw className="text-emerald-500" size={20} />,
      tools: [
        { title: "Base Converter", desc: "Binary, Hex, Octal logic", link: "/converter/base", icon: <Binary size={20} /> },
        { title: "Unit Converter", desc: "Length, weight, and volume", link: "/converter/unit", icon: <Ruler size={20} /> },
        { title: "Timezone Converter", desc: "Global time alignment", link: "/converter/timezone", icon: <Clock size={20} /> },
        { title: "Date Difference", desc: "Days between dates", link: "/converter/date-diff", icon: <Calendar size={20} /> },
        { title: "Binary to Decimal", desc: "Quick binary math", link: "/converter/binary-decimal", icon: <Binary size={20} /> }
      ]
    },
    {
      title: "Finance",
      icon: <TrendingUp className="text-emerald-500" size={20} />,
      tools: [
        { title: "GST Calculator", desc: "Tax inclusive/exclusive", link: "/finance/gst", icon: <Receipt size={20} /> },
        { title: "EMI Calculator", desc: "Loan & mortgage planning", link: "/finance/emi", icon: <Percent size={20} /> },
        { title: "SIP Calculator", desc: "Wealth compounding projections", link: "/finance/sip", icon: <TrendingUp size={20} /> },
        { title: "ROI Calculator", desc: "Return on investment math", link: "/finance/roi", icon: <TrendingUp size={20} /> },
        { title: "Compound Interest", desc: "Calculate compounding growth", link: "/finance/compound-interest", icon: <TrendingUp size={20} /> },
        { title: "Inflation Calculator", desc: "Money value over time", link: "/finance/inflation", icon: <TrendingUp size={20} /> }
      ]
    },
    {
      title: "Student",
      icon: <GraduationCap className="text-indigo-500" size={20} />,
      tools: [
        { title: "GPA Calculator", desc: "Grade point average math", link: "/student/gpa", icon: <GraduationCap size={20} /> },
        { title: "Percentage Calculator", desc: "Quick marks to percentage", link: "/student/percentage", icon: <Percent size={20} /> },
        { title: "Attendance Calculator", desc: "Track required classes", link: "/student/attendance", icon: <ClipboardList size={20} /> },
        { title: "Study Timer", desc: "Pomodoro focus blocks", link: "/student/pomodoro", icon: <Timer size={20} /> }
      ]
    },
    {
      title: "File Tools",
      icon: <File className="text-orange-500" size={20} />,
      tools: [
        { title: "Image Compressor", desc: "Reduce file sizes", link: "/file/image-compressor", icon: <ImageIcon size={20} /> },
        { title: "Image Resizer", desc: "Change dimensions instantly", link: "/file/image-resizer", icon: <ImageIcon size={20} /> },
        { title: "PDF Merger", desc: "Combine multiple PDFs", link: "/file/pdf-merge", icon: <FileText size={20} /> },
        { title: "PDF Splitter", desc: "Extract specific pages", link: "/file/pdf-split", icon: <FileText size={20} /> }
      ]
    },
    {
      title: "Productivity",
      icon: <Timer className="text-rose-500" size={20} />,
      tools: [
        { title: "Pomodoro Timer", desc: "25-minute focus intervals", link: "/productivity/pomodoro", icon: <Timer size={20} /> },
        { title: "Random Name Picker", desc: "Draw names from a hat", link: "/productivity/random-name", icon: <Shuffle size={20} /> },
        { title: "Meeting Cost Calculator", desc: "Calculate time is money", link: "/productivity/meeting-cost", icon: <DollarSign size={20} /> }
      ]
    }
  ];

  // Search Filter Logic
  const filteredCategories = categories.map(category => {
    const filteredTools = category.tools.filter(tool =>
      tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.desc.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return { ...category, tools: filteredTools };
  }).filter(category => category.tools.length > 0); // Hide empty categories

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.03 } }
  };

  const item = {
    hidden: { y: 15, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-12 space-y-16">

      {/* Hero Section & Search Bar */}
      <section className="text-center space-y-6 max-w-3xl mx-auto">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs font-bold uppercase tracking-widest"
        >
          <Sparkles size={14} /> All-in-one Toolkit
        </motion.div>

        <h1 className="text-5xl md:text-6xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
          Simplify your <span className="text-transparent bg-clip-text bg-linear-to-r from-zinc-500 to-zinc-800 dark:from-zinc-200 dark:to-zinc-500">workflow.</span>
        </h1>

        <p className="text-lg text-zinc-500 dark:text-zinc-400">
          Professional grade utilities for developers, students, and business owners.
          Fast, private, and runs entirely in your browser.
        </p>

        {/* Search Bar */}
        <div className="relative max-w-xl mx-auto mt-8 group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-zinc-400 group-focus-within:text-zinc-900 dark:group-focus-within:text-zinc-100 transition-colors" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tools (e.g. 'JSON Formatter', 'PDF')..."
            className="block w-full pl-12 pr-4 py-4 bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 rounded-2xl text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 focus:ring-4 focus:ring-zinc-100 dark:focus:ring-zinc-800/50 transition-all text-lg shadow-sm"
          />
        </div>
      </section>

      {/* Categories & Tools Mapping */}
      <div className="space-y-16">
        <AnimatePresence>
          {filteredCategories.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 text-zinc-500"
            >
              <Search size={48} className="mx-auto mb-4 opacity-20" />
              <p className="text-xl font-medium">No tools found matching "{searchQuery}"</p>
              <button
                onClick={() => setSearchQuery("")}
                className="mt-4 text-sm font-bold text-zinc-900 dark:text-zinc-100 underline underline-offset-4"
              >
                Clear Search
              </button>
            </motion.div>
          ) : (
            filteredCategories.map((category, catIdx) => (
              <motion.div
                key={category.title}
                className="space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                {/* Category Header */}
                <div className="flex items-center gap-3 px-2">
                  <div className="p-2 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
                    {category.icon}
                  </div>
                  <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-200">{category.title}</h2>
                  <div className="h-px flex-1 bg-zinc-100 dark:bg-zinc-800 ml-4" />
                </div>

                {/* Grid of Tools */}
                <motion.div
                  variants={container}
                  initial="hidden"
                  animate="show"
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                >
                  {category.tools.map((tool, index) => {
                    const dynamicColorClass = getThemeColor(index);

                    return (
                      <motion.button
                        key={tool.title}
                        variants={item}
                        onClick={() => router.push(tool.link)}
                        className="group relative flex flex-col cursor-pointer p-5 rounded-2xl border border-zinc-200 bg-white text-left transition-all hover:border-zinc-300 hover:shadow-xl hover:shadow-zinc-200/50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700 dark:hover:shadow-none"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className={`p-3 rounded-xl transition-transform group-hover:scale-110 duration-300 ${dynamicColorClass}`}>
                            {tool.icon}
                          </div>
                          <ArrowRight
                            size={18}
                            className="text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-all duration-300 ease-in-out -rotate-45 group-hover:rotate-0"
                          />
                        </div>

                        <div className="space-y-1">
                          <h3 className="font-bold text-zinc-900 dark:text-zinc-50 underline-offset-4 group-hover:underline">
                            {tool.title}
                          </h3>
                          <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400 line-clamp-2">
                            {tool.desc}
                          </p>
                        </div>
                      </motion.button>
                    )
                  })}
                </motion.div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Minimal Footer */}
      <footer className="pt-20 text-center">
        <p className="text-xs font-medium text-zinc-400 uppercase tracking-[0.3em]">
          DevTools Kit &bull; {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}