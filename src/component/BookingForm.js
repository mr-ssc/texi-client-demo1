import React from 'react';

const BookingForm = () => {
  return (
    <section id="booking" className="flex justify-center items-center py-16 px-4 bg-neutral-900 bg-gradient-to-b from-black/80 via-neutral-900/90 to-neutral-950/90">
      <form className="matte-card anim-fade p-8 md:p-12 rounded-3xl max-w-2xl w-full grid grid-cols-1 gap-6 shadow-2xl border border-neutral-800">
        <h2 className="text-3xl font-extrabold text-yellow-400 mb-2 tracking-tight text-center">Book Your Taxi</h2>

        {/* Form fields go here - same as your original HTML */}
        <div>
          <label className="block text-neutral-200 mb-1 font-semibold">Service Type</label>
          <select className="w-full rounded-lg px-4 py-3 bg-neutral-800 text-white border-none outline-none focus:ring-2 focus:ring-yellow-400 transition">
            <option>General Transfers</option>
            <option>Airport Transport</option>
            {/* Add other options */}
          </select>
        </div>

        {/* Add all other form fields... */}

        <button type="submit" className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold text-lg px-6 py-3 rounded-full mt-2 shadow-lg transition-all duration-200 yellow-glow anim-pop">
          Submit Booking
        </button>
      </form>
    </section>
  );
};

export default BookingForm;