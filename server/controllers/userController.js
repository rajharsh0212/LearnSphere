import Stripe from "../configs/stripe.js";
import Course from "../models/course.js";
import Purchase from "../models/purchase.js";
import User from "../models/User.js";


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

    // If user isn't authenticated, return a 401 error
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const user = await User.findById(userId).populate({
      path: "enrolledCourses",
    });

    if (!user) {
      return res.status(404).json("User not found!");
    }

    const courseData = await Course.findById(courseId);

    if (!courseData) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    const purchaseData = {
      courseId: courseData._id,
      userId: user._id,
      amount: (
        courseData.coursePrice -
        (courseData.coursePrice * courseData.discount) / 100
      ).toFixed(2),
    };

    const newPurchase = await Purchase.create(purchaseData);

    // Stripe payment gateway integration
    const line_items = [
      {
        price_data: {
          currency: process.env.CURRENCY.toLowerCase(),
          product_data: {
            name: courseData.courseTitle,
          },
          unit_amount: Math.floor(
            newPurchase.amount
          ) * 100,
        },
        quantity: 1
      },
    ];

    const params = {
      metadata: {
        purchaseId: newPurchase._id.toString(),
      },
      line_items: line_items,
      success_url: `${origin}/loading/my-enrollments`,
      cancel_url: `${origin}/`,
    };

    const session = await Stripe.checkout.sessions.create(params);

    if (!session.url) {
      return res
        .status(400)
        .json({ success: false, message: "Error while creating session" });
    }


    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to purchase course" });
  }
};