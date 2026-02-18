import mongoose from 'mongoose';

const badgeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
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
  }
}, {
  timestamps: true
});

const Badge = mongoose.model('Badge', badgeSchema);

export default Badge;