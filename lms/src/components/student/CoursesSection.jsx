import React from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import CourseCard from './CourseCard';

const CoursesSection = () => {
  const { allcourses } = React.useContext(AppContext);

  return (
    <div className="pt-20 px-4 md: max-w-screen-xs mx-auto text-center">
      {/* Heading */}
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
        Learn from the best
      </h2>

      {/* Description */}
      <p className="text-gray-600 text-base md:text-lg max-w-3xl mx-auto mb-10">
        Explore top-rated courses to boost your skills and career. From tech and business to arts and wellness, there's something for everyone. Join our community and start learning today!
      </p>

      {/* Courses Grid */}
     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 px-4 sm:px-6 md:px-10 lg:px-20 xl:px-24 py-10">
        {allcourses.slice(0, 4).map((course, index) => (
          <CourseCard key={index} course={course} />
        ))}
      </div>


      {/* Show All Button */}
      <div className="mt-10">
        <Link
          to="/course-list"
          onClick={() => window.scrollTo(0, 0)}
          className="bg-white border border-gray-300 text-gray-700 font-semibold px-5 py-2.5 rounded-lg hover:bg-gray-50 transition-all duration-300 shadow-md hover:shadow-lg"
        >
          Show all courses
        </Link>
      </div>
    </div>
  );
};

export default CoursesSection;
