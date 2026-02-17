"use client";
import { PiWarningCircle } from "react-icons/pi";
import UpgradePlanModal from "./UpgradePlanModal";
import { useState } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { calculateTimeLeft, formatDate } from "@/lib/dateUtils";
import axios from "@/lib/httpClient";
import { ENDPOINTS } from "@/constants/endpoints";
import toast from "react-hot-toast";

export default function TrialExpiryBanner() {

  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const { currentSubscription } = useAuthStore();

  if (!currentSubscription) return null;

  const {
    plan_name,
    is_trial,
    expiry_date,
    status

  } = currentSubscription;

  const isFreePlan = plan_name === "FREE";

  const isPaidTrial =
    (is_trial === true || status === "trial") &&
    (plan_name === "PRO" || plan_name === "AGENCY");

  const brokenPaidTrial = !isFreePlan && status === 'pending';
  // ❌ Do not render banner if not FREE and not trialing paid plan
  if (!isFreePlan && !isPaidTrial && !brokenPaidTrial) return null;


  const onUpgradeContact = () => {
    setShowUpgradeModal(true);
  };

  /*const onSelectPlan = (plan) => {
    upgradePlan(plan, {
      redirectUrl: '/dashboard'
    });
    setShowUpgradeModal(false);
  };*/

  const onSelectPlan = async (plan) => {
    console.log('plan ==== ', plan, getPlanIdByName(plan));
    console.log('planId ==== ', ENDPOINTS.PAYMENT.GET_PAYMENT_URL);
    const response = await axios.post(ENDPOINTS.PAYMENT.GET_PAYMENT_URL, {
      planId: getPlanIdByName(plan)
    });
    console.log('response ==== ', response);
    if (response.data.success) {
      window.location.href = response.data.data.payment_url;
    } else {
      toast.error(response.data.message);
    }
    setShowUpgradeModal(false);
  };

  const onExtend = () => {
    setShowUpgradeModal(true);

  };

  const onRetryInit = async () => {
    setShowUpgradeModal(true);
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
          {currentSubscription?.pending_plan
            ? "Plan Change Scheduled"
            : isFreePlan
              ? "You are on Free Plan"
              : `${plan_name} Trial Ending Soon`}
        </p>
      </div>

      {/* Message */}
      <div className="space-y-1 text-sm sm:text-base w-full">
        <p className="font-bold uppercase text-warning hidden md:block">
          {currentSubscription?.pending_plan
            ? "Plan Change Scheduled"
            : isFreePlan
              ? "You are on Free Plan"
              : `${plan_name} Trial Ending Soon`}
        </p>

        {isFreePlan && !currentSubscription?.pending_plan && (
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
            {!currentSubscription?.pending_plan && (
              <p className="text-base-content/70 text-sm leading-relaxed">
                If you renew before your current plan expires, your new 30 days will be <strong>added to your remaining days</strong>.<br />
                This ensures uninterrupted access to all features.
              </p>
            )}
          </>
        )}

        {brokenPaidTrial && !currentSubscription?.pending_plan && (<>
          <p className="leading-relaxed">
            Your trial for the <strong>{plan_name}</strong> plan will expire on{" "}
            <strong>{formatDate(expiry_date)}</strong>.
          </p>
          <p className="text-base-content/70 text-sm leading-relaxed">
            It looks like your subscription setup was interrupted, due to some technical error. Please try again.
          </p>
        </>
        )}

        {/* Renewal Window */}
        {currentSubscription?.is_renewal_window_open && !currentSubscription?.pending_plan && (
          <>
            <p className="leading-relaxed">
              Your {currentSubscription?.plan_name} is going to end in{" "}
              <strong>{calculateTimeLeft(expiry_date)}</strong>.
            </p>
            <p className="text-base-content/70 text-sm leading-relaxed">
              Renew now to avoid service interruption.
            </p>

            {/*<div className="alert alert-warning shadow-sm mb-4">
              <RiAlertLine className="text-xl" />
              <div className="flex-1">
                <div className="font-bold text-sm">Plan Expiring Soon</div>
                <div className="text-xs opacity-80">
                  Your plan is going to expire in {calculateTimeLeft(currentSubscription?.expiry_date)}.
                </div>
              </div>
            </div>*/}
          </>
        )}

        {currentSubscription?.pending_plan && (
          <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg my-2">
            <p className="font-bold text-xs uppercase opacity-70 mb-1">Plan Change Scheduled</p>
            <p className="text-sm">
              Your {currentSubscription.pending_plan.name} plan will start automatically after <strong> {formatDate(expiry_date)}</strong>, once your current {currentSubscription.plan_name} access ends.
            </p>
          </div>
        )}
      </div>

      {/* Action */}
      <div className="w-full md:w-auto mt-2 md:mt-0 flex justify-end">
        {!currentSubscription?.pending_plan && (
          <button
            className="btn btn-warning btn-sm md:btn-md text-base-content font-semibold w-full md:w-auto whitespace-nowrap"
            onClick={() => setShowUpgradeModal(true)}
          >
            {isFreePlan && "Upgrade for more features"}
            {isPaidTrial && "Extend"}
            {brokenPaidTrial && "Complete Setup"}
            {!isFreePlan && !isPaidTrial && !brokenPaidTrial && currentSubscription?.is_renewal_window_open && "Renew Your Plan"}
          </button>
        )}

        {/*isFreePlan && (
          <button
            className="btn btn-warning btn-sm md:btn-md text-base-content font-semibold w-full md:w-auto whitespace-nowrap"
            onClick={onUpgradeContact}
          >
            Upgrade for more features
          </button>
        )*/}
        {/*isPaidTrial && (
          <button
            className={`btn btn-warning btn-sm md:btn-md text-base-content font-semibold w-full md:w-auto whitespace-nowrap`}
            onClick={onExtend}
          >
            Extend
          </button>
        )}*/}
        {/*brokenPaidTrial && (
          <button
            className="btn btn-warning btn-sm md:btn-md text-base-content font-semibold w-full md:w-auto whitespace-nowrap"
            onClick={onRetryInit}
          >
            Complete Setup
          </button>
        )}*/}
      </div>
      <UpgradePlanModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        onSelectPlan={onSelectPlan}
      />
    </div >
  );
}
