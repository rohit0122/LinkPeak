import Subscription from "@/models/Subscription";
import User from "@/models/User";

/**
 * Activates scheduled subscriptions that have reached their start date
 * Call this on dashboard init or user login
 */
export async function activateScheduledSubscriptions(userId) {
    try {
        const now = new Date();

        // Find scheduled subscriptions that should now be active
        const scheduledSubs = await Subscription.find({
            userId,
            status: "scheduled",
            startDate: { $lte: now }
        }).sort({ startDate: 1 });

        if (scheduledSubs.length === 0) return;

        // Activate the first one (earliest start date)
        const subToActivate = scheduledSubs[0];

        // Update subscription status
        subToActivate.status = "active";
        subToActivate.updatedAt = new Date();
        await subToActivate.save();

        // Update user's plan
        await User.findByIdAndUpdate(userId, {
            plan: subToActivate.planId,
            isActive: true,
            updatedAt: new Date()
        });

        // Expire old active subscriptions
        await Subscription.updateMany({
            userId,
            status: "active",
            _id: { $ne: subToActivate._id },
            endDate: { $lt: now }
        }, {
            status: "expired",
            updatedAt: new Date()
        });

        console.log(`Activated scheduled subscription for user ${userId}: ${subToActivate.planId}`);
        return true;
    } catch (error) {
        console.error("Error activating scheduled subscriptions:", error);
        return false;
    }
}
