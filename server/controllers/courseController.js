import Course from "../models/course.js";
import Purchase from "../models/purchase.js";
import User from "../models/User.js";


// get all courses
export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isPublished: true })
      .select(["-courseContent", "-enrolledStudents"])
      .populate({ path: "educator" });
    res.json({ success: true, courses });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch courses" });
  }
};

// get course by id
export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate({
        path: "educator",
      })
      .populate({
        path: "courseRatings.userId",
        select: "name imageUrl",
      });

    // remove lectureUrl if isPreviewFree is false

    course.courseContent.forEach((chapter) => {
      chapter.chapterContent.forEach((lecture) => {
        if (!lecture.isPreviewFree) {
          lecture.lectureUrl = "";
        }
      });
    });

    // calculate days left at this price
    let daysLeft = null;
    if (course.discountEndDate) {
      const currentDate = new Date();
      const discountEndDate = new Date(course.discountEndDate.toString());
      const timeDiff = discountEndDate - currentDate;
      daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    }

    res.json({ success: true, course, daysLeft });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch course" });
  }
};

export const getCourseDetailWithPurchaseStatus = async (req, res) => {
  try {
    const { courseId } = req.params;

    const userId = req.user?.id;
    console.log(userId);

    // If user isn't authenticated, return a 401 error
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const user = await User.findOne({ clerkUserId: userId });

    if (!user) {
      return res.status(404).json("User not found!");
    }

    const course = await Course.findById(courseId)
      .populate({ path: "educator" })
      .populate({ path: "enrolledStudents" });

    const purchased = await Purchase.findOne({
      userId: user._id,
      courseId,
    });

    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "course not found!" });
    }

    return res.status(200).json({
      success: true,
      course,
      purchased: !!purchased, // true if purchased, false otherwise
    });
  } catch (error) {
    console.log(error);
  }
};