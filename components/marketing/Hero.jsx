import { RiArrowRightLine, RiCheckFill, RiHeartFill, RiPlayCircleLine } from "react-icons/ri";
import { CONFIG } from "@/constants/config";
import PreviewPhone from "@/components/shared/PreviewPhone";

export default function Hero() {
    const demoPage = {
        theme: "light",
        title: "Sarah Miller",
        bio: "Digital Creator & Traveler 🏔️ | Sharing my latest journeys and gear.",
        profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
        template: "classic"
    };

    const demoLinks = [
        { id: 1, title: "My Travel Guide 🌍", url: "#", isActive: true },
        { id: 2, title: "Latest Vlog 📹", url: "#", isActive: true },
        { id: 3, title: "Photography Gear 📸", url: "#", isActive: true },
    ];

    return (
        <header className="relative min-h-screen pt-32 pb-20 overflow-hidden bg-base-100">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -mr-40 -mt-40"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[100px] -ml-40 -mb-40"></div>

            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                {/* Text Content */}
                <div className="relative z-10 flex flex-col items-center lg:items-start text-center lg:text-left">
                    <div className="badge badge-primary badge-outline gap-2 p-4 font-bold tracking-widest uppercase mb-8">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                        Next-Gen Bio Links
                    </div>

                    <h1 className="text-6xl md:text-8xl font-medium tracking-tighter leading-[0.9] text-base-content mb-8">
                        The peak of your <span className="text-primary italic">digital identity.</span>
                    </h1>

                    <p className="text-xl md:text-2xl font-medium text-base-content/60 max-w-xl mb-12 leading-relaxed">
                        Beautiful, data-driven bio pages designed for high engagement. Free forever, premium by design.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                        <a href="/register" className="btn btn-primary btn-lg px-8 text-xl font-medium shadow-2xl shadow-primary/20 hover:scale-105 transition-all group">
                            Get Started Free <RiArrowRightLine className="group-hover:translate-x-1 transition-transform" />
                        </a>
                        <a href="#features" className="btn btn-ghost btn-lg px-8 text-xl font-bold flex items-center gap-2">
                            <RiPlayCircleLine className="text-2xl" /> See How it Works
                        </a>
                    </div>

                    <div className="mt-16 pt-8 border-t border-base-300 w-full flex flex-col sm:flex-row items-center gap-8 lg:justify-start justify-center">
                        <div className="flex items-center gap-2">
                            <div className="avatar-group -space-x-4 rtl:space-x-reverse">
                                <div className="avatar">
                                    <div className="w-10"><img src="https://api.dicebear.com/7.x/avataaars/svg?seed=A" alt="user" /></div>
                                </div>
                                <div className="avatar">
                                    <div className="w-10"><img src="https://api.dicebear.com/7.x/avataaars/svg?seed=B" alt="user" /></div>
                                </div>
                                <div className="avatar">
                                    <div className="w-10"><img src="https://api.dicebear.com/7.x/avataaars/svg?seed=C" alt="user" /></div>
                                </div>
                            </div>
                            <div className="text-left leading-none">
                                <p className="font-bold text-lg">10,000+</p>
                                <p className="text-xs opacity-50 font-bold uppercase tracking-widest">Creators</p>
                            </div>
                        </div>

                        <div className="h-8 w-px bg-base-300 hidden sm:block"></div>

                        <div className="flex gap-6 grayscale opacity-40">
                            <span className="font-medium text-xl tracking-tighter">TIKTOK</span>
                            <span className="font-medium text-xl tracking-tighter">INSTA</span>
                            <span className="font-medium text-xl tracking-tighter">X</span>
                        </div>
                    </div>
                </div>

                {/* Mockup Side */}
                <div className="relative flex justify-center lg:justify-end animate-in fade-in slide-in-from-right-10 duration-1000">
                    <div className="relative">
                        {/* Phone Shadow */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-primary/20 rounded-full blur-[80px]"></div>

                        <div className="relative hover:rotate-3 transition-transform duration-700 transform-gpu scale-75 lg:scale-100 origin-center">
                            <PreviewPhone pageData={demoPage} links={demoLinks} />
                        </div>

                        {/* Float Cards */}
                        <div className="absolute -left-20 top-40 bg-base-100 p-4  shadow-2xl border border-base-200 animate-bounce duration-[3000ms]">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-success/10 text-success flex items-center justify-center">
                                    <RiCheckFill className="text-2xl" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold opacity-50">LIVE NOW</p>
                                    <p className="font-medium">+240 Views</p>
                                </div>
                            </div>
                        </div>

                        <div className="absolute -right-10 bottom-20 bg-base-100 p-4  shadow-2xl border border-base-200 animate-bounce duration-[2500ms]">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-pink-100 text-pink-500 flex items-center justify-center">
                                    <RiHeartFill className="text-xl" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold opacity-50">FAN LOVE</p>
                                    <p className="font-medium">+42 Likes</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
