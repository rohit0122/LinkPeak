"use client";
import { PiWarningCircle } from "react-icons/pi";
import UpgradePlanModal from "./UpgradePlanModal";
import { useState } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { useRazorpay } from "@/hooks/useRazorpay";
import { formatDate } from "@/lib/dateUtils";
import axios from "@/lib/httpClient";
import { ENDPOINTS } from "@/constants/endpoints";
import toast from "react-hot-toast";

export default function TrialExpiryBanner() {

  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const { currentSubscription, updateCurrentSubscriptionSession } = useAuthStore();
  const { upgradePlan, renewSubscription, isProcessing } = useRazorpay();

  if (!currentSubscription) return null;

  const {
    plan_name,
    is_trial,
    expiry_date,
    razorpay_subscription_id,
    status

  } = currentSubscription;

  const isFreePlan = plan_name === "FREE";

  const isPaidTrial =
    (is_trial === true || status === "trialing") &&
    (plan_name === "PRO" || plan_name === "AGENCY");

  const brokenPaidTrial = !isFreePlan && status === 'pending' && !razorpay_subscription_id

  // ❌ Do not render banner if not FREE and not trialing paid plan
  if (!isFreePlan && !isPaidTrial && !brokenPaidTrial) return null;


  const onUpgradeContact = () => {
    setShowUpgradeModal(true);
  };

  const onSelectPlan = (plan) => {
    upgradePlan(plan, {
      redirectUrl: '/dashboard'
    });
    setShowUpgradeModal(false);
  };

  const onExtend = () => {
    renewSubscription(razorpay_subscription_id);
  };

  const onRetryInit = async () => {
    const response = await axios.post(ENDPOINTS.SUBSCRIPTION.RETRY_INIT);
    if (!response.data.success) {
      toast.error(response.data.message);
      return;
    }
    updateCurrentSubscriptionSession(response.data.data.subscription);
    toast.success(response.data.message);
  }

  return (
    <div
      className="alert shadow-lg border-2 border-warning bg-warning/20 text-warning-content w-full 
                 flex flex-col md:grid md:grid-cols-[auto_1fr_auto] items-start md:items-center gap-4 px-5 mb-6"
      role="alert"
    >
      {/* Icon */}
      <div className="flex-shrink-0 pt-1 md:pt-0 hidden md:block">
        <PiWarningCircle className="w-8 h-8 text-warning" />
      </div>

      {/* Icon Mobile - Inline with title */}
      <div className="flex items-center gap-3 w-full md:hidden">
        <PiWarningCircle className="w-6 h-6 text-warning flex-shrink-0" />
        <p className="font-bold uppercase text-warning text-sm">
          {isFreePlan
            ? "You are on Free Plan"
            : `${plan_name} Trial Ending Soon`}
        </p>
      </div>

      {/* Message */}
      <div className="space-y-1 text-sm sm:text-base w-full">
        <p className="font-bold uppercase text-warning hidden md:block">
          {isFreePlan
            ? "You are on Free Plan"
            : `${plan_name} Trial Ending Soon`}
        </p>

        {isFreePlan && (
          <>
            <p>
              You are currently using the <strong>FREE</strong> plan with limited
              features.
            </p>
            <p className="text-base-content/70 text-sm">
              Upgrade to PRO or AGENCY to unlock advanced features and analytics.
            </p>
          </>
        )}
        {isPaidTrial && (
          <>
            <p className="leading-relaxed">
              Your trial for the <strong>{plan_name}</strong> plan will expire on{" "}
              <strong>{formatDate(expiry_date)}</strong>.
            </p>
            <p className="text-base-content/70 text-sm leading-relaxed">
              If you choose to subscribe during the trial, payment will be charged automatically after the trial ends. Renew now to avoid any interruption in service.
            </p>
          </>
        )}

        {brokenPaidTrial && (<>
          <p className="leading-relaxed">
            Your trial for the <strong>{plan_name}</strong> plan will expire on{" "}
            <strong>{formatDate(expiry_date)}</strong>.
          </p>
          <p className="text-base-content/70 text-sm leading-relaxed">
            It looks like your subscription setup was interrupted, due to some technical error. Please try again.
          </p>
        </>
        )}
      </div>

      {/* Action */}
      <div className="w-full md:w-auto mt-2 md:mt-0 flex justify-end">
        {isFreePlan && (
          <button
            className="btn btn-warning btn-sm md:btn-md text-base-content font-semibold w-full md:w-auto whitespace-nowrap"
            onClick={onUpgradeContact}
          >
            Upgrade for more features
          </button>
        )}
        {isPaidTrial && (
          <button
            className={`btn btn-warning btn-sm md:btn-md text-base-content font-semibold w-full md:w-auto whitespace-nowrap ${!razorpay_subscription_id ? 'hidden' : ''}`}
            onClick={onExtend}
          >
            Renew / Extend
          </button>
        )}
        {brokenPaidTrial && (
          <button
            className="btn btn-warning btn-sm md:btn-md text-base-content font-semibold w-full md:w-auto whitespace-nowrap"
            onClick={onRetryInit}
          >
            Complete Setup
          </button>
        )}
      </div>
      <UpgradePlanModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        onSelectPlan={onSelectPlan}
      />
    </div >
  );
}
