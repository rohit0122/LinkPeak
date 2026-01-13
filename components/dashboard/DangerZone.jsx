"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RiAlertFill, RiDeleteBinLine, RiErrorWarningLine } from "react-icons/ri";
import axios from "@/lib/httpClient";
import { toast } from "react-hot-toast";
import { ENDPOINTS } from "@/constants/endpoints";

export default function DangerZone() {
    const router = useRouter();
    const [showModal, setShowModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [confirmationText, setConfirmationText] = useState("");
    const CONFIRMATION_KEYWORD = "DELETE PERMANENTLY";

    const handleDelete = async () => {
        if (confirmationText !== CONFIRMATION_KEYWORD) return;

        try {
            setIsDeleting(true);
            const { data } = await axios.delete(ENDPOINTS.AUTH.DELETE_ACCOUNT);

            if (data.success) {
                // Hard redirect to clear client state
                window.location.href = "/account-deleted";
            }
        } catch (error) {
            console.error("Deletion failed:", error);
            toast.error(error.response?.data?.error || "Failed to delete account. Please try again.");
            setIsDeleting(false);
        }
    };

    return (
        <div className="card bg-base-100 shadow-sm border border-error/20">
            <div className="card-body">
                <h3 className="card-title text-error flex items-center gap-2 text-xl font-bold">
                    <RiAlertFill />
                    Danger Zone
                </h3>
                <p className="text-sm opacity-70">
                    Irreversible actions for your account. Proceed with caution.
                </p>

                <div className="flex items-center justify-between mt-4">
                    <div className="text-sm">
                        <strong className="block text-base-content font-bold">Delete Account</strong>
                        <span className="opacity-60">
                            Permanently delete your account and all associated data.
                        </span>
                    </div>
                    <button
                        className="btn btn-error btn-outline btn-sm font-bold"
                        onClick={() => setShowModal(true)}
                    >
                        <RiDeleteBinLine className="text-lg" />
                        Delete Account
                    </button>
                </div>
            </div>

            {/* Confirmation Modal */}
            {showModal && (
                <dialog className="modal modal-open">
                    <div className="modal-box border border-error">
                        <h3 className="font-bold text-lg text-error flex items-center gap-2">
                            <RiErrorWarningLine className="text-2xl" />
                            WARNING: Permanent Action
                        </h3>

                        <div className="py-4 space-y-4">
                            <p>
                                You are about to <strong>permanently delete</strong> your account.
                                This action is <strong>irreversible</strong> and cannot be undone.
                            </p>

                            <ul className="list-disc list-inside bg-base-200 p-4 rounded-lg text-sm space-y-1">
                                <li>All your bio pages and links will be deleted.</li>
                                <li>Your subscription will be cancelled immediately.</li>
                                <li><strong>No refunds</strong> will be issued for active plans.</li>
                                <li>You will lose access to all analytics data.</li>
                            </ul>

                            <div className="divider"></div>

                            <p className="text-sm">
                                To confirm, please type <strong>{CONFIRMATION_KEYWORD}</strong> below:
                            </p>
                            <input
                                type="text"
                                placeholder={CONFIRMATION_KEYWORD}
                                className="input input-bordered w-full input-error"
                                value={confirmationText}
                                onChange={(e) => setConfirmationText(e.target.value)}
                                autoFocus
                            />
                        </div>

                        <div className="modal-action">
                            <button
                                className="btn btn-neutral btn-outline"
                                onClick={() => {
                                    setShowModal(false);
                                    setConfirmationText("");
                                }}
                                disabled={isDeleting}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn btn-error"
                                disabled={confirmationText !== CONFIRMATION_KEYWORD || isDeleting}
                                onClick={handleDelete}
                            >
                                {isDeleting ? (
                                    <span className="loading loading-spinner"></span>
                                ) : (
                                    <>
                                        <RiDeleteBinLine />
                                        Yes, Delete My Account
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                    <form method="dialog" className="modal-backdrop">
                        <button onClick={() => !isDeleting && setShowModal(false)}>close</button>
                    </form>
                </dialog>
            )}
        </div>
    );
}
