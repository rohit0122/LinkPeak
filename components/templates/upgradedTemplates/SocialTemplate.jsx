"use client";

import { motion } from "framer-motion";
import { RiArrowRightLine, RiShareLine } from "react-icons/ri";

export default function SocialTemplate({ links, handleLinkClick }) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 },
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
                        group
                        flex items-center justify-between
                        w-full p-1 pl-2 pr-4
                        bg-base-100
                        hover:bg-neutral hover:text-neutral-content
                        rounded-full
                        shadow-md hover:shadow-lg
                        transition-all duration-300
                        hover:scale-[1.02]
                    "
        >
          <div className="flex items-center gap-3 overflow-hidden">
            <div
              className="
                            flex items-center justify-center
                            w-10 h-10
                            rounded-full
                            bg-base-200 group-hover:bg-white/20
                            text-xl
                            transition-colors
                        "
            >
              {link.icon || "🔗"}
            </div>

            <div className="flex flex-col min-w-0">
              <span className="font-bold text-sm truncate">{link.title}</span>
            </div>
          </div>

          <div
            className="
                        w-8 h-8
                        rounded-full
                        flex items-center justify-center
                        bg-transparent group-hover:bg-white/20
                        transition-all duration-300
                    "
          >
            <RiArrowRightLine className="text-lg opacity-50 group-hover:opacity-100" />
          </div>
        </motion.a>
      ))}

      {links.length === 0 && (
        <div className="flex flex-col items-center justify-center p-8 border border-base-200 rounded-3xl bg-base-100/80 text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-base-200 flex items-center justify-center mb-1">
            <RiShareLine className="text-xl opacity-60" />
          </div>
          <p className="font-medium text-base-content/80">
            Let&apos;s get social
          </p>
          <p className="text-sm opacity-50 max-w-[200px]">
            Add your social profiles so people can find you everywhere.
          </p>
        </div>
      )}
    </motion.section>
  );
}
