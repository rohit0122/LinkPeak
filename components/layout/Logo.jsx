import { CONFIG } from "@/constants/config";
import Link from "next/link";
import { PiGraphDuotone } from "react-icons/pi";

export default function Logo() {
    return (
        <Link href="/" className="text-xl font-semibold flex items-center gap-2">
            <PiGraphDuotone className="w-6 h-6 text-nuetral" />
            <span className="text-primary text-2xl font-semibold">
                {CONFIG.SITE_NAME}
            </span>
        </Link>
    );
}