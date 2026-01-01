import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please provide a name"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Please provide an email"],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
        },
        password: {
            type: String,
            required: [true, "Please provide a password"],
            minlength: 6,
            select: false,
        },
        role: {
            type: String,
            enum: ["currentUser", "admin"],
            default: "currentUser",
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        verificationToken: String,
        resetPasswordToken: String,
        resetPasswordExpire: Date,
        plan: {
            type: String,
            enum: ["FREE", "PRO", "AGENCY"],
            default: "FREE",
        },
        planExpiresAt: Date,
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

// Encrypt password using bcrypt
UserSchema.pre("save", async function () {
    if (!this.isModified("password")) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Match currentUser entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Index for admin stats queries
UserSchema.index({ plan: 1, isActive: 1 });

export default mongoose.models.User || mongoose.model("User", UserSchema);

