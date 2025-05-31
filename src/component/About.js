import React from 'react';

const About = () => {
  return (
    <section id="about" className="py-16 px-4 bg-neutral-950">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-extrabold text-yellow-400 mb-4 tracking-tight">About Us</h2>
        <p className="text-neutral-200 text-lg mb-6">
          Platinum Taxi Sydney brings you a new era of premium transport. Our professional drivers,
          modern fleet, and focus on reliability ensure your journey is always comfortable, safe, and
          on time.
        </p>

        {/* Services, Fleet, Testimonials sections */}
        {/* ... */}
      </div>
    </section>
  );
};

export default About;