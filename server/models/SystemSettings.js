import mongoose from "mongoose";

const systemSettingsSchema = new mongoose.Schema({
    settingKey: {
        type: String,
        required: true,
        unique: true,
        enum: ['completion_form_url']
    },
    settingValue: {
        type: String,
        required: true
    },
    lastUpdatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    lastUpdatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

export default mongoose.model('SystemSettings', systemSettingsSchema);