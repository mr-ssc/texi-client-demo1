import React from 'react';

const Hero = () => {
  return (
    <section className="relative w-full h-[66vh] min-h-[420px] flex items-center justify-center hero-anim">
      <img
        src="./hero.png"
        alt="Taxi Sydney Hero"
        className="absolute inset-0 w-full h-full object-cover object-center brightness-75 scale-105"
      />
      <div className="relative z-10 flex flex-col items-center">
        <h1 className="text-5xl md:text-7xl font-extrabold text-yellow-400 mb-4 drop-shadow-lg tracking-tight uppercase anim-pop">
          Ride Platinum
        </h1>
        <p className="text-xl md:text-2xl text-black font-medium mb-6 px-4 md:px-0 text-center max-w-2xl">
          Sydney's trusted premium taxi – luxury, reliability, and prompt service for every journey.
        </p>
        <a
          href="#booking"
          className="bg-yellow-400 hover:bg-yellow-300 text-black px-8 py-3 rounded-full shadow-lg mt-4 text-lg font-bold uppercase tracking-wider transition-all anim-pop"
        >
          Book Your Ride
        </a>
      </div>
    </section>
  );
};

export default Hero;