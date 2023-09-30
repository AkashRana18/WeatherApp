const mongoose = require('mongoose');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

// Hash the password before saving

userSchema.pre('save', function (next) {
    if (this.isModified('password')) {
        const hash = crypto.createHash('sha256').update(this.password).digest('hex');
        this.password = hash;
    }
    next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;
