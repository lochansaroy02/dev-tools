"use client";

import {
    Accordion,
    AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { AnimatePresence, motion } from "motion/react";
import { useTheme } from "next-themes";
import { usePathname, useRouter } from "next/navigation";

import {
    Binary, Braces, Briefcase, CaseUpper, Clock, Code2, Fingerprint, GraduationCap, Menu, Moon, Percent, SearchCode, Settings2, ShieldCheck, Sun, Timer, TrendingUp, Type, X
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

const Sidebar = () => {
    const router = useRouter();
    const pathname = usePathname();
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    // 1. Logic to find which category should be open based on current URL
    const activeCategory = useRef<string>("");

    const categories = [
        {
            id: "dev-tools",
            title: "Dev Tools",
            icon: <Code2 size={18} />,
            tools: [
                { title: "Word Counter", link: "/developer/word-counter", icon: <Type size={18} /> },
                { title: "Case Converter", link: "/developer/case-converter", icon: <CaseUpper size={18} /> },
                { title: "Base Converter", link: "/developer/base-converter", icon: <Binary size={18} /> },
                { title: "JSON Formatter", link: "/developer/json-formatter", icon: <Braces size={18} /> },
                { title: "Hash Generator", link: "/developer/hash-generator", icon: <Fingerprint size={18} /> },
                { title: "JWT Decoder", link: "/developer/jwt-decoder", icon: <ShieldCheck size={18} /> },
                { title: "Timestamp", link: "/developer/timestamp-converter", icon: <Clock size={18} /> },
                { title: "Shape", link: "/developer/shape", icon: <Clock size={18} /> },
            ]
        },
        {
            id: "business",
            title: "Business",
            icon: <Briefcase size={18} />,
            tools: [
                { title: "GST Calculator", link: "/business/gst", icon: <Briefcase size={18} /> },
                { title: "EMI Calculator", link: "/business/emi-calc", icon: <Percent size={18} /> },
                { title: "ROI Calculator", link: "/business/roi-calc", icon: <TrendingUp size={18} /> },
                { title: "SIP Calculator", link: "/business/sip-calc", icon: <TrendingUp size={18} /> },
            ]
        },
        {
            id: "student",
            title: "Student",
            icon: <GraduationCap size={18} />,
            tools: [
                { title: "GPA Calc", link: "/student/gpa", icon: <GraduationCap size={18} /> },
                { title: "Study Timer", link: "/student/pomodoro", icon: <Timer size={18} /> },

            ]
        }
    ];

    // Find active category ID
    categories.forEach(cat => {
        if (cat.tools.some(tool => tool.link === pathname)) {
            activeCategory.current = cat.id;
        }
    });

    const [openItems, setOpenItems] = useState<string[]>([activeCategory.current || "dev-tools"]);

    // 2. Refs for auto-scrolling
    const activeItemRef = useRef<HTMLButtonElement | null>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    // 3. Scroll to active item whenever pathname changes
    useEffect(() => {
        if (activeItemRef.current) {
            activeItemRef.current.scrollIntoView({
                behavior: "smooth",
                block: "nearest",
            });
        }
        // Ensure the accordion for the active link is open
        if (activeCategory.current && !openItems.includes(activeCategory.current)) {
            setOpenItems(prev => [...prev, activeCategory.current]);
        }
    }, [pathname]);

    const NavContent = () => (
        <div className="flex h-full flex-col bg-white dark:bg-zinc-950">
            <div className="flex h-14 items-center justify-between border-b px-6 font-semibold tracking-tight">
                <span className="text-zinc-900 dark:text-zinc-100">DevTools Kit</span>
                <button className="md:hidden" onClick={() => setIsOpen(false)}><X size={20} /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                <button
                    onClick={() => { router.push("/"); setIsOpen(false); }}
                    className={`flex w-full items-center gap-3 rounded-md px-3 py-2 mb-4 text-sm font-medium transition-all ${pathname === "/"
                        ? "bg-zinc-100 text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-zinc-50"
                        : "text-zinc-600 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-900"
                        }`}
                >
                    <SearchCode size={18} className={pathname === "/" ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-500"} />
                    Dashboard
                </button>

                <Accordion
                    type="multiple"
                    value={openItems}
                    onValueChange={setOpenItems}
                    className="w-full space-y-2"
                >
                    {categories.map((cat) => (
                        <AccordionItem key={cat.id} value={cat.id} className="border-none">
                            <AccordionTrigger className="flex items-center gap-3 px-3 py-2 text-sm font-semibold text-zinc-500 hover:text-zinc-900 hover:no-underline dark:text-zinc-400 dark:hover:text-zinc-50 transition-colors">
                                <div className="flex items-center gap-3">
                                    {cat.icon}
                                    <span>{cat.title}</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="pt-1 pb-2 space-y-1">
                                {cat.tools.map((link) => {
                                    const isActive = pathname === link.link;
                                    return (
                                        <button
                                            key={link.title}
                                            ref={isActive ? activeItemRef : null}
                                            onClick={() => { router.push(link.link); setIsOpen(false); }}
                                            className={`flex w-full items-center gap-3 rounded-md px-9 py-2 text-sm font-medium transition-all ${isActive
                                                ? "text-zinc-900 dark:text-zinc-50 bg-zinc-100 dark:bg-zinc-800 shadow-sm font-bold"
                                                : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
                                                }`}
                                        >
                                            {link.title}
                                        </button>
                                    );
                                })}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>

            <div className="border-t p-4 flex items-center justify-between gap-2">
                <button className="flex flex-1 items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800">
                    <Settings2 size={18} /> Settings
                </button>
                <button
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="flex h-9 w-9 items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-600 shadow-sm hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-800"
                >
                    {mounted && (theme === "dark" ? <Sun size={18} /> : <Moon size={18} />)}
                </button>
            </div>
        </div>
    );

    return (
        <>
            <aside className="fixed left-0 top-0 hidden h-screen w-64 border-r md:block">
                <NavContent />
            </aside>

            {/* Mobile Header, Overlay, and Motion logic remain the same */}
            <header className="fixed top-0 z-40 flex h-14 w-full items-center justify-between border-b bg-white/80 px-4 backdrop-blur-md dark:bg-zinc-950/80 md:hidden">
                <span className="font-bold">DevTools Kit</span>
                <button onClick={() => setIsOpen(true)} className="p-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800">
                    <Menu size={20} />
                </button>
            </header>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsOpen(false)} className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm md:hidden" />
                        <motion.aside initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="fixed left-0 top-0 z-50 h-screen w-72 border-r shadow-2xl md:hidden">
                            <NavContent />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default Sidebar;