export const metadata = {
    title: "Dashboard | LinkPeak",
    description: "Manage your links, analytics, and bio page settings.",
};

export default function DashboardLayoutWrapper({ children }) {
    return (
        <div className="min-h-screen bg-base-200">
            {children}
        </div>
    );
}
