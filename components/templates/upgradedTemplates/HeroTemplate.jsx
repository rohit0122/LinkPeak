"use client";

import { motion } from "framer-motion";
import { RiStarFill, RiArrowRightLine } from "react-icons/ri";

export default function HeroTemplate({ links, handleLinkClick }) {
  if (!links || links.length === 0) {
    return (
      <div className="text-center p-8 border-2 border-dashed border-base-300 rounded-3xl bg-base-100/50">
        <div className="text-4xl mb-2 opacity-50">⭐</div>
        <p className="text-base-content/60 font-medium">
          Highlight your most important link here!
        </p>
      </div>
    );
  }

  const heroLink = links[0];
  const otherLinks = links.slice(1);

  return (
    <section className="w-full space-y-6 pb-10">
      {/* Hero Card */}
      <motion.a
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        href={heroLink.url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => handleLinkClick?.(heroLink.id)}
        className="
                    block w-full
                    relative overflow-hidden
                    bg-primary text-primary-content
                    rounded-3xl
                    shadow-xl hover:shadow-2xl hover:shadow-primary/40
                    transition-all duration-300
                    hover:scale-[1.02]
                "
      >
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <RiStarFill className="text-9xl transform rotate-12" />
        </div>

        <div className="relative p-8 flex flex-col items-center text-center gap-4">
          <div
            className="
                        w-16 h-16 
                        rounded-2xl 
                        bg-white/20 backdrop-blur-sm
                        flex items-center justify-center
                        text-3xl
                        shadow-inner
                    "
          >
            {heroLink.icon || "⭐"}
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-bold leading-tight">
              {heroLink.title}
            </h2>
            <p className="text-primary-content/80 text-sm font-medium">
              Featured Link
            </p>
          </div>

          <div
            className="
                        mt-2
                        bg-white/20 hover:bg-white/30 
                        backdrop-blur-md
                        px-6 py-2 rounded-full
                        text-sm font-bold
                        flex items-center gap-2
                        transition-colors
                    "
          >
            Open Now <RiArrowRightLine />
          </div>
        </div>
      </motion.a>

      {/* Other Links */}
      <div className="space-y-3">
        {otherLinks.map((link, idx) => (
          <motion.a
            key={link.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 + 0.2 }}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleLinkClick?.(link.id)}
            className="
                            group
                            flex items-center gap-4
                            w-full p-4
                            bg-base-100
                            hover:bg-base-200
                            border-l-4 border-transparent hover:border-primary
                            rounded-r-xl rounded-l-md
                            shadow-sm hover:shadow-md
                            transition-all duration-200
                        "
          >
            <span className="text-2xl opacity-70 group-hover:scale-110 transition-transform">
              {link.icon || "📄"}
            </span>
            <span className="font-semibold text-base-content flex-1 text-left">
              {link.title}
            </span>
            <RiArrowRightLine className="opacity-0 group-hover:opacity-50 -translate-x-2 group-hover:translate-x-0 transition-all" />
          </motion.a>
        ))}
      </div>
    </section>
  );
}
