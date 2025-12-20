"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LiveCounter() {
    const [count, setCount] = useState(0);

    useEffect(() => {
        // Simulate visitor count for dashboard parity
        const updateCount = () => {
            const seed = Math.floor(Math.random() * 5) + 3;
            setCount(seed);
        };
        updateCount();
        const interval = setInterval(updateCount, 8000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex items-center gap-3 px-5 py-2.5 bg-base-100/40 backdrop-blur-xl rounded-full border border-base-content/10 shadow-lg">
            <div className="relative flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_oklch(var(--p))]" />
                <div className="absolute inset-0 w-2 h-2 rounded-full bg-primary animate-ping opacity-75" />
            </div>

            <div className="flex items-baseline gap-1.5 overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.span
                        key={count}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        className="text-sm font-black tabular-nums"
                    >
                        {count}
                    </motion.span>
                </AnimatePresence>
                <span className="text-[10px] opacity-40 uppercase font-black tracking-widest whitespace-nowrap">
                    Viewing Live
                </span>
            </div>
        </div>
    );
}
