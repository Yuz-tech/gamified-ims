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
    type: Number, // in seconds
    required: true
  },
  order: {
    type: Number,
    required: true,
    default: 0
  },
  xpReward: {
    type: Number,
    default: 100,
    immutable: true
  },
  passingScore: {
    type: Number,
    default: 70,
    immutable: true
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
      type: Number, // index of correct option
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

topicSchema.pre('save', function(next) {
  if (this.questions.length === 0) {
    next(new Error('TOpic must have at least one question'));
  } else {
    next();
  }
});

const Topic = mongoose.model('Topic', topicSchema);

export default Topic;