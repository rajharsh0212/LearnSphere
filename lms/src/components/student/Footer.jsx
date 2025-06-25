import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import logo from "../../assets/logo_image.png";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6 px-4 max-w-full w-auto text-center">
      <div className="max-w-full mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 border-b border-gray-700 pb-8">
        {/* Logo & Description */}
        <div>
          <Link to="/" className="flex items-center space-x-2 group align-center justify-center mb-4">
            <img
              src={logo}
              alt="LearnSphere Logo"
              className="h-10 sm:h-12 w-auto transition-transform duration-300 group-hover:scale-105"
            />
            <span className="text-xl sm:text-2xl font-extrabold text-white tracking-wide group-hover:text-blue-700">
              LearnSphere
            </span>
          </Link>
          <p className="text-gray-400">
            Empowering learners with the best online courses in tech, business, and more.
          </p>
        </div>

        {/* Explore */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Explore</h3>
          <ul className="space-y-2 text-gray-400">
            <li><Link to="/course-list" className="hover:text-white">Courses</Link></li>
            <li><a href="/#" className="hover:text-white">About Us</a></li>
            <li><a href="/#" className="hover:text-white">Contact</a></li>
            <li><a href="/#" className="hover:text-white">FAQ</a></li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Resources</h3>
          <ul className="space-y-2 text-gray-400">
            <li><a href="/#" className="hover:text-white">Blog</a></li>
            <li><a href="/#" className="hover:text-white">Terms of Service</a></li>
            <li><a href="/#" className="hover:text-white">Privacy Policy</a></li>
            <li><a href="/#" className="hover:text-white">Support</a></li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h3 className="text-lg font-semibold mb-4 justify-center">Connect</h3>
          <div className="flex space-x-4 flex-row justify-center">
            <a href="/#" className="hover:text-blue-500"><FaFacebookF /></a>
            <a href="/#" className="hover:text-blue-400"><FaTwitter /></a>
            <a href="/#" className="hover:text-blue-600"><FaLinkedinIn /></a>
            <a href="/#" className="hover:text-pink-500"><FaInstagram /></a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center text-gray-500 text-sm mt-6">
        © {new Date().getFullYear()} LearnSphere. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
