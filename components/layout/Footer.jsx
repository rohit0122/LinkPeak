import { HiSparkles } from "react-icons/hi2";

export default function Footer() {
    return (
        <footer className="footer footer-center p-10 bg-neutral text-neutral-content rounded">
            <nav className="grid grid-flow-col gap-4">
                <a className="link link-hover">About us</a>
                <a className="link link-hover">Contact</a>
                <a className="link link-hover">Jobs</a>
                <a className="link link-hover">Press kit</a>
            </nav>
            <aside>
                <div className="flex items-center gap-2 mb-2">
                    <HiSparkles className="text-primary text-xl" />
                    <span className="font-bold text-lg">LinkPeak</span>
                </div>
                <p>Copyright © 2025 - All right reserved by LinkPeak Ltd</p>
            </aside>
        </footer>
    );
}
