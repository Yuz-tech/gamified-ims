import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    token: {
        type: String,
        required: true,
        unique: true
    },
    deviceInfo: {
        userAgent: String,
        ipAddress: String,
        deviceType: String,
        browser: String,
        os: String
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lastActivity: {
        type: Date,
        default: Date.now
    },
    expiresAt: {
        type: Date,
        required: true,
        index: true
    }
}, {
    timestamps: true
});

sessionSchema.index({ expiresAt: 1 }, { expiresAfterSeconds: 0 });

sessionSchema.methods.updateActivity=function() {
    this.lastActivity = new Date();
    return this.save();
};

const Session = mongoose.model('Session', sessionSchema);

export default Session;