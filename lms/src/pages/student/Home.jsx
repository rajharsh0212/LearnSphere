import React from 'react';
import HeroSection from '../../components/student/Hero';
import Companies from '../../components/student/Companies';
import CoursesSection from '../../components/student/CoursesSection';
import Testimonials from '../../components/student/TestimonialsSection';
import CallToAction from '../../components/student/CallToAction';
import Footer from '../../components/student/Footer';
import AiFeatures from '../../components/student/AiFeatures';

const Home = () => {
  return (
    < div className="flex flex-col items-center space-y-7 text-center w-full">
        <HeroSection/>
        <Companies/>
        <AiFeatures />
        <CoursesSection/>
        <Testimonials/>
        <CallToAction/>
        <Footer/>
    </div>
  )
}

export default Home