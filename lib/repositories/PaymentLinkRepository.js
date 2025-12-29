import PaymentLink from "@/models/PaymentLink";
import dbConnect from "@/lib/db";

class PaymentLinkRepository {
    async connect() {
        await dbConnect();
    }

    async findPendingByUserId(userId) {
        await this.connect();
        const now = new Date();
        return PaymentLink.findOne({
            userId,
            status: "created",
            expiresAt: { $gt: now },
        }).sort({ createdAt: -1 });
    }

    async create(data) {
        await this.connect();
        return PaymentLink.create(data);
    }

    async findById(id) {
        await this.connect();
        return PaymentLink.findById(id);
    }

    async findByProviderPaymentLinkId(id) {
        await this.connect();
        return PaymentLink.findOne({ providerPaymentLinkId: id });
    }

    async update(id, data) {
        await this.connect();
        return PaymentLink.findByIdAndUpdate(id, data, { new: true });
    }
}

export default new PaymentLinkRepository();
