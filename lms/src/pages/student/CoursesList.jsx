import { useState, useEffect } from 'react';
import CourseCard from '../../components/student/CourseCard';
import { AppContext } from '../../context/AppContext';
import { useContext } from 'react';
import SearchBar from '../../components/student/SearchBar';
import { useParams, useNavigate } from 'react-router-dom';
import { assets } from '../../assets/assets';
import Footer from '../../components/student/Footer';

const CourseList = () => {
  const { allcourses } = useContext(AppContext);
  const { input } = useParams();
  const [filteredCourses, setFilteredCourses] = useState([]);
  const nav = useNavigate();

  useEffect(() => {
    if (allcourses && allcourses.length > 0) {
      const tempcourses = allcourses.slice();
      input
        ? setFilteredCourses(
            tempcourses.filter((item) =>
              item.courseTitle.toLowerCase().includes(input.toLowerCase())
            )
          )
        : setFilteredCourses(tempcourses);
    } else {
      setFilteredCourses([]);
    }
  }, [input, allcourses]);

  return (
    <>
    <div className="bg-gradient-to-b from-blue-100 to-white px-4 sm:px-8 md:px-16 lg:px-50 pt-30 pb-10 bg-white min-h-screen">
      {/* Header and Search Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div className='px-0'>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-1">Course List</h1>
          <p className="text-sm text-gray-500">
            <span
              className="text-blue-600 cursor-pointer hover:underline"
              onClick={() => nav('/')}
            >
              Home
            </span>{' '}
            / Course List
          </p>
        </div>
        <div className="w-full md:w-1/2 lg:w-1/2">
          <SearchBar data={input} />
        </div>
      </div>

      {/* Filter Tag */}
      {input && (
        <div className="flex items-center gap-3 mb-8 bg-blue-100 px-4 py-2 border border-blue-300 rounded-md max-w-xs">
          <p className="text-sm text-gray-700">
            Showing results for: <span className="text-blue-600 font-medium">"{input}"</span>
          </p>
          <img
            src={assets.cross_icon}
            alt="Clear"
            className="w-4 h-4 cursor-pointer"
            onClick={() => nav('/course-list')}
          />
        </div>
      )}

      {/* Course Grid */}
      <div className="grid  justify-items-center grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:px-0 md:my-16 justify-center border-gray-400">
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course, index) => (
            <CourseCard key={index} course={course} />
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500 mt-10">
            <p>No courses found.</p>
          </div>
        )}
      </div>
      
    </div>
    <Footer />
    </>
  );
};

export default CourseList;
