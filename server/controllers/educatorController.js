import Course from "../models/course.js";
import User from "../models/User.js";
import Purchase from "../models/purchase.js";
import { v2 as cloudinary } from "cloudinary";

export const addCourse = async (req, res) => {
  try {
    const { courseData } = req.body;
    const imageFile = req.file; // using with multer middleware use diskStorage
    const userId = req.user?.id; // assuming userId is set in the request by auth middleware

    // If user isn't authenticated, return a 401 error
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const user = await User.findOne(userId);

    if (!user) {
      return res.status(404).json("User not found!");
    }


    if (!imageFile) {
      return res
        .status(400)
        .json({ success: false, message: "Course image is required" });
    }

    const parsedCourseData = JSON.parse(courseData);
    parsedCourseData.educator = userId; // Set the educator field to the user's ID

    const result = await cloudinary.uploader
      .upload(imageFile.path, {
        use_filename: true,
        folder: "mern-lms",
      })
      .catch((error) => {
        throw new Error(error.message);
      });
    parsedCourseData.courseThumbnail = result.secure_url;
    console.log(parsedCourseData);
    const newCourse = new Course(parsedCourseData);

    await newCourse.save();

    res
      .status(200)
      .json({ success: true, message: "Course created successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to create course" });
  }
};

export const getEducatorCourses = async (req, res) => {
    try {
        const educator= req.user?.id; // assuming userId is set in the request by auth middleware
        if (!educator) {
            return res.status(401).json({ error: "User not authenticated" });
        }
        const courses = await Course.find({ educator })
        res.json({success: true, courses });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to fetch courses" });
    }
}

export const educatorDashboardData= async()=>{
    try
    {
        const educator=req.user?.id; 
        const courses= await Course.find({educator}); 
        const totalCourses=courses.length; 
        
        const courseIds = courses.map((course) => course._id); 

        // assuming userId is set in the request by auth middleware

        const purchases= await Purchase.find(
            {
                courseId: { $in: courseIds },
                status: "completed"
            }
        );
        const totalEarnings = purchases.reduce((total, purchase) => total + purchase.amount, 0);

        const enrolledStudentsData = [];
        for (const course of courses) {
          const students = await UserModel.find(
            { _id: { $in: course.enrolledStudents } },
            "name imageUrl"
          );
          students.forEach((student) => {
            enrolledStudentsData.push({ student, courseTitle: course.courseTitle });
          });
        }

        const enrolledStudents = purchasedCourses.reduce((acc, purchased) => {
          if (!acc[purchased.userId]) {
            acc[purchased.userId] = [purchased.courseId];
          } else {
            acc[purchased.userId].push(purchased.courseId);
          }
          return acc;
        }, {});

        res.json({
          success: true,
          dashboardData: {
            totalEarnings,
            totalCourses,
            enrolledStudentsData,
            enrolledStudents
          },
        });
      } catch (error) {
        console.error(error);
        res
          .status(500)
          .json({ success: false, message: "Failed to fetch dashboard data" });
      }
    };

export const getEnrolledStudentsData = async (req, res) => {
  try {
    const userId = req.auth.userId;

    // If user isn't authenticated, return a 401 error
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const user = await UserModel.findOne({ clerkUserId: userId });

    if (!user) {
      return res.status(404).json("User not found!");
    }

    const courses = await CourseModel.find({ educator: user._id });

    const courseIds = courses.map((course) => course._id);

    // get all purchased courses
    const purchasedCourses = await PurchaseModel.find({
      courseId: { $in: courseIds },
      status: "completed",
    }).populate("userId", "name imageUrl").populate("courseId", "courseTitle");

    const enrolledStudentsData = purchasedCourses.map((purchased) => {
      return {
        student: purchased.userId,
        courseTitle: purchased.courseId.courseTitle,
        purchasedAt: purchased.createdAt,
      };
    });

    res.json({
      success: true,
      enrolledStudentsData,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch enrolled students data" });
  }
};