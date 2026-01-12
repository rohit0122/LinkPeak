"use client";

import { useState } from "react";
import { RiUploadCloud2Line, RiUser3Line, RiRefreshLine } from "react-icons/ri";
import axios from "@/lib/httpClient";
import { toast } from "react-hot-toast";
import imageCompression from "browser-image-compression";
import { ENDPOINTS } from "@/constants/endpoints";
import { setCachedImage, invalidateUserCache } from "@/lib/imageCache";

export default function ProfileUpload({ currentImage, onUpload, userId }) {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(currentImage);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validation
        if (!file.type.startsWith("image/")) {
            toast.error("Please upload an image file");
            return;
        }

        try {
            // Create preview directly from raw file
            const previewUrl = URL.createObjectURL(file);
            setPreview(previewUrl);

            // Trigger immediate upload
            if (onUpload) {
                onUpload(file);
            }
        } catch (error) {
            console.error("File processing error:", error);
            toast.error("Failed to process image.");
            setPreview(currentImage);
        }
    };

    return (
        <div className="flex flex-col items-center gap-6 p-8 bg-base-200/50 border border-dashed border-base-300">
            <div className="relative group">
                <div className="avatar">
                    <div className="w-32 h-32 ring ring-primary ring-offset-base-100 ring-offset-4 overflow-hidden shadow-2xl transition-transform active:scale-95">
                        {preview ? (
                            <img src={preview} alt="Profile" className="object-cover" />
                        ) : (
                            <div className="bg-primary/10 w-full h-full flex items-center justify-center text-primary">
                                <RiUser3Line className="text-5xl" />
                            </div>
                        )}
                    </div>
                </div>

                {uploading && (
                    <div className="absolute inset-0 bg-base-100/60 backdrop-blur-[2px] flex items-center justify-center z-10">
                        <RiRefreshLine className="text-primary text-3xl animate-spin" />
                    </div>
                )}

                <label className="absolute -bottom-2 -right-2 btn btn-primary btn-circle btn-sm shadow-xl cursor-pointer hover:scale-110 transition-transform">
                    <RiUploadCloud2Line className="text-lg" />
                    <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={uploading}
                    />
                </label>
            </div>

            <div className="text-center">
                <h3 className="font-medium text-lg">Profile Photo</h3>
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 mt-1">
                    Auto-optimized to WebP • 200×200
                </p>
            </div>
        </div>
    );
}
