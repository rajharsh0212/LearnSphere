import { createContext, useEffect, useState, useContext} from "react";
import { dummyCourses } from "../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";
import humanizeDuration from "humanize-duration";
import { AuthContext } from "./AuthContext";

export const AppContext = createContext()

export const AppContextProvider= ({ children }) => {
     
  const currency= import.meta.env.VITE_CURRENCY; // Default currency symbol, can be changed based on user preference or locale
  const backendUrl = import.meta.env.VITE_BACKEND_URL
  const { auth, logout } = useContext(AuthContext);

  const [allcourses, setAllCourses] = useState([]); // State to hold all courses
  const [userData, setUserData] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  const resetAppContext = () => {
    // This function will be called on logout to reset context state
    // For now, it's a placeholder. If you add more user-specific state
    // to this context, add the reset logic here.
    console.log("App context has been reset.");
  };

  // This is the global logout handler
  const handleLogout = () => {
    logout(resetAppContext);
  };

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          handleLogout();
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [logout]);

  const fetchCourses = async () => {
    try {
      const {data}= await axios.get(`${backendUrl}/api/course/all`);
      if(data.success){
        setAllCourses(data.courses);
      }
      else
      {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }
  const fetchUserData = async () => {
    try {
      if (!auth.token) {
        console.error("No token found");
        setUserData(null);
        return;
      }
      const { data } = await axios.get(`${backendUrl}/api/user/data`, {
        headers: {
          Authorization: `Bearer ${auth.token}`
        }
      });
      if (data.success) {
        setUserData(data.user);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  const fetchUserEnrolledCourse = async () => {
    // setEnrolledCourses(dummyCourses.filter(course => course.enrolledStudents.includes('user_2qQlvXyr02B4Bq6hT0Gvaa5fT9V')));
    try {
      if (!auth.token) return;
      const { data } = await axios.get(`${backendUrl}/api/user/enrolled-courses`, {
        headers: {
          Authorization: `Bearer ${auth.token}`
        }
      })
      if (data.success) {
        setEnrolledCourses(data.enrolledCourses.reverse());
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (auth.token && auth.user) {
      fetchUserData();
      fetchUserEnrolledCourse();
    }
    else {
      setUserData(null);
      setEnrolledCourses([]);
    }
  }, [auth]);
  const calculateAverageRating = (course) => {
    if (!course || !course.courseRatings || course.courseRatings.length === 0) {
      return 0;
    }
    let totalrating = 0;
    course.courseRatings.forEach((rating) => {
      totalrating += rating.rating;
    });
    return (totalrating / course.courseRatings.length).toFixed(1);
  }
  const calculateCourseChapterTime = (chapter) => {
    const totalDuration = chapter.chapterContent.reduce((acc, lecture) => acc + lecture.lectureDuration, 0);
    return humanizeDuration(totalDuration * 60 * 1000, { units: ['h', 'm'], round: true });
  };

  // Functin to calculate course duration
  const calculateCourseDuration = (course) => {
    let time = 0;
    course.courseContent.forEach(chapter => {
      time += chapter.chapterContent.reduce((acc, lecture) => acc + lecture.lectureDuration, 0);
    });
    return humanizeDuration(time * 60 * 1000, { units: ['h', 'm'], round: true });
  };

  // Function to calculate to no of lectures in a course
  const calculateNoOfLectures = (course) => {
    if (!course || !course.courseContent || !Array.isArray(course.courseContent)) {
      return 0;
    }
    let lectures = 0;
    course.courseContent.forEach(chapter => {
      if (chapter && chapter.chapterContent && Array.isArray(chapter.chapterContent)) {
        lectures += chapter.chapterContent.length;
      }
    });
    return lectures;
  };
  const value={
        currency,allcourses,calculateAverageRating,calculateCourseChapterTime,calculateCourseDuration,calculateNoOfLectures,
        backendUrl,enrolledCourses,fetchUserEnrolledCourse,
        userData, setUserData, fetchCourses, fetchUserData,
        handleLogout
    }
    return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}