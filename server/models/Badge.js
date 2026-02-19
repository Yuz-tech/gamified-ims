import mongoose from 'mongoose';

const badgeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        // Must be a valid URL or start with /uploads/
        return /^(http|https|\/uploads\/)/.test(v);
      },
      message: 'Badge must have a valid image URL'
    }
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
  }
}, {
  timestamps: true
});

badgeSchema.index({ topicId: 1, year: 1}, { unique: true });

const Badge = mongoose.model('Badge', badgeSchema);

export default Badge;