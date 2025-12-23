"use client";

import { useState } from "react";
import { RiUploadCloud2Line, RiUser3Line, RiRefreshLine } from "react-icons/ri";
import axios from "@/lib/axios";
import { toast } from "react-hot-toast";

export default function ProfileUpload({ currentImage, onUploadSuccess }) {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(currentImage);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validation
        if (!file.type.startsWith("image/")) {
            toast.error("Please upload an image file");
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            toast.error("File size must be less than 2MB");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            setUploading(true);
            // Local preview
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result);
            reader.readAsDataURL(file);

            const { data } = await axios.post("/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            if (data.success) {
                toast.success("Profile picture updated!");
                onUploadSuccess(data.data.url);
            }
        } catch (error) {
            toast.error("Upload failed. Please try again.");
            setPreview(currentImage);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="flex flex-col items-center gap-6 p-8 bg-base-200/50  border border-dashed border-base-300">
            <div className="relative group">
                <div className="avatar">
                    <div className="w-32 h-32  ring ring-primary ring-offset-base-100 ring-offset-4 overflow-hidden shadow-2xl transition-transform active:scale-95">
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
                    <div className="absolute inset-0 bg-base-100/60 backdrop-blur-[2px]  flex items-center justify-center z-10">
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
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 mt-1">PNG, JPG up to 2MB</p>
            </div>
        </div>
    );
}
