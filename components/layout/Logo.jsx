import { IoShareSocial } from "react-icons/io5"; // A modern, connected hub icon
import { CONFIG } from "@/constants/config";
import Link from "next/link";
import { FaApper, FaH, FaLandmarkDome, FaLandMineOn, FaPeace, FaStaylinked, FaTachographDigital, FaThinkPeaks } from "react-icons/fa6";
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