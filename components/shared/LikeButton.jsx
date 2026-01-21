"use client";

import { motion } from "framer-motion";
import { RiHeartFill, RiHeartLine } from "react-icons/ri";

export default function LikeButton({ likes, onLike, isLiked, className = "fixed bottom-10 right-10" }) {
    return (
        <div className={`${className} z-[40]`}>
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onLike}
                className={`flex items-center gap-2 p-4 rounded-full shadow-2xl transition-colors ${isLiked ? "bg-primary text-primary-content" : "bg-base-100 text-primary border-2 border-primary"
                    }`}
            >
                <motion.div
                    animate={isLiked ? {
                        scale: [1, 1.5, 1],
                        transition: { duration: 0.3 }
                    } : {}}
                >
                    {isLiked ? <RiHeartFill className="text-2xl" /> : <RiHeartLine className="text-2xl" />}
                </motion.div>
                <span className="font-bold text-lg">{likes || 0}</span>
            </motion.button>
        </div>
    );
}
