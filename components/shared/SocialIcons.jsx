import { RiYoutubeFill, RiInstagramFill, RiFacebookBoxFill, RiTwitterFill, RiLinkedinBoxFill } from "react-icons/ri";

export const SocialIcons = () => {
    return (
        <div className="flex gap-4">
            {/* YouTube */}
            <a
                href="https://www.youtube.com/@LinkPeakK"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-square btn-ghost text-xl
               text-[#FF0000]
               hover:bg-[#FF0000] hover:text-white
               transition-all duration-300"
                aria-label="Follow us on YouTube"
            >
                <RiYoutubeFill />
            </a>

            {/* Instagram */}
            <a
                href="https://www.facebook.com/LinkPeakK"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-square btn-ghost text-xl
               text-[#E1306C]
               hover:text-white
               hover:bg-gradient-to-tr
               hover:from-[#E1306C]
               hover:via-[#FD1D1D]
               hover:to-[#FCAF45]
               transition-all duration-300"
                aria-label="Follow us on Instagram"
            >
                <RiInstagramFill />
            </a>

            {/* Facebook */}
            <a
                href="https://www.facebook.com/LinkPeakK"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-square btn-ghost text-xl
               text-[#1877F2]
               hover:bg-[#1877F2] hover:text-white
               transition-all duration-300"
                aria-label="Follow us on Facebook"
            >
                <RiFacebookBoxFill />
            </a>
        </div>

    );
};