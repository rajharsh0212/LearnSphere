import { FiSearch } from "react-icons/fi";
import SearchBar from "./SearchBar";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";

const HeroSection = () => {
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (auth.token) {
      toast.info("You are already logged in.");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="bg-white pt-25 pb-12 px-4 w-full">
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
          <button onClick={handleGetStarted} className="bg-blue-600 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg">
            Get Started
          </button>
          <Link to={"/course-list"} className="bg-white border border-gray-300 text-gray-700 font-semibold px-5 py-2.5 rounded-lg hover:bg-gray-50 transition-all duration-300 shadow-md hover:shadow-lg">
            Explore Courses
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
