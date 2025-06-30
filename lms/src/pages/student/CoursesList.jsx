import { useState, useEffect, useContext } from 'react';
import CourseCard from '../../components/student/CourseCard';
import { AppContext } from '../../context/AppContext';
import { useNavigate, useParams } from 'react-router-dom';
import Footer from '../../components/student/Footer';
import { FiSearch, FiX } from 'react-icons/fi';

const CourseList = () => {
  const { allcourses } = useContext(AppContext);
  const { input: initialSearch } = useParams();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState(initialSearch || '');
  const [filteredCourses, setFilteredCourses] = useState([]);

  useEffect(() => {
    let courses = allcourses || [];

    // The search term from the URL (`initialSearch`) is the source of truth for filtering
    if (initialSearch) {
      courses = courses.filter((course) =>
        course.courseTitle.toLowerCase().includes(initialSearch.toLowerCase())
      );
    }

    setFilteredCourses(courses);
  }, [initialSearch, allcourses]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/course-list/${searchTerm.trim()}`);
    } else {
      navigate('/course-list');
    }
  };
  
  const clearSearch = () => {
    setSearchTerm('');
    navigate('/course-list');
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-white pt-24">
        {/* Header */}
        <div className="bg-transparent text-center pt-12 pb-16">
            <div className="container mx-auto px-4">
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">Explore Our <span className="text-blue-600">Courses</span></h1>
                <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">Find the perfect course to boost your skills and career.</p>
                <form onSubmit={handleSearch} className="mt-8 max-w-xl mx-auto">
                    <div className="relative shadow-lg rounded-full">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search for anything..."
                            className="w-full pl-6 pr-16 py-4 border-2 border-transparent rounded-full focus:ring-4 focus:ring-blue-300 focus:outline-none transition"
                        />
                        <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition-transform duration-200 active:scale-90">
                            <FiSearch size={20}/>
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <div className="container mx-auto px-4 pb-20">
          {initialSearch && (
            <div className="flex items-center justify-center gap-3 mb-10">
              <p className="text-gray-700">
                Results for: <span className="font-semibold text-blue-600">"{initialSearch}"</span>
              </p>
              <button onClick={clearSearch} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-full transition">
                <FiX size={14} />
                <span>Clear</span>
              </button>
            </div>
          )}

          {/* Course Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course) => (
                <CourseCard key={course._id} course={course} />
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500 py-20">
                <h3 className="text-2xl font-semibold">No Courses Found</h3>
                <p className="mt-2">
                  {initialSearch ? "Try a different search term." : "There are currently no courses available."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CourseList;
