import Link from "@/models/Link";
import dbConnect from "@/lib/db";

class LinkRepository {
    async connect() {
        await dbConnect();
    }

    async findByPageId(pageId, userId) {
        await this.connect();
        const filter = { pageId };
        if (userId) filter.userId = userId;
        return Link.find(filter).sort({ order: 1 });
    }

    async countByPageId(pageId, userId) {
        await this.connect();
        const filter = { pageId };
        if (userId) filter.userId = userId;
        return Link.countDocuments(filter);
    }

    async create(data) {
        await this.connect();
        return Link.create(data);
    }

    async findById(id, userId) {
        await this.connect();
        return Link.findOne({ _id: id, userId });
    }

    async update(id, userId, data) {
        await this.connect();
        return Link.findOneAndUpdate({ _id: id, userId }, data, { new: true });
    }

    async delete(id, userId) {
        await this.connect();
        return Link.findOneAndDelete({ _id: id, userId });
    }

    async reorder(links, userId) {
        await this.connect();
        const bulkOps = links.map((link) => ({
            updateOne: {
                filter: { _id: link.id, userId },
                update: { $set: { order: link.order } },
            },
        }));
        return Link.bulkWrite(bulkOps);
    }
}

export default new LinkRepository();
