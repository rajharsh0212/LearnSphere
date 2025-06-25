import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../../assets/assets';
import { AppContext } from '../../context/AppContext';

const CourseCard = ({ course }) => {
  const { currency, calculaterating } = useContext(AppContext);

  // Calculated discounted price
  const price = (course.coursePrice - (course.discount * course.coursePrice / 100)).toFixed(2);

  return (
    <Link
      to={`/course/${course._id}`}
      onClick={() => window.scrollTo(0, 0)}
      className="text-center bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 w-full max-w-full mx-auto"
    >
      {/* Thumbnail */}
      <img
        src={course.courseThumbnail}
        alt={course.courseTitle}
        className="w-full "
      />

      {/* Card Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900">{course.courseTitle}</h3>
        <p className="text-sm text-gray-600 mt-1">{course.educator.name}</p>

        {/* Rating */}
        <div className="flex flex-col items-center justify-center gap-1 mt-2">
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, index) => (
            <img key={index} src={index < Math.floor(calculaterating(course)) ? assets.star : assets.star_blank} alt="star" className="w-4 h-4" />
          ))}
          <p className="text-sm text-yellow-600 font-semibold">{calculaterating(course)}</p>
        </div>
          <p className="text-sm text-gray-500">({course.courseRatings.length})</p>
        </div>

        {/* Price */}
        <p className="mt-3 text-md font-bold text-gray-800">
          {currency} {price}
        </p>
      </div>
    </Link>
  );
};

export default CourseCard;
