import { GoogleGenerativeAI } from "@google/generative-ai";
import User from "../models/User.js";

// Initialize the Google Generative AI client with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateDoubtSolution = async (req, res) => {
    try {
        const { prompt } = req.body;
        const userId = req.user?.id;

        if (!prompt) {
            return res.status(400).json({ success: false, message: "Prompt is required." });
        }

        // For text-only input, use a current and recommended model
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Save conversation to the database
        await User.findByIdAndUpdate(userId, {
            $push: {
                chatHistory: [
                    { sender: 'user', text: prompt },
                    { sender: 'ai', text: text }
                ]
            }
        });

        res.json({ success: true, answer: text });

    } catch (error) {
        console.error("Error generating AI response:", error);
        res.status(500).json({
            success: false,
            message: "Failed to generate AI response.",
            error: error.message
        });
    }
};

export const generateQuiz = async (req, res) => {
    try {
        const { topics, difficulty, numQuestions } = req.body;

        if (!topics || !difficulty || !numQuestions) {
            return res.status(400).json({ success: false, message: "Missing required fields." });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
            Generate a multiple-choice quiz based on the following criteria:
            - Topics: ${topics}
            - Difficulty: ${difficulty}
            - Number of Questions: ${numQuestions}

            The response must be a valid JSON object only, with no additional text or explanations. 
            The JSON object should have a "questions" key, which is an array of objects.
            Each question object must have the following keys: "id" (a unique number), "question" (the question text), "options" (an array of 4 strings), "correctAnswer" (a string that exactly matches one of the options), and "explanation" (a brief explanation of why the answer is correct).
            
            Example format:
            {
              "questions": [
                {
                  "id": 1,
                  "question": "What is the capital of France?",
                  "options": ["Berlin", "Madrid", "Paris", "Rome"],
                  "correctAnswer": "Paris",
                  "explanation": "Paris is the capital and most populous city of France."
                }
              ]
            }
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean up the response to ensure it's valid JSON
        const cleanedText = text.replace(/```json|```/g, '').trim();
        const quiz = JSON.parse(cleanedText);

        res.json({ success: true, quiz });

    } catch (error) {
        console.error("Error generating quiz:", error);
        res.status(500).json({
            success: false,
            message: "Failed to generate quiz.",
            error: error.message
        });
    }
}; 