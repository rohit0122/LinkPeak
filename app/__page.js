// app/page.js
import Link from "next/link";
import { CONFIG } from "@/constants/config";

export default function Home() {
  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      {/* Hero Section */}
      <section className="hero min-h-[80vh] bg-base-200">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-6xl font-bold text-primary">{CONFIG.SITE_NAME}</h1>
            <p className="py-6 text-xl">
              The ultimate link-in-bio for creators. Share your world, track your growth, and engage your fans—all in one link.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/register" className="btn btn-primary btn-lg">
                Get Started Free
              </Link>
              <Link href="/features" className="btn btn-outline btn-lg">
                See Features
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <div className="py-10 bg-base-100 flex justify-center border-y border-base-300">
        <p className="font-medium opacity-60">Join 10,000+ creators building on {CONFIG.SITE_NAME}</p>
      </div>
    </div>
  );
}