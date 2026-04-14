import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['employee', 'admin'],
    default: 'employee'
  },
  isApproved: {
    type: Boolean,
    default: true
  },
  avatar: {
    type: String,
    default: null
  },
  xp: {
    type: Number,
    default: 0
  },
  level: {
    type: Number,
    default: 1
  },
  completedTopics: [{
    topicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Topic'
    },
    mandatoryCompleted: {
      type: Boolean,
      default: false
    },
    bonusCompleted: {
      type: Boolean,
      default: false
    },
    bonusCorrect: {
      type: Number,
      default: 0
    },
    completedAt: {
      type: Date,
      default: Date.now
    }
  }],
  badges: [{
    topicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Topic'
    },
    badgeName: {
      type: String,
      default: ''
    },
    badgeImage: {
      type: String,
      default: ''
    },
    earnedAt: {
      type: Date,
      default: Date.now
    },
    badgeCount: {
      type: Number,
      default: 1,
      min: 1
    }
  }]
}, {
  timestamps: true
});

// Hash Password using bcrypt
userSchema.pre('save', async function(next) {
  if(!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;