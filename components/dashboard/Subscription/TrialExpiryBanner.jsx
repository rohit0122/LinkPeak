"use client";
import { PiWarningCircle } from "react-icons/pi";
import UpgradePlanModal from "./UpgradePlanModal";
import Link from "next/link";
import { useState } from "react";
import { ENDPOINTS } from "@/constants/endpoints";
import axios from "@/lib/httpClient";
import toast from "react-hot-toast";
import { loadRazorpay } from "@/lib/razorpayClient";
import { CONFIG } from "@/constants/config";
import { useAuthStore } from "@/stores/useAuthStore";

export default function TrialExpiryBanner() {

  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const { currentSubscription, updateCurrentSubscriptionSession } = useAuthStore();

  if (!currentSubscription) return null;

  const {
    plan_name,
    is_trial,
    is_paid,
    expiry_date,
    razorpay_subscription_id,
    status

  } = currentSubscription;

  const isFreePlan = plan_name === "FREE";

  // 1. Standard Paid User: No banner needed
  if (!is_trial && is_paid && !isFreePlan) return null;

  // 2. Authorized Trial (Auto-charge): Informational banner
  const isAuthorizedTrial = is_trial && is_paid;

  // 3. Unauthorized Trial (Needs action): Warning banner
  const isUnauthorizedTrial = is_trial && !is_paid;

  // Do not render if none of above (though usually one will hit)
  if (!isFreePlan && !isAuthorizedTrial && !isUnauthorizedTrial) return null;


  const onUpgradeContact = () => {
    setShowUpgradeModal(true);
  };

  const onSelectPlan = async (plan) => {

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
          console.log('res ', res);
          updateCurrentSubscriptionSession(res.data.data);
          toast.success("Subscription extended successfully!");
        }).catch((error) => {
          toast.error(error?.response?.data?.message || "Error extending subscription!");
        });
      },
      prefill: {
        name: currentUser?.name,
        email: currentUser?.email,
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
      className={`relative overflow-hidden group mb-8 border border-base-200/50 shadow-2xl transition-all duration-500 
        ${isAuthorizedTrial
          ? "bg-slate-50/40 dark:bg-slate-900/40 border-l-[6px] border-l-info"
          : "bg-amber-50/40 dark:bg-amber-950/20 border-l-[6px] border-l-warning"
        } backdrop-blur-xl p-0 animate-in fade-in slide-in-from-top-4 duration-1000`}
    >
      {/* Subtle Corner Glow */}
      <div className={`absolute -top-12 -right-12 w-24 h-24 rounded-full blur-[60px] opacity-20 pointer-events-none ${isAuthorizedTrial ? "bg-info" : "bg-warning"}`}></div>

      <div className="flex flex-col lg:flex-row items-stretch lg:items-center">
        {/* Left: Status Icon & Badge */}
        <div className={`flex flex-col items-center justify-center p-6 lg:p-8 shrink-0 border-b lg:border-b-0 lg:border-r border-base-200/30 gap-3 
          ${isAuthorizedTrial ? "bg-info/5 text-info" : "bg-warning/5 text-warning"}`}>
          <div className={`p-4 rounded-none border-2 ${isAuthorizedTrial ? "border-info/20 bg-info/10" : "border-warning/20 bg-warning/10"}`}>
            <PiWarningCircle className="w-8 h-8 lg:w-10 lg:h-10" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80 whitespace-nowrap">
            {isAuthorizedTrial ? "Verified" : "Attention"}
          </span>
        </div>

        {/* Center: Intelligence Message */}
        <div className="flex-grow p-6 lg:p-8 lg:px-10">
          <div className="flex flex-col gap-2">
            <h3 className={`text-lg lg:text-xl font-black uppercase tracking-widest font-heading 
              ${isAuthorizedTrial ? "text-info" : "text-warning"}`}>
              {isFreePlan ? "Basic Access Deployed" : (isAuthorizedTrial ? "Premium Status Secured" : "Critical: Subscription Authorization")}
            </h3>

            <div className="max-w-2xl space-y-2">
              {isFreePlan ? (
                <>
                  <p className="text-sm lg:text-base font-medium leading-relaxed">
                    You are currently utilizing the <strong>FREE</strong> tier with a basic feature set.
                  </p>
                  <p className="text-base-content/60 text-xs lg:text-sm italic">
                    Unlock the full potential of LinkPeakK. &mdash; deploy unique themes, deep-dive analytics, and advanced AI SEO ranking.
                  </p>
                </>
              ) : isAuthorizedTrial ? (
                <>
                  <p className="text-sm lg:text-base font-medium leading-relaxed">
                    Your <strong>{plan_name}</strong> Plan is active and transition is authorized.
                  </p>
                  <p className="text-base-content/60 text-xs lg:text-sm">
                    Your full membership will activate automatically on <strong>{expiry_date}</strong>, immediately following your trial completion.
                  </p>
                </>
              ) : (
                <>
                  <p className="text-sm lg:text-base font-medium leading-relaxed">
                    Your premium <strong>{plan_name}</strong> trial concludes on <strong>{expiry_date}</strong>.
                  </p>
                  <p className="text-base-content/70 text-xs lg:text-sm font-medium border-l-2 border-warning/30 pl-3 py-1 bg-warning/5">
                    Action required to preserve your custom themes, advanced insights, and active bio projects from suspension.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex flex-col items-stretch lg:items-end justify-center p-6 lg:p-8 lg:pt-10 shrink-0 gap-3">
          {isFreePlan ? (
            <>
              <button
                className="btn btn-warning btn-md lg:btn-lg rounded-none font-black uppercase tracking-widest text-sm shadow-xl px-10 transition-all hover:scale-[1.02] active:scale-95 border-none"
                onClick={onUpgradeContact}
              >
                Upgrade Now
              </button>
              <Link href="/#features" className="text-[10px] font-bold uppercase tracking-widest opacity-40 hover:opacity-100 hover:text-warning text-center transition-all underline decoration-warning/20">
                Compare Feature Sets
              </Link>
            </>
          ) : isAuthorizedTrial ? (
            <div className="flex flex-col items-center lg:items-end gap-2">
              <span className="text-[9px] font-black uppercase tracking-widest text-info/60 mb-1">Status: Fully Operational</span>
              <Link href="/dashboard/subscription" className="btn btn-info btn-outline btn-sm rounded-none font-bold tracking-widest px-8 border-2 hover:bg-info hover:text-white transition-all">
                Member Settings
              </Link>
            </div>
          ) : (
            <>
              <button
                className="btn btn-warning btn-md lg:btn-lg rounded-none font-black uppercase tracking-widest text-sm shadow-xl px-10 animate-pulse hover:animate-none transition-all hover:scale-[1.02] active:scale-95 border-none"
                onClick={onExtend}
              >
                Authorize Payment
              </button>
              <button
                onClick={() => setShowUpgradeModal(true)}
                className="text-[10px] font-bold uppercase tracking-widest opacity-40 hover:opacity-100 text-center transition-all underline decoration-warning/20"
              >
                Review Plan Options
              </button>
            </>
          )}
        </div>
      </div>

      <UpgradePlanModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        onSelectPlan={onSelectPlan}
      />
    </div>
  );
}
