import mongoose from 'mongoose';

const systemSettingsSchema = new mongoose.Schema({
    completionFormUrl: {
        type: String,
        default: 'https://forms.google.com/'
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('SystemSettings', systemSettingsSchema);