"use client";
export default function MobileMock({ children, className = "", theme = "dark", isPreviewDisable = false }) {

    if (isPreviewDisable)
        return <div className="min-h-screen w-full bg-base-200 flex flex-col items-center justify-center pt-10 pb-2" data-theme={theme}>
            {children}
        </div>
    return (
        <div className={`flex justify-center ${className}`}>
            {/* OUTER BORDER */}
            <div className="relative w-full h-full rounded-[2.9rem] bg-primary p-[6px] shadow-2xl">
                {/* DEVICE BODY */}
                <div className="w-full h-full rounded-[2.6rem] bg-neutral-950 p-[6px]" data-theme={theme}>

                    {/* SCREEN */}
                    <div className="relative w-full h-full rounded-[2.25rem] bg-base-100 overflow-hidden flex border border-base-300 isolate">

                        {/* Camera (inside screen) */}
                        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20">
                            <div className="w-[120px] h-[28px] bg-black rounded-full relative">
                                <div className="absolute right-4 top-[9px] w-[10px] h-[10px] bg-neutral-700 rounded-full" />
                            </div>
                        </div>

                        {/* Relative container for children - allows absolute children to float while others scroll */}
                        <div className="relative flex-1 flex flex-col min-h-0 min-w-0">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
