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
    default: false
  },
  requestedAt: {
    type: Date,
    default: Date.now
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
    year: {
      type: Number,
      default: () => new Date().getFullYear()
    },
    completedAt: {
      type: Date,
      default: Date.now
    },
    score: Number
  }],

  badges: [{
    badgeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Badge'
    },
    year: {
      type: Number,
      default: () => new Date().getFullYear()
    },
    earnedAt: {
      type: Date,
      default: Date.now
    }
  }],

  watchedVideos: [{
    topicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Topic'
    },
    year: {
      type: Number,
      default: () => new Date().getFullYear ()
    },
    completedAt: {
      type: Date,
      default: Date.now
    }
  }],

  yearlyArchive: [{
    year: Number,
    completedTopics: Number,
    badgesEarned: Number,
    xpEarned: Number,
    archivedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

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

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.calculateLevel = function() {
  this.level = Math.floor(Math.sqrt(this.xp/100)) + 1;
  return this.level;
};

userSchema.methods.getCurrentYearProgress = function() {
  const currentYear = new Date().getFullYear();
  return {
    completedTopics:
    this.completedTopics.filter(ct => ct.year === currentYear),
    badges: this.badges.filter(b => b.year === currentYear),
    watchedVideos:
    this.watchedVideos.filter(wv => wv.year === currentYear)
  };
};

userSchema.methods.isTopicCompletedThisYear = function(topicId) {
  const currentYear = new Date().getFullYear();
  return this.completedTopics.some(
    ct => ct.topicId.toString() === topicId.toString() && ct.year === currentYear
  );
};

userSchema.methods.isVideoWatchedThisYear = function(topicId) {
  const currentYear = new Date().getFullYear();
  return this.watchedVideos.some(
    wv => wv.topicId.toString() === topicId.toString() && wv.year === currentYear
  );
};

const User = mongoose.model('User', userSchema);

export default User;