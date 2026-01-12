"use client";
import { PiWarningCircle } from "react-icons/pi";
import { useAuthStore } from "@/stores/useAuthStore";
import UpgradePlanModal from "./UpgradePlanModal";
import { useState } from "react";
import { ENDPOINTS } from "@/constants/endpoints";
import axios from "@/lib/httpClient";
import toast from "react-hot-toast";

export default function TrialExpiryBanner() {
  const currentSubscription = useAuthStore(
    (state) => state.currentSubscription
  );
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  if (!currentSubscription) return null;

  const {
    plan_name,
    is_trial,
    expiry_date,
    razorpay_subscription_id,
  } = currentSubscription;

  const isFreePlan = plan_name === "FREE";

  const isPaidTrial =
    is_trial === true &&
    (plan_name === "PRO" || plan_name === "AGENCY") &&
    !!razorpay_subscription_id;

  // ❌ Do not render banner if not FREE and not trialing paid plan
  if (!isFreePlan && !isPaidTrial) return null;


  const onUpgradeContact = () => {
    setShowUpgradeModal(true);
  };

  const onSelectPlan = (plan) => {
    console.log("Selected plan:", plan);
    // 🔥 Call your API here
    axios.post(`${ENDPOINTS.SUBSCRIPTION.CHANGE_PLAN}`, {
      new_plan: plan,
    })
      .then((response) => {
        toast.success("Plan changed successfully! Redirecting for payment.");
        setTimeout(() => {
          window.location.href = '/dashboard/subscription';
        }, 2000);
      })
      .catch((error) => {
        toast.error("Error changing plan!");
      });
  };

  const onExtend = () => {
    // example: open Razorpay renewal flow
  };

  return (
    <div
      className="alert shadow-lg border-2 border-warning bg-warning/20 text-warning-content w-full 
                 flex flex-col sm:flex-row items-start sm:items-center gap-4 px-5 mb-6"
      role="alert"
    >
      {/* Icon */}
      <div className="flex-shrink-0">
        <PiWarningCircle className="w-8 h-8 text-warning" />
      </div>

      {/* Message */}
      <div className="flex-grow space-y-1 text-sm sm:text-base">
        <p className="font-bold uppercase text-warning">
          {isFreePlan
            ? "You are on Free Plan"
            : `${plan_name} Trial Ending Soon`}
        </p>

        {isFreePlan ? (
          <>
            <p>
              You are currently using the <strong>FREE</strong> plan with limited
              features.
            </p>
            <p className="text-base-content/70 text-sm">
              Upgrade to PRO or AGENCY to unlock advanced features and analytics.
            </p>
          </>
        ) : (
          <>
            <p>
              Your trial for the <strong>{plan_name}</strong> plan will expire on{" "}
              <strong>{expiry_date}</strong>.
            </p>
            <p className="text-base-content/70 text-sm">
              Renew now to avoid any interruption in service.
            </p>
          </>
        )}
      </div>

      {/* Action */}
      <div className="flex flex-col sm:flex-row gap-2 mt-2 sm:mt-0">
        {isFreePlan ? (
          <button
            className="btn btn-warning btn-sm sm:btn-md text-base-content font-semibold"
            onClick={onUpgradeContact}
          >
            Contact Support to Upgrade
          </button>
        ) : (
          <button
            className="btn btn-warning btn-sm sm:btn-md text-base-content font-semibold"
            onClick={onExtend}
          >
            Renew / Extend
          </button>
        )}
      </div>
      <UpgradePlanModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        onSelectPlan={onSelectPlan}
      />
    </div>
  );
}
