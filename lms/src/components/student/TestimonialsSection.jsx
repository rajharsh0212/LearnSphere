import React from 'react';
import {assets, dummyTestimonial } from '../../assets/assets';

const Testimonials = () => {
  return (
    <section className="pt-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">Testimonials</h2>
        <p className="text-gray-600 mb-10 max-w-2xl mx-auto">
          Hear from our learners as they share their journeys of transformation, success, and how our platform has made a difference in their lives.
        </p>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {dummyTestimonial.map((t, i) => (
            <div
              key={i}
              className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex items-center gap-4 bg-gray-100 px-6 py-4">
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-14 h-14 rounded-full object-cover"
                />
                <div className="text-left">
                  <h4 className="font-semibold text-gray-900">{t.name}</h4>
                  <p className="text-sm text-gray-600">{t.role}</p>
                </div>
              </div>

              <div className="px-6 py-4 text-gray-700 text-left">
                <div className="flex items-center mb-2 text-red-500 text-lg">
                  {[...Array(5)].map((_, idx) => (<img key={idx} src={idx < t.rating ? assets.star : assets.star_blank} alt="star" className="w-4 h-4"/>))}
                </div>
                <p className="mb-4">{t.feedback}</p>
                <a href="#" className="text-blue-600 font-medium hover:underline">
                  Read more
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
