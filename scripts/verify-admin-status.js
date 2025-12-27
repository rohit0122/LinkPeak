const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env.local') });

async function verifyAdmin() {
    const email = "rohit.shrivastava22@outlook.com";
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const User = mongoose.model('User', new mongoose.Schema({ email: String, role: String, plan: String }));
        const user = await User.findOne({ email });
        if (user) {
            console.log(`User ${email} status: role=${user.role}, plan=${user.plan}`);
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
