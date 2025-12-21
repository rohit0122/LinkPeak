"use client";

import { motion, AnimatePresence } from "framer-motion";
import { HiSparkles } from "react-icons/hi2";

export default function LoadingOverlay({ isLoading, message = "Processing Pulse..." }) {
    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-base-100/80 backdrop-blur-sm"
                >
                    <div className="flex flex-col items-center gap-6">
                        <div className="relative">
                            <div className="w-24 h-24 rounded-full border-4 border-primary/20 animate-[spin_3s_linear_infinite]" />
                            <div className="absolute inset-0 w-24 h-24 rounded-full border-4 border-t-primary animate-[spin_1.5s_ease-in-out_infinite]" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <HiSparkles className="text-3xl text-primary animate-pulse" />
                            </div>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <h3 className="text-xl font-black tracking-tight">{message}</h3>
                            <p className="text-sm font-bold opacity-40 uppercase tracking-widest">Please wait</p>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
