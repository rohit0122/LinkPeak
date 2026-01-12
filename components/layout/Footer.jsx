"use client";

import { useState } from "react";
import { CONFIG } from "@/constants/config";
import { ENDPOINTS } from "@/constants/endpoints";
import {
  RiGithubFill,
  RiInstagramFill,
  RiTwitterFill,
  RiLoader4Line,
  RiFacebookBoxFill,
  RiXboxFill,
  RiTwitterXFill,
  RiFacebookBoxLine,
} from "react-icons/ri";
import axios from "@/lib/httpClient";
import toast from "react-hot-toast";
import Logo from "./Logo";
import { SocialIcons } from "../shared/SocialIcons";
import Link from "next/link";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post(ENDPOINTS.NEWSLETTER.SUBSCRIBE, {
        email,
      });
      toast.success(data.message);
      setEmail("");
    } catch (error) {
      toast.error(
        error.response?.data?.error || "Subscription failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-base-100 py-20 border-t border-base-200">
      <div className="divider"></div>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-1">
            <h3 className="text-3xl font-medium tracking-tighter mb-6">
              <Logo />
            </h3>
            <p className="opacity-70 font-medium leading-relaxed mb-8">
              Empowering creators with the world&apos;s most beautiful and
              data-driven bio pages.
            </p>
            <SocialIcons />
          </div>

          <div>
            <h4 className="font-medium uppercase tracking-widest text-xs opacity-60 mb-6">
              Product
            </h4>
            <ul className="space-y-4 font-bold">
              <li>
                <Link
                  href="/#features"
                  className="hover:text-primary transition-colors"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="/#pricing"
                  className="hover:text-primary transition-colors"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="/#demo"
                  className="hover:text-primary transition-colors"
                >
                  Interactive Demo
                </Link>
              </li>
              <li>
                <Link
                  href="/#faq"
                  className="hover:text-primary transition-colors"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium uppercase tracking-widest text-xs opacity-60 mb-6">
              Legal
            </h4>
            <ul className="space-y-4 font-bold">
              <li>
                <Link
                  href="/terms-and-conditions"
                  className="hover:text-primary transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="hover:text-primary transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/cookies-policy"
                  className="hover:text-primary transition-colors"
                >
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/contact-us"
                  className="hover:text-primary transition-colors"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium uppercase tracking-widest text-xs opacity-60 mb-6">
              Newsletter
            </h4>
            <p className="text-sm opacity-70 mb-6 font-medium">
              Get the latest tips on growing your digital presence.
            </p>
            <div className="join w-full max-w-sm">
              <input
                type="email"
                name="newsletter-email"
                id="newsletter-email"
                suppressHydrationWarning
                className="input input-bordered join-item flex-1 bg-base-200"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
              />
              <button
                type="button"
                className="btn btn-primary join-item px-6"
                onClick={handleSubscribe}
                disabled={loading}
              >
                {loading ? (
                  <RiLoader4Line className="animate-spin text-xl" />
                ) : (
                  "Join"
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-base-300 text-center text-sm font-bold opacity-70">
          <div className="">© 2025 {CONFIG.SITE_NAME} All rights reserved.</div>
        </div>
      </div>
    </footer>
  );
}
