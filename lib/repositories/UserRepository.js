import User from "@/models/User";
import dbConnect from "@/lib/db";

class UserRepository {
    async connect() {
        await dbConnect();
    }

    async findById(id) {
        await this.connect();
        return User.findById(id);
    }

    async findByEmail(email) {
        await this.connect();
        return User.findOne({ email }).select("+password");
    }

    async create(userData) {
        await this.connect();
        return User.create(userData);
    }

    async findByVerificationToken(token) {
        await this.connect();
        return User.findOne({ verificationToken: token });
    }

    async findByResetToken(token) {
        await this.connect();
        return User.findOne({
            resetPasswordToken: token,
            resetPasswordExpire: { $gt: Date.now() },
        });
    }

    async update(id, data) {
        await this.connect();
        return User.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        });
    }

    async save(userDocument) {
        // If we have a raw document (e.g. from findOne), we might need to call save() to trigger middleware like strict pre-save password hashing?
        // Actually, repository pattern typically hides the "Document" nature.
        // But for auth implementation (verify/route.js), we used `user.save()`.
        // We can expose a generic save or specific methods.
        // Ideally, update() ensures atomic updates.
        // But for password hashing which happens on pre-save, we need to be careful.
        // If we pass raw data to create(), it works.
        // If we use findByEmail -> user -> user.password = new -> user.save(), we are relying on Mongoose document.
        // It's acceptable for the repository to return Mongoose documents for internal API usage.
        await this.connect();
        return userDocument.save();
    }
}

export default new UserRepository();
