import { CONFIG } from "@/constants/config";

export const metadata = {
    title: `Dashboard | ${CONFIG.SITE_NAME}`,
    description: "Manage your links, analytics, and bio page settings.",
};

export default function DashboardLayoutWrapper({ children }) {
    return (
        <div className="min-h-screen bg-base-200">
            {children}
        </div>
    );
}
