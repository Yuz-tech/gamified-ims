import mongoose from 'mongoose';

const badgeSchema = new mongoose.Schema({
  name: {
    type: String,
<<<<<<< HEAD
    required: true,
=======
    required: true
>>>>>>> 89f8048d986123cee6cc49a2a072d2656ad05db4
  },
  description: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
    // Removed strict URL validation to allow /uploads/ paths
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