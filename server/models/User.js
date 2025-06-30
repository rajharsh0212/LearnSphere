import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  roles: {
    student: { type: Boolean, default: false },
    educator: { type: Boolean, default: false }
  },
  enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  createdCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  chatHistory: [
    {
      sender: { type: String, enum: ['user', 'ai'], required: true },
      text: { type: String, required: true },
      timestamp: { type: Date, default: Date.now }
    }
  ],
  quizHistory: [
    {
      quizTitle: { type: String, required: true },
      topics: { type: String },
      score: { type: Number, required: true },
      totalQuestions: { type: Number, required: true },
      date: { type: Date, default: Date.now },
      questions: [
        {
          question: String,
          options: [String],
          correctAnswer: String,
          userAnswer: String,
          explanation: String,
        }
      ]
    }
  ]
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;
