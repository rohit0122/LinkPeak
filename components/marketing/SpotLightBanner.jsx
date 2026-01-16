import Link from "next/link";
import { RiArrowRightLine } from "react-icons/ri";

export async function SpotLightBanner() {
    return (
        <section className="py-24 bg-primary text-primary-content overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <div className="grid grid-cols-10 h-full">
                    {Array.from({ length: 100 }).map((_, i) => (
                        <div key={i} className="border border-primary-content h-20 w-full"></div>
                    ))}
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                <h2 className="text-5xl md:text-7xl font-medium tracking-tighter mb-8 leading-none">
                    Ready to claim <br />your spotlight?
                </h2>
                <p className="text-xl md:text-2xl opacity-80 mb-12 font-medium">
                    Join thousands of creators who are taking their digital identity to the next level.
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                    <Link href="/register" className="btn btn-lg bg-base-100 text-primary border-none hover:bg-base-200 shadow-2xl px-12 text-2xl font-medium">
                        Create Your Page <RiArrowRightLine />
                    </Link>
                </div>
            </div>
        </section>
    );
}