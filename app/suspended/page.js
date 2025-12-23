import Link from "next/link";
import { RiErrorWarningLine, RiCustomerService2Line } from "react-icons/ri";

export default function SuspendedPage() {
    return (
        <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
            <div className="max-w-md w-full text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex justify-center">
                    <div className="w-24 h-24 bg-error/10 flex items-center justify-center text-error border-4 border-error/5">
                        <RiErrorWarningLine className="text-5xl" />
                    </div>
                </div>

                <div className="space-y-2">
                    <h1 className="text-4xl font-medium tracking-tighter uppercase">Account Suspended</h1>
                    <p className="text-base-content/40 font-medium leading-relaxed">
                        Your account has been temporarily deactivated by the platform administration.
                        Please contact support if you believe this is an error.
                    </p>
                </div>

                <div className="flex flex-col gap-3">
                    <Link
                        href="mailto:support@linkpeak.com"
                        className="btn btn-error btn-lg  gap-3 font-medium text-white shadow-xl shadow-error/20"
                    >
                        <RiCustomerService2Line className="text-xl" />
                        Contact Support
                    </Link>
                    <Link href="/login" className="btn btn-ghost  opacity-40 hover:opacity-100 font-bold tracking-widest text-[10px] uppercase">
                        Back to Login
                    </Link>
                </div>

                <p className="text-[10px] font-medium uppercase tracking-[0.3em] opacity-20">LinkPeak Security System</p>
            </div>
        </div>
    );
}
