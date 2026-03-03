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
  documentUrl: {
    type: String,
    required: true
  },
  videoUrl: {
    type: String,
    required: true
  },
  order: {
    type: Number,
    required: true,
    default: 0
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
    isMandatory: {
      type: Boolean,
      default: false
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

//Validation Logic (A topic must have 5 questions max [1 required + 4 bonus])
topicSchema.pre('save', function(next) {
  if(this.questions.length !== 5) {
    next(new Error('Topic must have exactly 5 questions'));
  } else {
    if(this.questions.length > 0) {
      this.questions[0].isMandatory = true;
    }
    next();
  }
});

const Topic = mongoose.model('Topic', topicSchema);

export default Topic;