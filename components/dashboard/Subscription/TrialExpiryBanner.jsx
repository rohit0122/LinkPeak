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
    status: rawStatus
  } = currentSubscription;

  const status = (rawStatus || "free").toLowerCase();
  const isFreePlan = plan_name === "FREE" || status === "free";
  const isExpired = status === "expired";
  const isCancelled = status === "cancelled";

  const isPaidTrial =
    status === "trial" &&
    (plan_name === "PRO" || plan_name === "AGENCY");

  const isVerifiedTrial = status === "active" && is_trial === true;

  const brokenPaidTrial = !isFreePlan && status === 'pending' && !razorpay_subscription_id;

  // ❌ Do not render banner if active paid plan (and not cancelling/expired/verified_trial)
  if (status === "active" && !isCancelled && !isVerifiedTrial) return null;
  if (!isFreePlan && !isPaidTrial && !brokenPaidTrial && !isExpired && !isCancelled && !isVerifiedTrial) return null;


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
            : isExpired
              ? "Plan Expired"
              : isCancelled
                ? "Subscription Ending"
                : isVerifiedTrial
                  ? "7 Days Free (Payment Verified)"
                  : "7 Days Free (No card)"}
        </p>
      </div>

      {/* Message */}
      <div className="space-y-1 text-sm sm:text-base w-full">
        <p className="font-bold uppercase text-warning hidden md:block">
          {isFreePlan
            ? "You are on Free Plan"
            : isExpired
              ? "Plan Expired"
              : isCancelled
                ? "Subscription Ending"
                : isVerifiedTrial
                  ? "7 Days Free (Payment Verified)"
                  : "7 Days Free (No card)"}
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
              Your <strong>7-day free trial (No card)</strong> for the <strong>{plan_name}</strong> plan will expire on{" "}
              <strong>{formatDate(expiry_date)}</strong>.
            </p>
            <p className="text-base-content/70 text-sm leading-relaxed">
              No credit card is required for this trial. Renew now to avoid any interruption in service after the trial ends.
            </p>
          </>
        )}

        {isVerifiedTrial && (
          <>
            <p className="leading-relaxed">
              Your <strong>Free trial</strong> for the <strong>{plan_name}</strong> plan is active until{" "}
              <strong>{formatDate(expiry_date)}</strong>.
            </p>
            <p className="text-base-content/70 text-sm leading-relaxed">
              Payment verified. Automatic billing will start after your trial ends. You can manage your subscription from account section.
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

        {isExpired && (
          <>
            <p className="leading-relaxed">
              Your <strong>{plan_name}</strong> plan has expired.
            </p>
            <p className="text-base-content/70 text-sm leading-relaxed">
              Renew your plan to restore full access and keep your bio page live with premium features.
            </p>
          </>
        )}

        {isCancelled && (
          <>
            <p className="leading-relaxed">
              Your bio access ends on <strong>{formatDate(expiry_date)}</strong>.
            </p>
            <p className="text-base-content/70 text-sm leading-relaxed">
              Your subscription has been cancelled. Resume your plan to keep your bio live and maintain premium access.
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
        {(isExpired || isCancelled) && (
          <button
            className="btn btn-warning btn-sm md:btn-md text-base-content font-semibold w-full md:w-auto whitespace-nowrap"
            onClick={() => window.location.href = '#account'}
          >
            {isExpired ? "Renew Plan" : "Resume Plan"}
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
