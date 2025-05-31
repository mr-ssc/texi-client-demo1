import React, { useState } from 'react';
import { FaPhone, FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <nav className="flex items-center justify-between px-4 sm:px-8 py-5 bg-black bg-opacity-80 sticky top-0 z-40 shadow-lg anim-fade">
        <div className="flex items-center gap-2">
          <div className="bg-yellow-400 text-black text-2xl font-extrabold px-4 py-1 rounded-xl shadow yellow-glow tracking-tight">
            PLATINUM
          </div>
          <span className="ml-2 text-lg font-bold text-neutral-300 tracking-wider hidden sm:inline">
            Taxi Sydney
          </span>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8 text-base font-semibold">
          <a href="#contact" className="hover:text-yellow-400 transition">
            <FaPhone className="inline mr-1" /> Call Now
          </a>
          <a href="#booking" className="bg-yellow-400 hover:bg-yellow-300 text-black px-6 py-2 rounded-full shadow font-bold transition-all duration-200 anim-pop">
            Booking Now
          </a>
        </div>
        
        {/* Mobile Toggle Button */}
        <button 
          className="md:hidden text-white focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </nav>
      
      {/* Mobile Menu */}
      <div className={`md:hidden bg-black bg-opacity-90 w-full fixed z-30 transition-all duration-300 ease-in-out ${isOpen ? 'top-20 opacity-100' : 'top-[-100%] opacity-0'}`}>
        <div className="flex flex-col items-center gap-6 py-6 text-lg font-semibold">
          <a 
            href="#contact" 
            className="hover:text-yellow-400 transition"
            onClick={() => setIsOpen(false)}
          >
            <FaPhone className="inline mr-2" /> Call Now
          </a>
          <a 
            href="#booking" 
            className="bg-yellow-400 hover:bg-yellow-300 text-black px-8 py-3 rounded-full shadow font-bold transition-all duration-200 anim-pop"
            onClick={() => setIsOpen(false)}
          >
            Booking Now
          </a>
        </div>
      </div>
    </>
  );
};

export default Navbar;