import { Link } from 'react-router-dom';
import { assets } from '../../assets/assets';

const CallToAction = () => {
  return (
    <section className="text-center pt-16 pb-20 px-4 bg-white">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
        Learn anything, anytime, anywhere
      </h2>
      <p className="text-gray-500 max-w-xl mx-auto mb-8">
        Join thousands of learners and gain in-demand skills through expert-led <br />courses designed to fit your schedule and goals.
      </p>
      <div className="flex justify-center items-center gap-6 flex-wrap">
        <Link to={"/login"} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full shadow-md font-semibold">
            Get Started
        </Link>
        <Link
          to="/login"
          className="flex align-items-center justify-items-center text-gray-900 font-semibold hover:underline transition"
        >
          Learn more  <img src={assets.arrow_icon} alt="arrow-icon" />
        </Link>
      </div>
    </section>
  );
};

export default CallToAction;
