import Course from "../models/course.js";
import CourseProgress from "../models/courseProgress.js";
import Purchase from "../models/purchase.js";
import User from "../models/User.js";
import Stripe from "../configs/stripe.js";

// get user data
export const getUserData = async (req, res) => {
  try {
    const userId = req.user?.id

    // If user isn't authenticated, return a 401 error
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json("User not found!");
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch users" });
  }
};

// users enrolled courses with lecture links
export const userEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user?.id;

    // If user isn't authenticated, return a 401 error
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const user = await User.findById(userId).populate({ path: "enrolledCourses" });

    if (!user) {
      return res.status(404).json("User not found!");
    }

    res.json({ success: true, enrolledCourses: user.enrolledCourses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch courses" });
  }
};

// purchase course
export const purchaseCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const { origin } = req.headers;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const user = await User.findById(userId).populate("enrolledCourses");
    if (!user) return res.status(404).json("User not found!");

    const courseData = await Course.findById(courseId);
    if (!courseData)
      return res.status(404).json({ success: false, message: "Course not found" });

    const alreadyPurchased = await Purchase.findOne({
      userId,
      courseId,
      status: "completed",
    });

    if (alreadyPurchased) {
      return res.status(400).json({
        success: false,
        message: "You have already purchased this course.",
      });
    }

    const amount = Number((
      courseData.coursePrice - (courseData.coursePrice * courseData.discount) / 100
    ).toFixed(2));

    const newPurchase = await Purchase.create({
      courseId,
      userId,
      amount,
    });

    const line_items = [
      {
        price_data: {
          currency: process.env.CURRENCY.toLowerCase(),
          product_data: {
            name: courseData.courseTitle,
            images: [courseData.courseThumbnail],
          },
          unit_amount: Math.round(amount * 100),
        },
        quantity: 1,
      },
    ];

    const params = {
      submit_type: "pay",
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: user.email,
      metadata: {
        userId: userId.toString(),
        purchaseId: newPurchase._id.toString(),
        courseId: courseId.toString(),
      },
      line_items,
      success_url: `${origin}/loading/my-enrollments`,
      cancel_url: `${origin}/`,
    };

    const session = await Stripe.checkout.sessions.create(params);

    if (!session.url) {
      console.error("Stripe session failed:", session);
      return res
        .status(400)
        .json({ success: false, message: "Error while creating Stripe session" });
    }

    newPurchase.paymentId = session.id;
    await newPurchase.save();

    res.json({ success: true, session_url: session.url });

  } catch (error) {
    console.error("Error in purchaseCourse:", error);
    res.status(500).json({ success: false, message: "Failed to purchase course" });
  }
};

export const updateUserCourseProgress = async (req, res) => {
    try {
        const userId = req.user?.id;
        const {courseId,lectureId}= req.body;
        const progressData = await CourseProgress.findOne({ userId, courseId });
        if(progressData)
        {
            if(progressData.lectureCompleted.includes(lectureId)) {
                return res.status(400).json({ message: "Lecture already completed" });
            }
            progressData.lectureCompleted.push(lectureId);
            await progressData.save();
        }
        else {
            const newProgress = new CourseProgress({
                userId,
                courseId,
                lectureCompleted: [lectureId],
            });
            await newProgress.save();
        }
        res.json({ success: true, message: "Progress updated successfully" });
    } catch (error) {
        res.json({ success: false, message: "Failed to update progress" });
        console.error(error);
    }
}

export const getUserCourseProgress = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { courseId } = req.params;
    
        // If user isn't authenticated, return a 401 error
        if (!userId) {
        return res.status(401).json({ error: "User not authenticated" });
        }
    
        const progressData = await CourseProgress.findOne({ userId, courseId });
    
        if (!progressData) {
        return res.status(404).json({ success: false, message: "No progress found for this course" });
        }
    
        res.json({ success: true,progressData});
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to fetch course progress" });
    }
}

//add user ratings to course
export const addUserRating = async (req, res) => {
  try {
    const { courseId, rating} = req.body;
    const userId = req.user?.id; // assuming userId is set in the request by auth middleware
    // If user isn't authenticated, return a 401 error
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const course = await Course.findById(courseId);
    if (!course) {
        return res.status(404).json("Course not found!");
    }
    const user = await User.findById(userId);
    if (!user || !user.roles.student || !user.enrolledCourses.includes(courseId)) {
      return res.status(404).json("User not found!");
    }
    
    // Check if user has already rated this course
    const existingRating = course.courseRatings.findIndex(r => r.userId === userId);
    if(existingRating !== -1) {
        course.courseRatings[existingRating].rating = rating;
    }
    else {
        course.courseRatings.push({ userId, rating });
    }

    await course.save();
    res.json({ success: true, message: "Rating added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to add rating" });
  }
};

// add comment to course
export const addUserComment = async (req, res) => {
  try {
    const { courseId, comment } = req.body;
    const userId = req.user?.id; // assuming userId is set in the request by auth middleware
    // If user isn't authenticated, return a 401 error
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const course = await Course.findById(courseId);
    if (!course) {
        return res.status(404).json("Course not found!");
    }
    const user = await User.findById(userId);
    if (!user || !user.roles.student || !user.enrolledCourses.includes(courseId)) {
      return res.status(404).json("User not found!");
    }
    
    // Check if user has already commented on this course
    const existingComment = course.courseRatings.findIndex(c => c.userId === userId);
    if(existingComment !== -1) {
        if(course.courseRatings[existingComment].comment) {
            return res.status(400).json({ message: "You have already commented on this course" });
        }
        course.courseRatings[existingComment].comment = comment;
    }
    else {
        course.courseRatings.push({ userId, comment });
    }
    await course.save();
    res.json({ success: true, message: "Comment added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to add comment" });
  }
};

export const getChatHistory = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json("User not found!");
    }

    res.json({ success: true, chatHistory: user.chatHistory });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch chat history" });
  }
};

export const deleteChatHistory = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.chatHistory = [];
    await user.save();

    res.json({ success: true, message: "Chat history cleared successfully." });
  } catch (error) {
    console.error("Error clearing chat history:", error);
    res.status(500).json({ success: false, message: "Failed to clear chat history" });
  }
};

export const saveQuizAttempt = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { quizTitle, topics, score, totalQuestions, questions } = req.body;

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const quizAttempt = {
      quizTitle: quizTitle || `Quiz on ${topics}`,
      topics,
      score,
      totalQuestions,
      questions,
      date: new Date(),
    };

    user.quizHistory.push(quizAttempt);
    await user.save();

    res.json({ success: true, message: "Quiz attempt saved successfully." });
  } catch (error) {
    console.error("Error saving quiz attempt:", error.message);
    res.status(500).json({ 
      success: false, 
      message: "Failed to save quiz attempt.",
      error: error.message // Send back the specific error
    });
  }
};

export const getQuizHistory = async (req, res) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ error: "User not authenticated" });
        }

        const user = await User.findById(userId).select('quizHistory');

        if (!user) {
            return res.status(404).json("User not found!");
        }

        res.json({ success: true, quizHistory: user.quizHistory.reverse() });
    } catch (error) {
        console.error("Error fetching quiz history:", error);
        res.status(500).json({ success: false, message: "Failed to fetch quiz history" });
    }
};