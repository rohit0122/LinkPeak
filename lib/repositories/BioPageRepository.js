import BioPage from "@/models/BioPage";
import User from "@/models/User"; // Ensure User model is registered for populate
import dbConnect from "@/lib/db";

class BioPageRepository {
    async connect() {
        await dbConnect();
    }

    async create(data) {
        await this.connect();
        return BioPage.create(data);
    }

    async findBySlug(slug) {
        await this.connect();
        return BioPage.findOne({ slug: slug.toLowerCase() }).populate("userId", "plan");
    }

    async findBySlugLean(slug) {
        // Lightweight version for public page view
        await this.connect();
        return BioPage.findOne({ slug: slug.toLowerCase() }).populate("userId", "plan").lean();
    }

    async findByUserId(userId) {
        await this.connect();
        return BioPage.find({ userId }).sort({ createdAt: -1 });
    }

    async countByUserId(userId) {
        await this.connect();
        return BioPage.countDocuments({ userId });
    }

    async findById(id) {
        await this.connect();
        return BioPage.findById(id);
    }

    async update(id, data) {
        await this.connect();
        return BioPage.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        });
    }

    async updateWithUserCheck(id, userId, data) {
        await this.connect();
        return BioPage.findOneAndUpdate(
            { _id: id, userId },
            data,
            { new: true, runValidators: true }
        );
    }

    async findBySlugAndId(slug, id) {
        await this.connect();
        return BioPage.findOne({ slug: slug.toLowerCase(), _id: id });
    }

    async delete(id) {
        await this.connect();
        return BioPage.findByIdAndDelete(id);
    }

    async deleteWithUserCheck(id, userId) {
        await this.connect();
        return BioPage.findOneAndDelete({ _id: id, userId });
    }
}

export default new BioPageRepository();
