"use client";

import {
  RiArrowRightLine,
  RiCheckFill,
  RiHeartFill,
  RiPlayCircleLine,
} from "react-icons/ri";
import Link from "next/link";
import Avatar from "@/components/shared/Avatar";
import { getDemoProfile } from "@/constants/demoProfile";
import DemoTemplate from "../shared/DemoTemplate";
import { LazyMotion, domAnimation, m } from "framer-motion";
import { CONFIG } from "@/constants/config";

export default function Hero() {
  return (
    <LazyMotion features={domAnimation}>
      <header className="relative min-h-screen pt-16 xl:pt-12 pb-20 overflow-hidden bg-base-100">
        {/* Background Decor */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -mr-40 -mt-40" aria-hidden="true"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[100px] -ml-40 -mb-40" aria-hidden="true"></div>

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 xl:grid-cols-3 gap-20 xl:gap-2 items-center">
          {/* Text Content */}
          <m.div
            className="relative z-10 flex flex-col items-center xl:items-start text-center xl:text-left xl:col-span-2"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="badge badge-primary badge-outline gap-2 p-4 font-bold tracking-widest uppercase mb-8 text-[10px] sm:text-xs h-auto py-2 text-center">
              <span className="relative flex h-2 w-2 flex-shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Optimize with AI Intelligence.
            </div>

            <h1 className="text-6xl xl:text-8xl font-medium tracking-tight leading-[0.9] text-base-content mb-8">
              The peak of your{" "}
              <span className="text-primary italic">digital identity.</span>
            </h1>

            <p className="text-xl xl:text-2xl font-medium text-base-content/60 max-w-xl mb-12 leading-relaxed">
              Beautiful, data-driven bio pages designed for high engagement. Free
              forever, premium by design.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link
                href="/register"
                className="btn btn-primary btn-lg px-8 text-xl font-medium shadow-2xl shadow-primary/20 hover:scale-105 transition-all group"
              >
                Get Started Free{" "}
                <RiArrowRightLine className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/why-different"
                className="btn btn-ghost btn-lg px-8 text-xl font-bold flex items-center gap-2"
              >
                <RiPlayCircleLine className="text-2xl" /> See How it Works
              </Link>
            </div>

            <div className="mt-16 pt-8 border-t border-base-300 w-full flex flex-col sm:flex-row items-center gap-8 xl:justify-start justify-center">
              <div className="flex items-center gap-4">
                <div className="avatar-group -space-x-3 rtl:space-x-reverse p-2">
                  <Avatar
                    src="/avatars/avatar-female.svg"
                    alt="Creator 1"
                    size="md"
                    className="ring-4 ring-base-300 shadow-sm"
                  />
                  <Avatar
                    src="/avatars/avatar-male.svg"
                    alt="Creator 2"
                    size="md"
                    className="ring-4 ring-base-300 shadow-sm"
                  />
                  <Avatar
                    src="/avatars/avatar-generic-eco.svg"
                    alt="Creator 3"
                    size="md"
                    className="ring-4 ring-base-300 shadow-sm"
                  />
                </div>

                <div className="text-left leading-none">
                  <p className="font-bold text-lg text-base-content">{CONFIG.STATS.CREATORS}</p>
                  <p className="text-xs opacity-50 font-bold uppercase tracking-widest leading-none">
                    Creators
                  </p>
                </div>
              </div>

              <div className="h-10 w-px bg-base-300 hidden sm:block opacity-50" aria-hidden="true"></div>

              <div className="flex gap-8 grayscale opacity-20 group-hover:opacity-40 transition-opacity" aria-label="Supported platforms">
                <span className="font-bold text-2xl tracking-tight hover:text-primary transition-colors cursor-default">
                  TIKTOK
                </span>
                <span className="font-bold text-2xl tracking-tight hover:text-primary transition-colors cursor-default">
                  INSTA
                </span>
                <span className="font-bold text-2xl tracking-tight hover:text-primary transition-colors cursor-default">X</span>
              </div>
            </div>
          </m.div>

          {/* Mockup Side */}
          <m.div
            className="relative flex justify-center xl:justify-end mt-10 xl:mt-0"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative w-full max-w-md">
              {/* Phone Shadow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                      w-[80%] h-[80%] bg-primary/20 rounded-full blur-[80px]" aria-hidden="true" />

              {/* WIDTH OWNER (important) */}
              <div className="w-full">
                {/* TRANSFORM LAYER */}
                <div className="hover:rotate-3 transition-transform duration-700 origin-center">
                  <DemoTemplate
                    demoData={getDemoProfile()}
                    className="max-w-sm"
                    isLCP={true}
                  />
                </div>
              </div>

              {/* Float Cards */}
              <m.div
                className="absolute -left-20 top-40 bg-base-100 p-4 shadow-2xl border border-base-200"
                initial={{ opacity: 0, x: -20 }}
                animate={{
                  opacity: 1,
                  x: 0,
                  y: [0, -15, 0]
                }}
                transition={{
                  opacity: { duration: 0.6, delay: 0.8 },
                  x: { duration: 0.6, delay: 0.8 },
                  y: {
                    repeat: Infinity,
                    duration: 1,
                    ease: "easeInOut",
                    delay: 1.4
                  }
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-success/10 text-success flex items-center justify-center">
                    <RiCheckFill className="text-2xl" />
                  </div>
                  <div>
                    <p className="text-xs font-bold opacity-50">LIVE NOW</p>
                    <p className="font-medium">+240 Views</p>
                  </div>
                </div>
              </m.div>

              <m.div
                className="absolute -right-10 bottom-20 bg-base-100 p-4 shadow-2xl border border-base-200"
                initial={{ opacity: 0, x: 20 }}
                animate={{
                  opacity: 1,
                  x: 0,
                  y: [0, -12, 0]
                }}
                transition={{
                  opacity: { duration: 0.6, delay: 1 },
                  x: { duration: 0.6, delay: 1 },
                  y: {
                    repeat: Infinity,
                    duration: 0.9,
                    ease: "easeInOut",
                    delay: 1.6
                  }
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-pink-100 text-pink-500 flex items-center justify-center">
                    <RiHeartFill className="text-xl" />
                  </div>
                  <div>
                    <p className="text-xs font-bold opacity-50">FAN LOVE</p>
                    <p className="font-medium">+42 Likes</p>
                  </div>
                </div>
              </m.div>
            </div>
          </m.div>
        </div>
      </header>
    </LazyMotion>
  );
}
