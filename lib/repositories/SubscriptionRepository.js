import Subscription from "@/models/Subscription";
import dbConnect from "@/lib/db";

class SubscriptionRepository {
    async connect() {
        await dbConnect();
    }

    async findActiveByUserId(userId) {
        await this.connect();
        return Subscription.findOne({
            userId,
            status: "active",
            endDate: { $gt: new Date() }
        }).sort({ endDate: -1 });
    }

    async findRecentByStatus(userId, statuses) {
        await this.connect();
        return Subscription.findOne({
            userId,
            status: { $in: statuses },
        }).sort({ createdAt: -1 });
    }

    async findByUserId(userId) {
        await this.connect();
        return Subscription.find({ userId }).sort({ createdAt: -1 });
    }

    async create(data) {
        await this.connect();
        return Subscription.create(data);
    }

    async update(id, data) {
        await this.connect();
        return Subscription.findByIdAndUpdate(id, data, { new: true });
    }
}

export default new SubscriptionRepository();
