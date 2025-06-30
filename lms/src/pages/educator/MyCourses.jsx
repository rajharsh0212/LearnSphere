import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import Loading from "../../components/student/Loading";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { assets } from "../../assets/assets";

const MyCourses = () => {
  const { currency, backendUrl } = useContext(AppContext);
  const { auth } = useContext(AuthContext);
  const [courses, setCourses] = useState(null);

  if (auth.user?.currentRole !== "educator") {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-red-50">
        <h2 className="text-2xl font-bold text-red-700 mb-4">Access Denied</h2>
        <p className="text-red-600 mb-6">
          You must be logged in as an educator to view this page.
        </p>
        <Link
          to="/login"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  const fetchEducatorCourses = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/educator/courses`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      if (data.success) {
        setCourses(data.courses);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch courses.");
    }
  };

  useEffect(() => {
    fetchEducatorCourses();
  }, []);

  if (!courses) {
    return <Loading />;
  }

  return (
    <div className="bg-white">
      <div className="p-4 sm:p-6 md:p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            My Courses
          </h1>
          <Link
            to="/educator/add-course"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300 flex items-center gap-2"
          >
            <img src={assets.add_icon} alt="add" className="w-5 h-5" />
            <span className="hidden sm:block">Add New Course</span>
          </Link>
        </div>

        {courses.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">You haven't created any courses yet.</p>
            <Link to="/educator/add-course" className="text-blue-600 hover:underline mt-2 inline-block">
              Create your first course
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {courses.map((course) => (
              <div key={course._id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
                <Link to={`/course/${course._id}`}>
                  <img
                    src={course.courseThumbnail}
                    alt={course.courseTitle}
                    className="w-full h-40 object-cover"
                  />
                </Link>
                <div className="p-4">
                  <h3 className="font-semibold text-lg truncate text-gray-800 mb-2">
                    <Link to={`/course/${course._id}`} className="hover:text-blue-600">
                      {course.courseTitle}
                    </Link>
                  </h3>
                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <p>
                      <span className="font-semibold">{currency}{course.coursePrice}</span>
                    </p>
                    <div className="flex items-center gap-1">
                      <img src={assets.user_icon} alt="students" className="w-4 h-4" />
                      <span>{course.enrolledStudents?.length || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCourses;