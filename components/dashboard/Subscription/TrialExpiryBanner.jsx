import { PiWarningCircle } from "react-icons/pi";
import { useAuthStore } from "@/stores/useAuthStore";

export default function TrialExpiryBanner() {
  const currentSubscription = useAuthStore(
    (state) => state.currentSubscription
  );

  const onExtend = () => {};
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
          {currentSubscription?.plan_name} Trial Ending Soon
        </p>

        <p>
          Your trial for the <strong>{currentSubscription?.plan_name}</strong>{" "}
          plan will expire on{" "}
          <strong>{currentSubscription?.expiry_date}</strong>.
        </p>

        <p className="text-base-content/70 text-sm">
          Upgrade now to retain access and enjoy uninterrupted service.
        </p>
      </div>

      {/* Action */}
      <div className="flex flex-col sm:flex-row gap-2 mt-2 sm:mt-0">
        <button
          className="btn btn-warning btn-sm sm:btn-md text-base-content font-semibold"
          onClick={onExtend}
        >
          Renew / Extend
        </button>
      </div>
    </div>
  );
}
