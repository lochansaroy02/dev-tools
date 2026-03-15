"use client";

import { AnimatePresence, motion } from "framer-motion"; // Note: Updated to framer-motion based on standard usage, adjust if your alias is motion/react
import {
    ChevronLeft, ChevronRight,
    Copy,
    Hexagon,
    Layers,
    Maximize,
    RotateCw,
    Ruler,
    Shapes
} from "lucide-react";
import { useMemo, useRef, useState } from 'react';

// Point and Vector math logic
class Point { constructor(public x: number, public y: number) { } }
class Vector {
    constructor(public x: number, public y: number) { }
    static fromPoints(p1: Point, p2: Point) { return new Vector(p2.x - p1.x, p2.y - p1.y); }
    get length() { return Math.sqrt(this.x * this.x + this.y * this.y); }
    normalize() { const l = this.length; return new Vector(this.x / l, this.y / l); }
    add(v: Vector) { return new Vector(this.x + v.x, this.y + v.y); }
    multiply(s: number) { return new Vector(this.x * s, this.y * s); }
    negate() { return new Vector(-this.x, -this.y); }
}

// 1. Define central library. Added Cookie and Burst types.
const shapeLibrary = [
    { name: "Cookie / Clover", type: 'cookie' },
    { name: "Starburst", type: 'burst' },
    { name: "Polygon (Advanced)", type: 'polygon' },
    { name: "Circle", type: 'static', path: "M 150,50 A 100,100 0 1,0 150,250 A 100,100 0 1,0 150,50 Z" },
    { name: "Square", type: 'rect' },
    { name: "Semicircle", type: 'static', path: "M 50,150 A 100,100 0 1,1 250,150 L 50,150 Z" },
    { name: "Slanted", type: 'static', path: "M 50,50 L 200,50 L 250,250 L 100,250 Z" },
    { name: "Arch", type: 'static', path: "M 50,250 L 50,150 A 100,100 0 0,1 250,150 L 250,250 Z" },
    { name: "Pill", type: 'static', path: "M 100,50 L 200,50 A 100,100 0 0,1 200,250 L 100,250 A 100,100 0 0,1 100,50 Z" },
    { name: "Arrow", type: 'static', path: "M 50,150 L 150,50 L 250,150 A 100,100 0 0,1 150,250 A 100,100 0 0,1 50,150 Z" },
    { name: "Fan", type: 'static', path: "M 150,150 L 250,150 A 100,100 0 0,0 150,50 L 150,150 Z" },
    { name: "Flower", type: 'static', path: "M 150,150 m -100,0 a 100,100 0 1,0 200,0 a 100,100 0 1,0 -200,0 M 150,150 m -30,-30 a 30,30 0 1,0 60,0 a 30,30 0 1,0 -60,0 Z" },
    { name: "Boom", type: 'static', path: "M 150,150 m -100,0 L 100,100 L 150,50 L 200,100 L 250,150 L 200,200 L 150,250 L 100,200 Z" },
    { name: "Heart", type: 'static', path: "M 150,250 C 100,200 50,150 50,100 A 50,50 0 0,1 150,100 A 50,50 0 0,1 250,100 C 250,150 200,200 150,250 Z" },
];

