import { FiSearch } from "react-icons/fi";
import SearchBar from "./SearchBar";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <div className="bg-gradient-to-b from-blue-100 to-white pt-25 pb-10 px-4 w-full">
      <div className="max-w-6xl mx-auto text-center">
        {/* Heading */}
        <h1 className="text-4xl md:text-5xl xl:text-6xl pt-35 font-extrabold text-gray-900 leading-tight">
          Empower your future with the <br />
          courses designed to{' '}
          <span className="relative inline-block text-blue-600">
            <span className="relative z-10">fit your choice.</span>
            {/* Blue underline using SVG */}
            <svg
              className="absolute left-0 bottom-0 w-full h-3"
              viewBox="0 0 200 10"
              preserveAspectRatio="none"
              fill="none"
            >
              <path
                d="M0 5 C50 10, 150 0, 200 5"
                stroke="#3B82F6"
                strokeWidth="2.5"
                fill="none"
              />
            </svg>
          </span>
        </h1>

        {/* Subheading */}
        <p className="mt-4 mb-10 text-lg text-gray-700 max-w-4xl mx-auto">
          Join world-class instructors, engaging lessons, and a community designed <br /> to help you learn and grow —
          anytime, anywhere.
        </p>

        <SearchBar/>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link to={"/login"} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full shadow-md font-semibold">
            Get Started
          </Link>
          <Link to={"/course-list"} className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-full font-semibold">
            Explore Courses
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
