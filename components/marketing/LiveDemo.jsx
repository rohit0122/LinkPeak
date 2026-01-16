"use client";

import { useState } from "react";
import PreviewPhoneNew from "@/components/shared/PreviewPhoneNew";
import ThemeSelector from "@/components/dashboard/ThemeSelector";
import { RiPaletteLine, RiMagicLine, RiArrowRightUpLine } from "react-icons/ri";
import Link from "next/link";
import { ecoDemoProfile } from "@/constants/demoProfile";

export default function LiveDemo() {
  const [theme, setTheme] = useState("bumblebee");


  return (
    <section id="demo" className="py-24 bg-base-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="order-2 lg:order-1 flex justify-center w-full">
            {/* WIDTH OWNER */}
            <div className="w-full max-w-md">
              {/* TRANSFORM LAYER */}
              <div className="scale-90 lg:scale-110 origin-center transition-transform">
                <PreviewPhoneNew
                  demoData={ecoDemoProfile(theme)}
                  isDemo={true}
                  key={theme}
                />
              </div>
            </div>
          </div>


          <div className="order-1 lg:order-2">
            <div className="badge badge-secondary gap-2 p-4 font-bold tracking-widest uppercase mb-8">
              <RiMagicLine /> Interactive Demo
            </div>

            <h2 className="text-5xl font-medium tracking-tighter mb-8 leading-none">
              Style your identity{" "}
              <span className="text-primary italic">instantly.</span>
            </h2>

            <p className="text-xl opacity-60 mb-12 font-medium leading-relaxed">
              Why settle for generic? Switch between 8+ color themes and watch
              your bio page transform in real-time. No code, no design skills
              needed.
            </p>

            <div className="card bg-base-100 shadow-2xl border border-base-300">
              <div className="card-body p-8">
                <h3 className="font-medium text-xl mb-6 flex items-center gap-2">
                  <RiPaletteLine className="text-primary" />
                  Pick a palette to play
                </h3>
                <ThemeSelector
                  currentTheme={theme}
                  onSelect={setTheme}
                  plan={"DEMO"}
                />
                <div className="mt-8 pt-8 border-t border-base-200 flex justify-center">
                  <Link
                    href="/register"
                    className="btn btn-primary btn-block gap-2 shadow-lg shadow-primary/20"
                  >
                    Claim Your Link Now{" "}
                    <RiArrowRightUpLine className="text-xl" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
