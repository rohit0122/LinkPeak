"use client";
import { PiWarningCircle } from "react-icons/pi";
import { useAuthStore } from "@/stores/useAuthStore";
import { formatDate } from "@/lib/dateUtils";

export default function TrialExpiryBanner() {
  const { currentSubscription } = useAuthStore();

  if (!currentSubscription) return null;

  const {
    plan_name,
    is_trial,
    expiry_date,
    status,
    pending_plan
  } = currentSubscription;

  const isFreePlan = plan_name === "FREE";

  const isPaidTrial =
    (is_trial === true || status === "trial") &&
    (plan_name === "PRO" || plan_name === "AGENCY");

  // Only show if user is FREE OR (user is PRO/Agency in trial AND pending_plan is null)
  const shouldShowBanner = isFreePlan || (isPaidTrial && !pending_plan);

  if (!shouldShowBanner) return null;

  return (
    <div
      className="alert shadow-md border border-warning/50 bg-warning/5 text-warning-content w-full 
                 flex flex-col md:grid md:grid-cols-[auto_1fr] items-start md:items-center gap-4 px-5 mb-6 py-4 rounded-xl"
      role="alert"
    >
      {/* Icon */}
      <div className="flex-shrink-0 hidden md:block">
        <PiWarningCircle className="w-7 h-7 text-warning" />
      </div>

      {/* Mobile Title with Icon */}
      <div className="flex items-center gap-3 w-full md:hidden mb-1">
        <PiWarningCircle className="w-6 h-6 text-warning flex-shrink-0" />
        <p className="font-bold uppercase text-warning text-xs tracking-wider">
          {isFreePlan ? "Free Plan Activated" : "Trial Ending Soon"}
        </p>
      </div>

      {/* Message Content */}
      <div className="space-y-1 w-full">
        <p className="font-bold uppercase text-warning text-xs tracking-wider hidden md:block mb-1">
          {isFreePlan ? "Free Plan Activated" : "Trial Ending Soon"}
        </p>

        {isFreePlan ? (
          <div className="flex flex-col gap-0.5">
            <p className="text-sm md:text-base font-medium">
              You can upgrade anytime to access more powerful features and analytics.
            </p>
            <p className="text-base-content/60 text-xs md:text-sm">
              To upgrade your plan, visit the <span className="font-bold">Account Section</span>.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-0.5">
            <p className="text-sm md:text-base font-medium">
              Your <strong>{plan_name}</strong> trial expires on <strong>{formatDate(expiry_date)}</strong>.
            </p>
            <p className="text-base-content/60 text-xs md:text-sm">
              To continue with your pro features, make sure to pay from the <span className="font-bold">Account Section</span>.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
