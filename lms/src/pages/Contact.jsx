import React, { useState } from 'react';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import Footer from '../components/student/Footer';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="bg-white text-gray-800 pt-24">
      {/* Header with Gradient */}
      <div className="bg-white">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">Get in <span className="text-blue-600">Touch</span></h1>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Have questions or feedback? We'd love to hear from you. Reach out to us, and we'll get back to you as soon as possible.
          </p>
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-white py-20">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="flex items-center">
              <div className="bg-blue-100 p-4 rounded-full">
                <FiMail className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-xl font-bold">Email</h3>
                <a href="mailto:support@lms.com" className="text-blue-600 hover:underline">
                  support@LearnSphere.com
                </a>
              </div>
            </div>
            <div className="flex items-center">
              <div className="bg-blue-100 p-4 rounded-full">
                <FiPhone className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-xl font-bold">Phone</h3>
                <p>(123) 456-7890</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="bg-blue-100 p-4 rounded-full">
                <FiMapPin className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-xl font-bold">Address</h3>
                <p>123 Learning Lane, Education City, USA</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-gray-50 p-8 rounded-lg shadow-md">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none" />
                </div>
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input type="text" name="subject" id="subject" value={formData.subject} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none" />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea name="message" id="message" rows="5" value={formData.message} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"></textarea>
              </div>
              <div>
                <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-300">
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact; 