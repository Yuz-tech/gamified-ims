import mongoose from 'mongoose';

const badgeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  topicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topic',
    required: true
  },
  year: {
    type: Number,
    required: true,
    default: () => new Date().getFullYear()
  },
  isActive: {
    type: Boolean,
    default: true
  },
  badgeCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

badgeSchema.index({ topicId: 1, year: 1}, { unique: true });

const Badge = mongoose.model('Badge', badgeSchema);

export default Badge;