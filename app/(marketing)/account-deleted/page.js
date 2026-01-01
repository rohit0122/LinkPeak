import Link from "next/link";
import { RiCheckLine, RiEmotionSadLine } from "react-icons/ri";

export default function AccountDeletedPage() {
    return (
        <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
            <div className="card w-full max-w-md bg-base-100 shadow-xl">
                <div className="card-body text-center items-center">
                    <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mb-4">
                        <RiCheckLine className="text-4xl text-success" />
                    </div>

                    <h2 className="card-title text-2xl mb-2">Account Deleted</h2>

                    <p className="text-base-content/70 mb-6">
                        We're sorry to see you go. Your account and all associated data have been permanently removed from our system.
                    </p>

                    <div className="flex flex-col w-full gap-3">
                        <Link href="/" className="btn btn-primary">
                            Return to Homepage
                        </Link>
                        <Link href="/contact-us" className="btn btn-neutral btn-outline">
                            Leave Feedback
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
