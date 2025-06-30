import React, { useState, useContext, useEffect } from 'react';
import { FiChevronDown, FiRefreshCw, FiCheckCircle, FiXCircle, FiEdit, FiList } from 'react-icons/fi';
import Footer from '../../components/student/Footer';
import { AppContext } from '../../context/AppContext';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const AiQuizTaker = () => {
  const [activeView, setActiveView] = useState('attempt'); // 'attempt' or 'history'
  const [difficulty, setDifficulty] = useState('Medium');
  const [topics, setTopics] = useState('');
  const [currentQuizTopics, setCurrentQuizTopics] = useState('');
  const [numQuestions, setNumQuestions] = useState(5);
  const [quiz, setQuiz] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userAnswers, setUserAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [quizHistory, setQuizHistory] = useState([]);
  const [expandedHistory, setExpandedHistory] = useState(null);
  const { backendUrl } = useContext(AppContext);
  const { auth } = useContext(AuthContext);

  const fetchQuizHistory = async () => {
    if (!auth.token) return;
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/quiz-history`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      if (data.success) {
        setQuizHistory(data.quizHistory);
      }
    } catch (error) {
      console.error("Could not load quiz history.", error);
      toast.error("Could not load quiz history.");
    }
  };

  useEffect(() => {
    if (auth.token) {
        fetchQuizHistory();
    }
  }, [auth.token]);

  const handleGenerateQuiz = async (e) => {
    e.preventDefault();
    if (!auth.token) return toast.error("Please log in to generate a quiz.");

    setIsLoading(true);
    setQuiz(null);
    setScore(null);
    setUserAnswers({});
    setCurrentQuizTopics(topics); // Save topics for this specific quiz

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/ai/generate-quiz`,
        { topics, difficulty, numQuestions },
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );

      if (data.success) {
        setQuiz(data.quiz);
      } else {
        toast.error(data.message || "Failed to generate the quiz.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred while generating the quiz.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerChange = (questionId, answer) => {
    setUserAnswers({ ...userAnswers, [questionId]: answer });
  };

  const handleQuizSubmit = async (e) => {
    e.preventDefault();
    let correctAnswers = 0;
    quiz.questions.forEach(q => {
      if (userAnswers[q.id] === q.correctAnswer) correctAnswers++;
    });
    setScore(correctAnswers);

    const quizAttempt = {
      quizTitle: quiz.title,
      topics: currentQuizTopics,
      score: correctAnswers,
      totalQuestions: quiz.questions.length,
      questions: quiz.questions.map(q => ({
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        userAnswer: userAnswers[q.id] || "Not Answered",
        explanation: q.explanation,
      })),
    };

    try {
      await axios.post(`${backendUrl}/api/user/save-quiz`, quizAttempt, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      toast.success("Quiz attempt saved!");
      fetchQuizHistory();
    } catch (error) {
      toast.error("Could not save your quiz attempt.");
    }
    window.scrollTo(0, 0);
  };

  const handleReset = () => {
    setQuiz(null);
    setScore(null);
    setUserAnswers({});
    setTopics('');
    setCurrentQuizTopics('');
  };

  const toggleHistory = (index) => {
    setExpandedHistory(expandedHistory === index ? null : index);
  };
  
  const QuestionReview = ({ questions }) => (
    <div className="space-y-6">
      {questions.map((q, index) => {
        const isCorrect = q.userAnswer === q.correctAnswer;
        return (
          <div key={index} className={`p-6 rounded-lg border ${isCorrect ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'}`}>
            <p className="text-lg font-semibold text-gray-800 mb-4">{index + 1}. {q.question}</p>
            <div className="space-y-2 mb-4">
              {q.options.map((option, i) => {
                const isUserAnswer = q.userAnswer === option;
                const isTheCorrectAnswer = q.correctAnswer === option;
                let optionStyle = 'border-gray-300';
                if (isTheCorrectAnswer) optionStyle = 'border-green-500 bg-green-100';
                if (isUserAnswer && !isCorrect) optionStyle = 'border-red-500 bg-red-100';
                return (
                  <div key={i} className={`flex items-center p-3 rounded-md border ${optionStyle}`}>
                    {isUserAnswer && !isCorrect && <FiXCircle className="text-red-600 mr-2 flex-shrink-0" />}
                    {isTheCorrectAnswer && <FiCheckCircle className="text-green-600 mr-2 flex-shrink-0" />}
                    <span className="text-gray-700">{option}</span>
                  </div>
                );
              })}
            </div>
            {!isCorrect && q.explanation && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-semibold text-yellow-800">Explanation</h4>
                <p className="text-yellow-700">{q.explanation}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  const renderSetup = () => (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
      <h1 className="text-3xl font-bold text-gray-800 text-center mb-2">AI Quiz Generator</h1>
      <p className="text-gray-600 text-center mb-8">Customize your quiz to test your knowledge.</p>
      <form onSubmit={handleGenerateQuiz} className="space-y-6">
        <div><label htmlFor="topics" className="block text-sm font-medium text-gray-700 mb-1">Topics</label><input id="topics" type="text" value={topics} onChange={(e) => setTopics(e.target.value)} placeholder="e.g., React Hooks, JavaScript ES6" className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none transition" required /></div>
        <div className="flex flex-col md:flex-row gap-6"><div className="flex-1"><label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label><div className="relative"><select id="difficulty" value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="w-full appearance-none bg-white px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none transition"><option>Easy</option><option>Medium</option><option>Hard</option></select><FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" /></div></div><div className="flex-1"><label htmlFor="numQuestions" className="block text-sm font-medium text-gray-700 mb-1">Number of Questions</label><input id="numQuestions" type="number" value={numQuestions} onChange={(e) => setNumQuestions(e.target.value)} min="1" max="20" className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none transition" /></div></div>
        <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-transform duration-200 active:scale-95 disabled:bg-gray-400" disabled={isLoading}>{isLoading ? 'Generating Quiz...' : 'Generate Quiz'}</button>
      </form>
    </div>
  );

  const renderQuiz = () => (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">{quiz.title}</h2>
      <form onSubmit={handleQuizSubmit} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 space-y-8">
        {quiz.questions.map((q, index) => (
          <div key={q.id} className="border-b border-gray-200 pb-6 last:border-b-0">
            <p className="text-lg font-semibold text-gray-800 mb-4">{index + 1}. {q.question}</p>
            <div className="space-y-3">
              {q.options.map((option, i) => (
                <label key={i} className="flex items-center p-3 rounded-lg hover:bg-gray-100 transition cursor-pointer">
                  <input type="radio" name={`question-${q.id}`} value={option} onChange={() => handleAnswerChange(q.id, option)} className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" required />
                  <span className="ml-3 text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
        <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-transform duration-200 active:scale-95">Submit Quiz</button>
      </form>
    </div>
  );

  const renderResults = () => (
    <div className="max-w-4xl mx-auto">
      <div className="text-center bg-white p-8 rounded-2xl shadow-lg border border-gray-200 mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Quiz Results</h2>
        <p className="text-5xl font-extrabold text-blue-600 mb-4">{score} <span className="text-3xl text-gray-500">/ {quiz.questions.length}</span></p>
        <p className="text-lg text-gray-600 mb-8">You answered {(((score / quiz.questions.length) * 100).toFixed(0))}% of the questions correctly.</p>
        <button onClick={handleReset} className="flex items-center justify-center gap-2 mx-auto bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-transform duration-200 active:scale-95"><FiRefreshCw />Take Another Quiz</button>
      </div>
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-gray-800">Review Your Answers</h3>
        <QuestionReview questions={quiz.questions.map(q => ({ ...q, userAnswer: userAnswers[q.id] || "Not Answered" }))} />
      </div>
    </div>
  );

  const renderAttemptView = () => {
    if (score !== null) return renderResults();
    if (quiz) return renderQuiz();
    return renderSetup();
  };

  const renderHistoryView = () => (
    <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Your Quiz History</h2>
        {quizHistory.length === 0 ? (
            <div className="text-center bg-white p-8 rounded-lg shadow-sm border"><p className="text-gray-500">You haven't attempted any quizzes yet.</p></div>
        ) : (
            <div className="space-y-4">
                {quizHistory.map((attempt, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition" onClick={() => toggleHistory(index)}>
                            <div>
                                <h3 className="font-semibold text-gray-800">{attempt.quizTitle}</h3>
                                {attempt.topics && <p className="text-xs text-gray-500 mt-1">Topics: <span className="font-medium">{attempt.topics}</span></p>}
                                <p className="text-sm text-gray-500 mt-1">{new Date(attempt.date).toLocaleDateString()}</p>
                            </div>
                            <div className="flex items-center gap-4">
                              <p className="font-bold text-lg text-blue-600">{attempt.score} / {attempt.totalQuestions}</p>
                              <FiChevronDown className={`transform transition-transform ${expandedHistory === index ? 'rotate-180' : ''}`} />
                            </div>
                        </div>
                        {expandedHistory === index && (
                            <div className="p-6 border-t border-gray-200 bg-gray-50">
                                <QuestionReview questions={attempt.questions} />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        )}
    </div>
  );
  
  const SidebarButton = ({ icon, label, viewName }) => (
    <button
      onClick={() => setActiveView(viewName)}
      className={`flex items-center w-full text-left px-4 py-3 rounded-lg transition ${
        activeView === viewName
          ? 'bg-blue-100 text-blue-600 font-bold'
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      {icon}
      <span className="ml-3">{label}</span>
    </button>
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
        <div className="flex-grow pt-28 pb-16">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row gap-8">
                    <aside className="w-full md:w-64">
                        <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200">
                            <nav className="space-y-2">
                                <SidebarButton icon={<FiEdit size={20} />} label="Attempt Quiz" viewName="attempt" />
                                <SidebarButton icon={<FiList size={20} />} label="Quiz History" viewName="history" />
                            </nav>
                        </div>
                    </aside>
                    <main className="flex-1">
                        {activeView === 'attempt' && renderAttemptView()}
                        {activeView === 'history' && renderHistoryView()}
                    </main>
                </div>
            </div>
        </div>
        <Footer />
    </div>
  );
};

export default AiQuizTaker;