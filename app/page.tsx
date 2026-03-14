"use client";

import {
  ArrowRight,
  Binary, Braces,
  Briefcase,
  Calculator,
  CaseUpper,
  Clock,
  Code2,
  Coins,
  Fingerprint,
  GraduationCap,
  Percent,
  SearchCode,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Type
} from "lucide-react";
import { motion } from "motion/react";
import { useTheme } from "next-themes";
import { useRouter } from 'next/navigation';

const Dashboard = () => {
  const router = useRouter();
  const { themes, theme } = useTheme()
  const categories = [
    {
      title: "Developer Utilities",
      icon: <Code2 className="text-blue-500" size={20} />,
      tools: [
        { title: "Word Counter", desc: "Text length & reading time", link: "/developer/word-counter", icon: <Type size={20} />, color: "bg-blue-50 dark:bg-blue-950/30 text-blue-600" },
        { title: "Case Converter", desc: "Camel, snake & pascal case", link: "/developer/case-converter", icon: <CaseUpper size={20} />, color: "bg-purple-50 dark:bg-purple-950/30 text-purple-600" },
        { title: "Base Converter", desc: "Binary, Hex, Octal logic", link: "/developer/base-converter", icon: <Binary size={20} />, color: "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600" },
        { title: "JSON Formatter", desc: "Beautify and validate JSON", link: "/developer/json-formatter", icon: <Braces size={20} />, color: "bg-orange-50 dark:bg-orange-950/30 text-orange-600" },
        { title: "Hash Generator", desc: "MD5, SHA-256 secure hashes", link: "/developer/hash-generator", icon: <Fingerprint size={20} />, color: "bg-pink-50 dark:bg-pink-950/30 text-pink-600" },
        { title: "JWT Decoder", desc: "Decode and inspect tokens", link: "/developer/jwt-decoder", icon: <ShieldCheck size={20} />, color: "bg-cyan-50 dark:bg-cyan-950/30 text-cyan-600" },
        { title: "Timestamp", desc: "Epoch to human dates", link: "/developer/timestamp-converter", icon: <Clock size={20} />, color: "bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600" },
        { title: "Regex Tester", desc: "Debug regex in real-time", link: "/developer/regex-tester", icon: <SearchCode size={20} />, color: "bg-yellow-50 dark:bg-yellow-950/30 text-yellow-600" },
      ]
    },
    {
      title: "Business & Finance",
      icon: <Briefcase className="text-emerald-500" size={20} />,
      tools: [
        { title: "GST Calculator", desc: "Tax inclusive/exclusive", link: "/business/gst", icon: <Calculator size={20} />, color: "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600" },
        { title: "EMI Calculator", desc: "Loan & mortgage planning", link: "/business/emi-calc", icon: <Percent size={20} />, color: "bg-blue-50 dark:bg-blue-950/30 text-blue-600" },
        { title: "ROI Calculator", desc: "Return on investment math", link: "/business/roi-calc", icon: <TrendingUp size={20} />, color: "bg-rose-50 dark:bg-rose-950/30 text-rose-600" },
        { title: "SIP Calculator", desc: "Wealth compounding projections", link: "/business/sip-calc", icon: <Coins size={20} />, color: "bg-amber-50 dark:bg-amber-950/30 text-amber-600" },
      ]
    },
    {
      title: "Academic Tools",
      icon: <GraduationCap className="text-indigo-500" size={20} />,
      tools: [
        { title: "GPA Calculator", desc: "Grade point average math", link: "/gpa", icon: <GraduationCap size={20} />, color: "bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600" },
      ]
    }
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-12 space-y-16">

      {/* Hero Section */}
      <section className="text-center space-y-4 max-w-3xl mx-auto">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs font-bold uppercase tracking-widest mb-4"
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
      </section>

      {/* Categories Mapping */}
      {categories.map((category, catIdx) => (
        <div key={category.title} className="space-y-6">
          <div className="flex items-center gap-3 px-2">
            <div className="p-2 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
              {category.icon}
            </div>
            <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-200">{category.title}</h2>
            <div className="h-px flex-1 bg-zinc-100 dark:bg-zinc-800 ml-4" />
          </div>

          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1  sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            {category.tools.map((tool) => (
              <motion.button
                key={tool.title}
                variants={item}
                onClick={() => router.push(tool.link)}
                className="group relative flex flex-col cursor-pointer p-5 rounded-2xl border border-zinc-200 bg-white text-left transition-all hover:border-zinc-300 hover:shadow-xl hover:shadow-zinc-200/50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700 dark:hover:shadow-none"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl transition-transform group-hover:scale-110 duration-300 ${tool.color}`}>
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
            ))}
          </motion.div>
        </div>
      ))}

      {/* Minimal Footer */}
      <footer className="pt-20 text-center">
        <p className="text-xs font-medium text-zinc-400 uppercase tracking-[0.3em]">
          DevTools Kit &bull; {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
};

export default Dashboard;