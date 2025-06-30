import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { FiStar, FiBarChart2, FiUsers } from 'react-icons/fi';

const CourseCard = ({ course }) => {
  const { currency, calculateAverageRating, calculateNoOfLectures } = useContext(AppContext);

  const discountedPrice = (course.coursePrice - (course.discount * course.coursePrice / 100)).toFixed(2);
  const rating = calculateAverageRating(course);
  const totalLectures = calculateNoOfLectures(course);

  const levelColor = {
    Beginner: 'bg-green-100 text-green-800',
    Intermediate: 'bg-yellow-100 text-yellow-800',
    Advanced: 'bg-red-100 text-red-800',
  };

  return (
    <Link
      to={`/course/${course._id}`}
      onClick={() => window.scrollTo(0, 0)}
      className="flex flex-col bg-white rounded-2xl shadow-md overflow-hidden border border-transparent hover:border-blue-500 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 group"
    >
      <div className="relative">
        <img
          src={course.courseThumbnail}
          alt={course.courseTitle}
          className="w-full h-48 object-cover"
        />
        <div className={`absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full ${levelColor[course.level] || 'bg-gray-100 text-gray-800'}`}>
          {course.level}
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <p className="text-sm text-blue-600 font-semibold mb-1">{course.category}</p>
        <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-700 leading-snug mb-3 h-14">
          {course.courseTitle}
        </h3>
        
        <div className="flex items-center justify-between text-sm text-gray-500 mt-auto">
          <div className="flex items-center gap-1.5">
            <FiStar className="text-yellow-500" />
            <span className="font-bold text-gray-700">{rating}</span>
            <span>({course.courseRatings?.length || 0})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <FiUsers />
            <span>{course.enrolledStudents?.length || 0} Students</span>
          </div>
        </div>
        
        <div className="border-t my-4"></div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <p className="text-2xl font-extrabold text-gray-900">
              {currency}{discountedPrice}
            </p>
            {course.discount > 0 && (
              <p className="text-sm text-gray-500 line-through">
                {currency}{course.coursePrice.toFixed(2)}
              </p>
            )}
          </div>
          <div className="text-blue-600 font-semibold">
              View Details
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
