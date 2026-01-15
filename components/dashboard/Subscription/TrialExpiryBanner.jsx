"use client";
import { PiWarningCircle } from "react-icons/pi";
import UpgradePlanModal from "./UpgradePlanModal";
import { useState } from "react";
import { ENDPOINTS } from "@/constants/endpoints";
import axios from "@/lib/httpClient";
import toast from "react-hot-toast";
import { loadRazorpay } from "@/lib/razorpayClient";
import { CONFIG } from "@/constants/config";
import { useAuthStore } from "@/stores/useAuthStore";

export default function TrialExpiryBanner() {

  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const { currentSubscription } = useAuthStore();

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
    is_trial === true && status === "trialing" &&
    (plan_name === "PRO" || plan_name === "AGENCY");

  // ❌ Do not render banner if not FREE and not trialing paid plan
  if (!isFreePlan && !isPaidTrial) return null;


  const onUpgradeContact = () => {
    setShowUpgradeModal(true);
  };

  const onSelectPlan = async (plan) => {
    console.log("Selected plan:", plan);

    const res = await loadRazorpay();

    if (!res) {
      toast.error("Razorpay SDK failed to load. Are you online?");
      return;
    }

    // 🔥 Call your API here
    axios.post(`${ENDPOINTS.SUBSCRIPTION.CHANGE_PLAN}`, {
      new_plan: plan,
    })
      .then((response) => {
        // Handle response wrapped in data key if present
        const apiData = response.data.data || response.data;

        const {
          razorpay_subscription_id,
          razorpay_key,
          plan: planDetails,
          prefill
        } = apiData;

        if (!razorpay_subscription_id) {
          toast.error("Failed to initiate subscription. Please try again.");
          return;
        }

        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
          subscription_id: razorpay_subscription_id,
          name: CONFIG.SITE_NAME,
          description: `Upgrade to ${planDetails?.name || plan} Plan`,
          image: "https://www.linkpeakk.com/linkpeakk-social.webp",
          handler: function (response) {
            toast.success("Plan changed successfully! Payment verified.");
            setTimeout(() => {
              window.location.href = '/dashboard/subscription';
            }, 2000);
          },
          prefill: {
            name: prefill?.name || user?.name,
            email: prefill?.email || user?.email
          },
          theme: {
            color: "#422AD5",
          },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
      })
      .catch((error) => {
        console.error(error);
        toast.error(error?.response?.data?.message || "Error changing plan!");
      });
  };

  const onExtend = async () => {
    const res = await loadRazorpay();

    if (!res) {
      toast.error("Razorpay SDK failed to load. Are you online?");
      return;
    }

    if (!razorpay_subscription_id) {
      toast.error("No active subscription ID found for renewal.");
      return;
    }

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
      subscription_id: razorpay_subscription_id,
      name: CONFIG.SITE_NAME,
      description: `Extend / Renew ${plan_name} Plan`,
      image: "https://www.linkpeakk.com/linkpeakk-social.webp",
      handler: function (response) {
        /*setTimeout(() => {
          window.location.reload();
        }, 2000);*/
        console.log('response ', response)
        axios.post(`${ENDPOINTS.SUBSCRIPTION.VERIFY_PAYMENT}`, {
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_subscription_id: response.razorpay_subscription_id,
          razorpay_signature: response.razorpay_signature
        }).then((res) => {
          toast.success("Subscription extended successfully!");
        }).catch((error) => {
          toast.error(error?.response?.data?.message || "Error extending subscription!");
        });
      },
      prefill: {
        name: currentSubscription?.prefill?.name,
        email: currentSubscription?.prefill?.email,
      },
      theme: {
        color: "#422AD5",
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
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
            Upgrade for more features
          </button>
        ) : (
          <button
            className={`btn btn-warning btn-sm sm:btn-md text-base-content font-semibold ${!razorpay_subscription_id ? 'hidden' : ''}`}
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
    </div >
  );
}
