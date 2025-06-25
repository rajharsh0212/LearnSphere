import { useParams } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets';
import Loading from '../../components/student/Loading';

const CourseDetails = () => {
  const { courseId } = useParams();
  const { allcourses } = useContext(AppContext);
  const [course, setCourse] = useState(null);

  useEffect(() => {
    if (allcourses && allcourses.length > 0) {
      const found = allcourses.find((c) => c._id === courseId);
      setCourse(found);
    }
  }, [allcourses, courseId]);

  if (!course) {
    return <Loading />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white pt-28 px-6 md:px-20">
      {/* Top Banner */}
      <div className="grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-800 mb-4">{course.courseTitle}</h1>
          <p className="text-gray-600 mb-6">{course.description || "No description provided."}</p>
          <div className="flex items-center space-x-4 mb-6">
            <img
              src={course.instructor?.image || assets.profile_icon}
              alt="Instructor"
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <p className="font-semibold text-gray-800">{course.instructor?.name || "Instructor"}</p>
              <p className="text-sm text-gray-500">{course.instructor?.email}</p>
            </div>
          </div>
          <button className="px-6 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition">
            Enroll Now
          </button>
        </div>
        <div>
          <img
            src={course.thumbnail || assets.course_placeholder}
            alt="Course Banner"
            className="rounded-xl w-full max-h-[400px] object-cover shadow-md"
          />
        </div>
      </div>

      {/* Content Section */}
      <div className="mt-16 grid lg:grid-cols-3 gap-10">
        {/* Syllabus */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Course Syllabus</h2>
          <div className="space-y-4">
            {course.modules?.length > 0 ? (
              course.modules.map((module, idx) => (
                <div
                  key={idx}
                  className="p-4 border border-gray-200 rounded-md shadow-sm bg-white hover:bg-gray-50"
                >
                  <h3 className="font-semibold text-gray-700">{module.title}</h3>
                  <p className="text-sm text-gray-500">{module.description}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No modules available yet.</p>
            )}
          </div>
        </div>

        {/* Sidebar Highlights */}
        <div className="bg-white p-6 rounded-lg shadow-lg h-fit">
          <h3 className="text-lg font-semibold mb-4">Highlights</h3>
          <ul className="space-y-2 text-gray-600 text-sm">
            <li>📅 Duration: {course.duration || "8 weeks"}</li>
            <li>🎓 Level: {course.level || "Beginner"}</li>
            <li>🧑‍🏫 Instructor: {course.instructor?.name}</li>
            <li>📝 Assignments: {course.assignments?.length || 0}</li>
            <li>🧪 Quizzes: {course.quizzes?.length || 0}</li>
            <li>🎖 Certificate: {course.certificate ? "Yes" : "No"}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
