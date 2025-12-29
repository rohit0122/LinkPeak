import Link from "@/models/Link";
import dbConnect from "@/lib/db";

class LinkRepository {
    async connect() {
        await dbConnect();
    }

    async findByPageId(pageId) {
        await this.connect();
        return Link.find({ pageId }).sort({ order: 1, createdAt: -1 });
    }

    async create(data) {
        await this.connect();
        return Link.create(data);
    }

    async findById(id) {
        await this.connect();
        return Link.findById(id);
    }

    async update(id, data) {
        await this.connect();
        return Link.findByIdAndUpdate(id, data, { new: true });
    }

    async delete(id) {
        await this.connect();
        return Link.findByIdAndDelete(id);
    }

    async reorder(links) {
        await this.connect();
        const bulkOps = links.map((link) => ({
            updateOne: {
                filter: { _id: link.id },
                update: { order: link.order },
            },
        }));
        return Link.bulkWrite(bulkOps);
    }
}

export default new LinkRepository();
