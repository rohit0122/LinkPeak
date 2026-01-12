"use client";

import { motion } from "framer-motion";
import { RiExternalLinkLine, RiFlashlightLine } from "react-icons/ri";

export default function ModernTemplate({ links, handleLinkClick }) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const item = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 },
  };

  return (
    <motion.section
      variants={container}
      initial="hidden"
      animate="show"
      className="w-full space-y-3 pb-10"
    >
      {links.map((link) => (
        <motion.a
          key={link.id}
          variants={item}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => handleLinkClick?.(link.id)}
          className="
                        relative
                        block w-full
                        p-1
                        rounded-lg
                        bg-gradient-to-r from-base-200 to-base-100
                        hover:from-primary hover:to-secondary
                        transition-all duration-300
                        group
                        shadow-sm hover:shadow-lg
                    "
        >
          <div
            className="
                        flex items-center justify-between
                        w-full px-4 py-3
                        bg-base-100
                        rounded-[calc(0.5rem-2px)]
                        group-hover:bg-base-100/95
                        transition-colors
                        h-full
                    "
          >
            <div className="flex items-center gap-3 overflow-hidden">
              {link.icon && (
                <span className="text-2xl opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">
                  {link.icon}
                </span>
              )}
              <span className="font-semibold text-base-content group-hover:text-primary transition-colors truncate">
                {link.title}
              </span>
            </div>

            <RiExternalLinkLine
              className="
                            text-base-content/40 
                            group-hover:text-primary 
                            transform group-hover:rotate-45 
                            transition-all duration-300
                        "
            />
          </div>
        </motion.a>
      ))}

      {links.length === 0 && (
        <div className="text-center p-6 opacity-50">
          <p>Add some links to see the magic ✨</p>
        </div>
      )}
    </motion.section>
  );
}
