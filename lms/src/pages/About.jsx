import React from 'react';
import { FiUsers, FiBookOpen, FiTarget, FiAward } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import Footer from '../components/student/Footer';

const About = () => {
  const teamMembers = [
    { name: 'John Doe', role: 'Lead Developer', image: 'https://i.pravatar.cc/150?img=1' },
    { name: 'Jane Smith', role: 'Instructional Designer', image: 'https://i.pravatar.cc/150?img=2' },
    { name: 'Peter Jones', role: 'Community Manager', image: 'https://i.pravatar.cc/150?img=3' },
    { name: 'Sara Wilson', role: 'Marketing Head', image: 'https://i.pravatar.cc/150?img=4' },
  ];

  const stats = [
    { icon: <FiUsers className="w-10 h-10 text-blue-500" />, value: '10,000+', label: 'Happy Students' },
    { icon: <FiBookOpen className="w-10 h-10 text-blue-500" />, value: '500+', label: 'Courses Available' },
    { icon: <FiAward className="w-10 h-10 text-blue-500" />, value: '1,000+', label: 'Expert Instructors' },
    { icon: <FiTarget className="w-10 h-10 text-blue-500" />, value: '98%', label: 'Completion Rate' },
  ];

  return (
    <div className="bg-white text-gray-800 pt-24">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">
          We're Changing the Way People <span className="text-blue-600">Learn</span>
        </h1>
        <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
          Our mission is to provide high-quality, accessible, and engaging online education to empower individuals and organizations worldwide.
        </p>
      </div>

      {/* Our Story Section */}
      <div className="py-20">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-extrabold mb-4 text-blue-600">Our Story</h2>
            <p className="mb-4 text-gray-600">
              Founded in 2024, our platform was born from a shared passion for education and technology. We saw a need for a more intuitive and community-focused online learning experience.
            </p>
            <p className="text-gray-600">
              We started with a small team of educators and developers, and have since grown into a global community dedicated to making learning accessible for everyone, everywhere.
            </p>
          </div>
          <div>
            <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80" alt="Our team collaborating" className="rounded-lg shadow-xl" />
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white/60 backdrop-blur-md p-6 rounded-lg shadow-lg">
                <div className="flex justify-center mb-4">{stat.icon}</div>
                <p className="text-3xl font-bold">{stat.value}</p>
                <p className="text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Our Team Section */}
      <div className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-12">Meet Our Team</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="transform hover:scale-105 transition-transform duration-300">
                <img src={member.image} alt={member.name} className="w-32 h-32 rounded-full mx-auto mb-4 shadow-lg" />
                <h3 className="font-bold text-lg">{member.name}</h3>
                <p className="text-gray-500">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Learning?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Join thousands of learners and take the next step in your personal and professional growth.
          </p>
          <Link
            to="/courses"
            className="bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors duration-300 shadow-md"
          >
            Explore Courses
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default About; 