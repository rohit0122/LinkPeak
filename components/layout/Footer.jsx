import { CONFIG } from "@/constants/config";
import { RiGithubFill, RiInstagramFill, RiTwitterFill } from "react-icons/ri";

export default function Footer() {
    return (

        <footer className="bg-base-100 py-20 border-t border-base-200">
            <div className="divider"></div>
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="md:col-span-1">
                        <h3 className="text-3xl font-medium tracking-tighter mb-6">
                            {CONFIG.SITE_NAME}<span className="text-primary italic">.</span>
                        </h3>
                        <p className="opacity-70 font-medium leading-relaxed mb-8">
                            Empowering creators with the world's most beautiful and data-driven bio pages.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="btn btn-square btn-ghost text-2xl hover:text-primary"><RiTwitterFill /></a>
                            <a href="#" className="btn btn-square btn-ghost text-2xl hover:text-primary"><RiInstagramFill /></a>
                            <a href="#" className="btn btn-square btn-ghost text-2xl hover:text-primary"><RiGithubFill /></a>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-medium uppercase tracking-widest text-xs opacity-60 mb-6">Product</h4>
                        <ul className="space-y-4 font-bold">
                            <li><a href="#features" className="hover:text-primary transition-colors">Features</a></li>
                            <li><a href="#pricing" className="hover:text-primary transition-colors">Pricing</a></li>
                            <li><a href="#demo" className="hover:text-primary transition-colors">Interactive Demo</a></li>
                            <li><a href="#faq" className="hover:text-primary transition-colors">FAQ</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-medium uppercase tracking-widest text-xs opacity-60 mb-6">Legal</h4>
                        <ul className="space-y-4 font-bold">
                            <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Cookie Policy</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-medium uppercase tracking-widest text-xs opacity-60 mb-6">Newsletter</h4>
                        <p className="text-sm opacity-70 mb-6 font-medium">Get the latest tips on growing your digital presence.</p>
                        <div className="join w-full">
                            <input className="input input-bordered join-item flex-1 bg-base-200" placeholder="your@email.com" />
                            <button className="btn btn-primary join-item">Join</button>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-base-300 text-center text-sm font-bold opacity-70">
                    <div className="">© 2025 {CONFIG.SITE_NAME}. All rights reserved.</div>
                </div>
            </div>
        </footer>
    );
}