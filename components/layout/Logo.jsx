import { CONFIG } from "@/constants/config";
import Image from "next/image";
import Link from "next/link";

export default function Logo() {
    return (
        <Link href="/" className="text-xl font-semibold flex items-center gap-2">
            <Image src="/logo.svg" alt="Logo" className="w-6 h-6" width={24} height={24} />
            <span className="text-primary text-2xl font-semibold">
                {CONFIG.SITE_NAME}
            </span>
        </Link>
    );
}