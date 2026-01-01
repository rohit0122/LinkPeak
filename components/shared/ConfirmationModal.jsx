"use client";

import { RiAlertFill } from "react-icons/ri";

export default function ConfirmationModal({
    isOpen,
    onCancel,
    onConfirm,
    title = "Are you sure?",
    message = "This action cannot be undone.",
    confirmText = "Confirm",
    cancelText = "Cancel",
    isDestructive = false
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200">
            <div className="bg-base-100 border border-base-300 shadow-2xl relative rounded-2xl w-full max-w-sm p-6 transform transition-all scale-100 opacity-100 animate-in zoom-in-95 duration-200">
                <div className="flex flex-col items-center text-center gap-4">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-2 ${isDestructive ? "bg-error/10 text-error" : "bg-warning/10 text-warning"}`}>
                        <RiAlertFill className="text-4xl" />
                    </div>

                    <h3 className="font-bold text-xl tracking-tight">{title}</h3>
                    <p className="text-base-content/70 text-sm leading-relaxed">
                        {message}
                    </p>

                    <div className="flex flex-col gap-3 w-full mt-4">
                        <button
                            className={`btn w-full shadow-lg ${isDestructive ? "btn-error" : "btn-primary"}`}
                            onClick={onConfirm}
                        >
                            {confirmText}
                        </button>

                        <button
                            className="btn btn-neutral btn-outline w-full font-normal"
                            onClick={onCancel}
                        >
                            {cancelText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