export default function MaterialShapeEditor() {
    const [selectedShape, setSelectedShape] = useState<typeof shapeLibrary[0]>(shapeLibrary[0]);

    // Customization Parameters
    const [sides, setSides] = useState(8);
    const [radiusPercentage, setRadiusPercentage] = useState(60); // Used for Polygon smoothing
    const [depth, setDepth] = useState(25); // NEW: Used for Cookie/Burst cutout depth
    const [rotation, setRotation] = useState(0);
    const [size, setSize] = useState(240);
    const [activeColor, setActiveColor] = useState("#D3E2FF");

    const m3Palette = [
        { name: "Primary", color: "#D3E2FF" },
        { name: "Secondary", color: "#DDE2F9" },
        { name: "Tertiary", color: "#FAD8FD" },
        { name: "Error", color: "#FFDAD6" },
        { name: "Surface", color: "#FDFBFF" },
    ];

    // Logic for Filleted Polygons
    const polygonPath = useMemo(() => {
        if (selectedShape.type !== 'polygon') return '';

        const center = 150;
        const r = size / 2;
        const vertices: Point[] = [];

        for (let i = 0; i < sides; i++) {
            const angle = (i * 2 * Math.PI) / sides - Math.PI / 2;
            vertices.push(new Point(center + r * Math.cos(angle), center + r * Math.sin(angle)));
        }

        const pathCommands = [];
        for (let i = 0; i < sides; i++) {
            const vPrev = vertices[(i - 1 + sides) % sides];
            const v = vertices[i];
            const vNext = vertices[(i + 1) % sides];

            const ePrev = Vector.fromPoints(vPrev, v).normalize();
            const eNext = Vector.fromPoints(v, vNext).normalize();

            const angleBetweenEdges = Math.acos(ePrev.multiply(-1).x * eNext.x + ePrev.multiply(-1).y * eNext.y);
            const smoothingFactor = radiusPercentage / 100;
            const filletR = r * Math.tan(angleBetweenEdges / 2) * smoothingFactor;

            const t1Offset = ePrev.multiply(-1).normalize().multiply(filletR);
            const t2Offset = eNext.normalize().multiply(filletR);

            const t1 = new Point(v.x + t1Offset.x, v.y + t1Offset.y);
            const t2 = new Point(v.x + t2Offset.x, v.y + t2Offset.y);

            if (i === 0) pathCommands.push(`M ${t1.x},${t1.y}`);
            pathCommands.push(`L ${t1.x},${t1.y}`);
            pathCommands.push(`Q ${v.x},${v.y} ${t2.x},${t2.y}`);
        }

        pathCommands.push('Z');
        return pathCommands.join(" ");
    }, [selectedShape, sides, radiusPercentage, size]);

    // NEW: Logic for Dynamic Cookies and Bursts using Trigonometry
    const dynamicShapePath = useMemo(() => {
        if (selectedShape.type !== 'cookie' && selectedShape.type !== 'burst') return '';

        const cx = 150;
        const cy = 150;
        const maxRadius = size / 2;
        const minRadius = maxRadius - depth;

        let pathData = "";

        if (selectedShape.type === 'cookie') {
            // Smooth Sine Wave (Cookies, Clovers)
            const steps = 120;
            for (let i = 0; i <= steps; i++) {
                const angle = (i / steps) * Math.PI * 2;
                const offsetAngle = angle - Math.PI / 2;
                const r = minRadius + (depth / 2) + (depth / 2) * Math.cos(sides * angle);
                const x = cx + r * Math.cos(offsetAngle);
                const y = cy + r * Math.sin(offsetAngle);

                if (i === 0) pathData += `M ${x},${y} `;
                else pathData += `L ${x},${y} `;
            }
            pathData += "Z";
        } else {
            // Sharp Alternating Wave (Starbursts)
            const steps = sides * 2;
            for (let i = 0; i < steps; i++) {
                const angle = (i / steps) * Math.PI * 2;
                const offsetAngle = angle - Math.PI / 2;
                const r = i % 2 === 0 ? maxRadius : minRadius;
                const x = cx + r * Math.cos(offsetAngle);
                const y = cy + r * Math.sin(offsetAngle);

                if (i === 0) pathData += `M ${x},${y} `;
                else pathData += `L ${x},${y} `;
            }
            pathData += "Z";
        }

        return pathData;
    }, [selectedShape, sides, depth, size]);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    // Determine which path to render
    let currentPath = selectedShape.path || '';
    if (selectedShape.type === 'polygon') currentPath = polygonPath;
    if (selectedShape.type === 'cookie' || selectedShape.type === 'burst') currentPath = dynamicShapePath;

    const isParametric = ['polygon', 'cookie', 'burst'].includes(selectedShape.type);
    const isDepthBased = ['cookie', 'burst'].includes(selectedShape.type);
    const isRect = selectedShape.type === 'rect';

    const scrollRef = useRef<HTMLDivElement>(null);
    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
            scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
        }
    };

    return (
        <div className="mx-auto w-full max-w-5xl p-6 space-y-12 animate-in fade-in overflow-x-hidden duration-700">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50">
                        <Shapes size={24} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black tracking-tighter text-zinc-900 dark:text-zinc-50">Shape Editor</h1>
                        <p className="text-sm text-zinc-500">Create Material You 3 organic shapes and containers.</p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-1.5 p-1 bg-zinc-100 dark:bg-zinc-900 rounded-lg">
                    {m3Palette.map((p) => (
                        <button
                            key={p.name}
                            onClick={() => setActiveColor(p.color)}
                            className={`w-8 h-8 rounded-full transition-all hover:scale-110 ${activeColor === p.color ? 'ring-2 ring-zinc-900 dark:ring-zinc-50 scale-105 shadow-md' : 'opacity-80'}`}
                            style={{ backgroundColor: p.color }}
                            title={p.name}
                        />
                    ))}
                </div>
            </div>

            {/* Grid-Based Shape Picker */}
            <div className="relative group">
                <div ref={scrollRef} className="flex gap-3 overflow-x-auto scroll-smooth no-scrollbar z-0 pb-3 px-1">
                    {shapeLibrary.map((shape) => (
                        <button
                            key={shape.name}
                            onClick={() => setSelectedShape(shape)}
                            className={`flex-none w-30 p-4 rounded-xl text-center border transition-all ${selectedShape.name === shape.name ? 'border-zinc-300 bg-white dark:border-zinc-700 dark:bg-zinc-950 shadow-md' : 'border-zinc-100 bg-zinc-50 dark:border-zinc-900 dark:bg-zinc-900/50 hover:bg-zinc-100 dark:hover:bg-zinc-900'}`}
                        >
                            <svg width="60" height="60" viewBox="0 0 300 300" className="mx-auto mb-3">
                                <path
                                    d={
                                        shape.type === 'polygon' ? polygonPath
                                            : shape.type === 'cookie' || shape.type === 'burst' ? dynamicShapePath
                                                : shape.path || "M 50,50 L 250,50 L 250,250 L 50,250 Z"
                                    }
                                    fill={activeColor}
                                    className="opacity-80"
                                />
                            </svg>
                            <p className="text-[11px] font-bold text-zinc-900 dark:text-zinc-50 truncate">{shape.name}</p>
                            <p className="text-[9px] text-zinc-400 capitalize">{shape.type} Shape</p>
                        </button>
                    ))}
                </div>
                <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-linear-to-r from-zinc-50 dark:from-zinc-950 to-transparent" />
                <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-linear-to-l from-zinc-50 dark:from-zinc-950 to-transparent" />
                <button onClick={() => scroll('left')} className="absolute left-1 top-1/2 -translate-y-1/2 p-1.5 rounded-full border border-zinc-200 bg-white shadow-md dark:border-zinc-800 dark:bg-zinc-950 text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity"><ChevronLeft size={16} /></button>
                <button onClick={() => scroll('right')} className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 rounded-full border border-zinc-200 bg-white shadow-md dark:border-zinc-800 dark:bg-zinc-950 text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity"><ChevronRight size={16} /></button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                {/* Sidebar Controls */}
                <div className="lg:col-span-4 space-y-6 order-2 lg:order-1">
                    <div className="p-6 rounded-2xl border border-zinc-200 bg-white dark:bg-zinc-950 dark:border-zinc-800 space-y-6 shadow-sm overflow-hidden">

                        {/* Parametric Specific Sliders (Sides/Points) */}
                        <AnimatePresence>
                            {isParametric && (
                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-4 pt-1">
                                    <div className="flex justify-between items-center">
                                        <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                                            <Hexagon size={14} /> Points / Sides
                                        </label>
                                        <span className="text-xs font-mono font-bold text-zinc-900 dark:text-zinc-50">{sides}</span>
                                    </div>
                                    <input
                                        type="range" min="3" max={selectedShape.type === 'burst' ? 24 : 12} step="1"
                                        value={sides} onChange={(e) => setSides(Number(e.target.value))}
                                        className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-zinc-900 dark:accent-zinc-100"
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Depth Slider (Cookies and Bursts only) */}
                        <AnimatePresence>
                            {isDepthBased && (
                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                                            <Ruler size={14} /> Cutout Depth
                                        </label>
                                        <span className="text-xs font-mono font-bold text-zinc-900 dark:text-zinc-50">{depth}px</span>
                                    </div>
                                    <input
                                        type="range" min="0" max="80" step="1"
                                        value={depth} onChange={(e) => setDepth(Number(e.target.value))}
                                        className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-zinc-900 dark:accent-zinc-100"
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Corner Smoothness Slider (Polygon Only) */}
                        <AnimatePresence>
                            {selectedShape.type === 'polygon' && (
                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                                            <Maximize size={14} /> Corner Fillet
                                        </label>
                                        <span className="text-xs font-mono font-bold text-zinc-900 dark:text-zinc-50">{radiusPercentage}%</span>
                                    </div>
                                    <input
                                        type="range" min="1" max="100" step="1"
                                        value={radiusPercentage} onChange={(e) => setRadiusPercentage(Number(e.target.value))}
                                        className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-zinc-900 dark:accent-zinc-100"
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Rotation Slider */}
                        <div className="space-y-4 pt-2">
                            <div className="flex justify-between items-center">
                                <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                                    <RotateCw size={14} /> Rotation
                                </label>
                                <span className="text-xs font-mono font-bold text-zinc-900 dark:text-zinc-50">{rotation}°</span>
                            </div>
                            <input
                                type="range" min="0" max="360" step="1"
                                value={rotation} onChange={(e) => setRotation(Number(e.target.value))}
                                className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-zinc-900 dark:accent-zinc-100"
                            />
                        </div>
                    </div>

                    {/* Export Code Section */}
                    <div className="p-4 rounded-xl border border-zinc-200 bg-white dark:bg-zinc-950 dark:border-zinc-800">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-[10px] font-bold text-zinc-400 uppercase">Export</span>
                        </div>
                        {isRect ? (
                            <div className="space-y-1 block break-all text-[11px] font-mono p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900">
                                <code>border-radius: {radiusPercentage + '%'}; transform: rotate({rotation}deg);</code>
                                <button onClick={() => copyToClipboard(`border-radius: ${radiusPercentage + '%'}; transform: rotate(${rotation}deg);`)} className="ml-2 text-zinc-400 hover:text-zinc-900 transition-colors">
                                    <Copy size={12} />
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-1 block break-all text-[11px] font-mono p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900 relative">
                                <code className="line-clamp-3">{`<path d="${currentPath}" fill="${activeColor}" />`}</code>
                                <button onClick={() => copyToClipboard(`<path d="${currentPath}" fill="${activeColor}" />`)} className="absolute top-3 right-3 text-zinc-400 hover:text-zinc-900 transition-colors">
                                    <Copy size={14} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Live Preview Area */}
                <div className="lg:col-span-8 flex flex-col items-center justify-center min-h-110 bg-zinc-50 dark:bg-zinc-900/30 rounded-[2.5rem] border-2 border-dashed border-zinc-200 dark:border-zinc-800 order-1 lg:order-2 relative overflow-hidden">

                    <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }} />

                    <AnimatePresence mode="wait">
                        {isRect ? (
                            <motion.div key="rect" animate={{ borderRadius: radiusPercentage + '%', rotate: rotation, backgroundColor: activeColor }} transition={{ type: "spring", stiffness: 100, damping: 20 }} style={{ width: size, height: size }} className="shadow-2xl shadow-zinc-500/10 flex items-center justify-center relative z-10"><Layers className="text-zinc-900/15 dark:text-white/15" size={48} /></motion.div>
                        ) : (
                            <motion.svg key={selectedShape.name} width={size} height={size} viewBox="0 0 300 300" className="relative z-10" transform={`rotate(${rotation})`}>
                                <motion.path animate={{ d: currentPath }} transition={{ type: "spring", stiffness: 100, damping: 20 }} fill={activeColor} className="shadow-2xl shadow-zinc-500/10" />
                            </motion.svg>
                        )}
                    </AnimatePresence>

                    <div className="mt-12 text-center space-y-1 z-10 p-4 rounded-xl bg-zinc-100/50 dark:bg-zinc-800/50 backdrop-blur-sm">
                        <p className="text-xs font-bold text-zinc-900 dark:text-zinc-50 uppercase tracking-[0.2em]">{selectedShape.name}</p>
                        <p className="text-[10px] text-zinc-500 italic">Continuous curve morphing active</p>
                    </div>
                </div>
            </div>
        </div>
    );
}