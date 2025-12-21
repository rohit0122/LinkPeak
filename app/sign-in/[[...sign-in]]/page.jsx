import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[80vh] container mx-auto bg-base-100 shadow-2xl rounded-3xl overflow-hidden my-10 border border-base-300">
            {/* Left: Sign In Form */}
            <div className="flex flex-col items-center justify-center p-8 lg:p-12 bg-base-100">
                <div className="w-full max-w-md">
                    <h2 className="text-3xl font-black mb-2 text-primary">Welcome Back</h2>
                    <p className="text-base-content/60 mb-10 font-medium">Log in to manage your peak links.</p>

                    <div className="flex justify-center w-full">
                        <SignIn
                            fallbackRedirectUrl="/dashboard"
                            signUpUrl="/sign-up"
                        />
                    </div>
                </div>
            </div>

            {/* Right: Visual */}
            <div className="hidden lg:flex relative bg-neutral overflow-hidden group">
                <img
                    src="/auth-visual.png"
                    alt="LinkPeak Welcome"
                    className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-primary/50 to-accent/50 mix-blend-overlay"></div>
                <div className="relative z-10 flex flex-col justify-end p-16 text-neutral-content w-full h-full bg-gradient-to-t from-black/60 to-transparent">
                    <h3 className="text-4xl font-black mb-4">Keep Climbing Higher.</h3>
                    <p className="text-xl opacity-90 max-w-md">Access your analytics, optimize your links, and grow your audience with the power of AI.</p>
                </div>
            </div>
        </div>
    );
}
