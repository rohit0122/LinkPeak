"use client";

import { RiAlertFill } from "react-icons/ri";

export default function UnsavedChangesModal({ isOpen, onCancel, onDiscard, onSave, isLoading }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
            <div className={`bg-base-100 border border-base-300 shadow-2xl relative rounded-2xl w-full max-w-sm p-6 transform transition-all scale-100 opacity-100 ${isLoading ? 'pointer-events-none' : ''}`}>
                <div className="flex flex-col items-center text-center gap-4">
                    <div className="w-16 h-16 bg-warning/10 rounded-full flex items-center justify-center mb-2">
                        <RiAlertFill className="text-4xl text-warning" />
                    </div>

                    <h3 className="font-bold text-xl">Unsaved Changes</h3>
                    <p className="py-2 text-base-content/70 text-sm">
                        You have unsaved changes on this page. If you switch pages now, your changes will be lost.
                    </p>

                    <div className="flex flex-col gap-3 w-full mt-4">
                        <button
                            className="btn btn-primary w-full shadow-lg shadow-primary/20"
                            onClick={onSave}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <span className="loading loading-spinner loading-xs"></span>
                                    Saving...
                                </>
                            ) : 'Save & Switch'}
                        </button>

                        <button
                            className="btn btn-ghost text-error hover:bg-error/10 w-full"
                            onClick={onDiscard}
                            disabled={isLoading}
                        >
                            Discard Changes
                        </button>

                        <button
                            className="btn btn-sm btn-ghost w-full font-normal opacity-60"
                            onClick={onCancel}
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
