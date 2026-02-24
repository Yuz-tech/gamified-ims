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
<<<<<<< HEAD
    default: 100,
    immutable: true
  },
  passingScore: {
    type: Number,
    default: 70,
    immutable: true
=======
    default: 100, // Fixed at 100
    immutable: true // Cannot be changed after creation
  },
  passingScore: {
    type: Number,
    default: 70, // Fixed at 70%
    immutable: true // Cannot be changed after creation
>>>>>>> 89f8048d986123cee6cc49a2a072d2656ad05db4
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

<<<<<<< HEAD
topicSchema.pre('save', function(next) {
  if (this.questions.length === 0) {
    next(new Error('TOpic must have at least one question'));
=======
// Validation: Must have at least 1 question
topicSchema.pre('save', function(next) {
  if (this.questions.length === 0) {
    next(new Error('Topic must have at least one question'));
>>>>>>> 89f8048d986123cee6cc49a2a072d2656ad05db4
  } else {
    next();
  }
});

const Topic = mongoose.model('Topic', topicSchema);

export default Topic;