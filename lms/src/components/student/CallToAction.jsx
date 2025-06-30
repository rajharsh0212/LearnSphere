import { Link, useNavigate } from 'react-router-dom';
import { assets } from '../../assets/assets';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const CallToAction = () => {
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
    <section className="text-center pt-20 pb-20 px-4 bg-white">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
        Learn anything, anytime, anywhere
      </h2>
      <p className="text-gray-500 max-w-xl mx-auto mb-8">
        Join thousands of learners and gain in-demand skills through expert-led <br />courses designed to fit your schedule and goals.
      </p>
      <div className="flex justify-center items-center gap-6 flex-wrap">
        <button onClick={handleGetStarted} className="bg-blue-600 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg">
            Get Started
        </button>
      </div>
    </section>
  );
};

export default CallToAction;
