"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import axios from "@/lib/axios";
import { RiSecurePaymentLine, RiCheckLine, RiCloseLine, RiTimeLine } from "react-icons/ri";

export default function MockPaymentPage() {
    const params = useParams();
    const id = params?.id;
    const [status, setStatus] = useState("pending"); // pending, success, failed
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handlePayment = async (outcome) => {
        setLoading(true);
        try {
            let endpoint = "";
            let data = {};

            switch (outcome) {
                case "success":
                    endpoint = "/mock/razorpay/payment-success";
                    data = { paymentLinkId: id };
                    break;
                case "failed":
                    endpoint = "/mock/razorpay/payment-failed";
                    data = { paymentLinkId: id };
                    break;
                default:
                    return;
            }

            // Call the mock API to simulate webhook/callback
            // Note: In real life, Razorpay calls a webhook. 
            // Here, our mock API will act as the webhook trigger.
            const response = await axios.post(endpoint, data);

            if (response.data.success) {
                setStatus(outcome);
                setMessage(outcome === "success"
                    ? "Payment Successful! You can close this window."
                    : "Payment Failed. Please try again.");

                // If success, close window after a delay or redirect
                if (outcome === "success") {
                    setTimeout(() => {
                        window.close();
                    }, 3000);
                }
            }
        } catch (error) {
            console.error("Payment simulation error:", error);
            setMessage("Error simulating payment. Check console.");
        } finally {
            setLoading(false);
        }
    };

    if (status === "success") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md w-full border border-green-100">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <RiCheckLine className="text-3xl text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful</h2>
                    <p className="text-gray-600 mb-6">Your subscription has been activated.</p>
                    <p className="text-xs text-gray-400">Closing window in 3 seconds...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white p-8 rounded-xl shadow-2xl max-w-sm w-full border-t-8 border-blue-600">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-xl font-bold flex items-center gap-2">
                        <RiSecurePaymentLine className="text-blue-600" />
                        Razorpay Mock
                    </h1>
                    <span className="badge badge-warning text-xs font-mono">TEST MODE</span>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
                    <p className="text-xs uppercase text-gray-400 font-bold mb-1">Transaction ID</p>
                    <p className="font-mono text-sm break-all">{id}</p>
                </div>

                <p className="text-sm text-gray-600 mb-8 text-center">
                    Select an outcome to simulate the payment process.
                </p>

                {message && (
                    <div className={`p-3 rounded-lg text-sm text-center mb-4 ${status === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {message}
                    </div>
                )}

                <div className="space-y-3">
                    <button
                        onClick={() => handlePayment("success")}
                        disabled={loading}
                        className="btn btn-success w-full text-white gap-2"
                    >
                        {loading ? <span className="loading loading-spinner"></span> : <RiCheckLine />}
                        Simulate Success
                    </button>

                    <button
                        onClick={() => handlePayment("failed")}
                        disabled={loading}
                        className="btn btn-error w-full text-white gap-2"
                    >
                        {loading ? <span className="loading loading-spinner"></span> : <RiCloseLine />}
                        Simulate Failure
                    </button>

                    {/* Optional: Expired */}
                    <button
                        className="btn btn-neutral btn-outline btn-xs w-full mt-4 text-gray-400"
                        disabled={loading}
                    >
                        Simulate Expiry (via code only)
                    </button>
                </div>

                <div className="mt-8 pt-4 border-t text-center text-xs text-gray-400">
                    <p>Secured by Mock Payment Gateway</p>
                </div>
            </div>
        </div>
    );
}
