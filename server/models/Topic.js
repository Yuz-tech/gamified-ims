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
      type: Number,
      required: true
    },
    explanation: {
      type: String,
      default: ''
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

// One topic must have atleast one question
topicSchema.pre('save', function(next) {
  if(this.questions.length === 0) {
    next(new Error('Topic must have atleast one question'));
  } else {
    next();
  }
});

const Topic = mongoose.model('Topic', topicSchema);

export default Topic;