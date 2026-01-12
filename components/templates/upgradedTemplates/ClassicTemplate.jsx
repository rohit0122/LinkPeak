"use client";

import { motion } from "framer-motion";
import { RiArrowRightLine, RiLinkM } from "react-icons/ri";

export default function ClassicTemplate({ page, links, handleLinkClick }) {
  // Animation variants for stagger effect
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  const safeLinks = Array.isArray(links) ? links : [];
  return (
    <motion.section
      variants={container}
      initial="hidden"
      animate="show"
      className="w-full space-y-4 pb-10"
    >
      {safeLinks.map((link, i) => (
        <motion.a
          key={link.id || i}
          variants={item}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => handleLinkClick?.(link.id)}
          className="
                        group
                        relative
                        flex items-center justify-between
                        w-full p-4
                        bg-base-100 
                        hover:bg-primary hover:text-primary-content
                        border border-base-200 hover:border-primary
                        rounded-xl
                        shadow-sm hover:shadow-xl
                        transition-all duration-300 ease-out
                        hover:-translate-y-1
                        overflow-hidden
                        bg-primary text-primary-content
                    "
          aria-label={link.title}
        >
          {/* Icon/Thumbnail Area */}
          <div className="flex items-center gap-4 min-w-0">
            <div
              className="
                            flex items-center justify-center 
                            w-10 h-10 
                            rounded-lg 
                            bg-base-200 group-hover:bg-primary-content/20
                            text-base-content/70 group-hover:text-primary-content
                            transition-colors
                        "
            >
              {link.icon ? (
                <span className="text-xl">{link.icon}</span>
              ) : (
                <RiLinkM className="text-xl" />
              )}
            </div>

            <div className="flex flex-col min-w-0">
              <span className="font-bold text-base truncate pr-2">
                {link.title}
              </span>
              <span className="text-xs opacity-60 group-hover:opacity-80 truncate">
                {link.url}
              </span>
            </div>
          </div>

          {/* Arrow Icon */}
          <div
            className="
                        flex-shrink-0
                        w-6
                        invisible group-hover:visible
                        transform translate-x-2 group-hover:translate-x-0
                        transition-all duration-300
                    "
          >
            <RiArrowRightLine className="text-xl" />
          </div>
        </motion.a>
      ))}

      {safeLinks.length === 0 && (
        <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-base-300 rounded-xl bg-base-100/50 text-center space-y-2">
          <div className="p-3 bg-base-200 rounded-full mb-1">
            <RiLinkM className="text-2xl opacity-50" />
          </div>
          <p className="font-medium text-base-content/80">Your list is empty</p>
          <p className="text-sm opacity-50 max-w-[200px]">
            Add your first link to get this list started!
          </p>
        </div>
      )}
    </motion.section>
  );
}
