"use client";

import { motion } from "framer-motion";
import { RiArrowRightUpLine } from "react-icons/ri";

export default function GridTemplate({ links, handleLinkClick }) {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const item = {
        hidden: { opacity: 0, scale: 0.9 },
        show: { opacity: 1, scale: 1 }
    };

    return (
        <motion.section
            variants={container}
            initial="hidden"
            animate="show"
            className="w-full pb-10"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {links.map((link, index) => (
                    <motion.a
                        key={link._id}
                        variants={item}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => handleLinkClick?.(link._id)}
                        className={`
                            group
                            relative
                            flex flex-col items-center justify-center
                            p-6 gap-3
                            bg-base-100
                            hover:bg-neutral hover:text-neutral-content
                            rounded-2xl
                            shadow-md hover:shadow-2xl
                            transition-all duration-300
                            text-center
                            min-h-[140px]
                            ${index === 0 && links.length % 2 !== 0
                                ? "md:col-span-2 md:aspect-[2/1] aspect-[2/1]"
                                : "md:col-span-1 md:aspect-square aspect-[2/1]"}
                        `}
                    >
                        <div className="
                            text-4xl 
                            mb-2 
                            opacity-80 group-hover:opacity-100 group-hover:scale-110 
                            transition-all duration-300
                        ">
                            {link.icon || "🔗"}
                        </div>

                        <h3 className="
                            font-bold text-sm leading-tight 
                            line-clamp-2
                            group-hover:text-neutral-content
                        ">
                            {link.title}
                        </h3>

                        <div className="
                            absolute top-3 right-3
                            opacity-0 group-hover:opacity-100
                            transition-opacity duration-300
                        ">
                            <RiArrowRightUpLine />
                        </div>
                    </motion.a>
                ))}
            </div>

            {links.length === 0 && (
                <div className="flex flex-col items-center justify-center col-span-2 p-8 border-2 border-dashed border-base-300 rounded-2xl bg-base-100/50 text-center space-y-2 h-[200px]">
                    <div className="text-4xl opacity-30 mb-2">🍱</div>
                    <p className="font-medium text-base-content/80">Build your grid</p>
                    <p className="text-sm opacity-50 max-w-[180px]">Add multiple links to create a beautiful bento layout.</p>
                </div>
            )}
        </motion.section>
    );
}
