const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env.local') });

async function verifyAdmin() {
    const email = "rohit.shrivastava22@outlook.com";
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const User = mongoose.model('User', new mongoose.Schema({ email: String, role: String, plan: String }));
        const currentUser = await User.findOne({ email });
        if (currentUser) {
            console.log(`User ${email} status: role=${currentUser.role}, plan=${currentUser.plan}`);
        } else {
            console.log(`User ${email} not found.`);
        }
    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}

verifyAdmin();
