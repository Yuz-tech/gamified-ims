import mongoose from 'mongoose';

const topicSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  videoUrl: {
    type: String,
    required: true
  },
  videoDuration: {
    type: Number,
    required: true
  },
  order: {
    type: Number,
    required: true,
    default: 0
  },
  xpReward: {
    type: Number,
    default: 100
  },
  passingScore: {
    type: Number,
    required: true,
    default: 70
  },
  questions: [{
    question: {
      type: String,
      required: true
    },
    options: [{
      type: String,
      required: true
    }],
    correctAnswer: {
      type: Number,
      required: true
    },
    points: {
      type: Number,
      default: 10
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const Topic = mongoose.model('Topic', topicSchema);

export default Topic;