import React from 'react';

const BookingForm = () => {
  return (
    <section id="booking" className="flex justify-center items-center py-16 px-4 bg-neutral-900 bg-gradient-to-b from-black/80 via-neutral-900/90 to-neutral-950/90">
      <form className="matte-card anim-fade p-8 md:p-12 rounded-3xl max-w-2xl w-full grid grid-cols-1 gap-6 shadow-2xl border border-neutral-800">
        <h2 className="text-3xl font-extrabold text-yellow-400 mb-2 tracking-tight text-center">Book Your Taxi</h2>

        <div>
          <label className="block text-neutral-200 mb-1 font-semibold">Service Type</label>
          <select className="w-full rounded-lg px-4 py-3 bg-neutral-800 text-white border-none outline-none focus:ring-2 focus:ring-yellow-400 transition">
            <option>General Transfers</option>
            <option>Airport Transport</option>
            <option>Cruise Transport</option>
            <option>Event Transport</option>
            <option>Wedding Transport</option>
            <option>Racecourse Transport</option>
            <option>Birthday Transport</option>
            <option>School Transport</option>
          </select>
        </div>

        <div>
          <label className="block text-neutral-200 mb-1 font-semibold">Pickup Address</label>
          <input
            type="text"
            className="w-full rounded-lg px-4 py-3 bg-neutral-800 text-white border-none outline-none focus:ring-2 focus:ring-yellow-400 transition"
            placeholder="Enter pickup address"
          />
        </div>

        <div>
          <label className="block text-neutral-200 mb-1 font-semibold">Drop Address</label>
          <input
            type="text"
            className="w-full rounded-lg px-4 py-3 bg-neutral-800 text-white border-none outline-none focus:ring-2 focus:ring-yellow-400 transition"
            placeholder="Enter drop address"
          />
        </div>


        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-neutral-200 mb-1 font-semibold">Date</label>
            <input
              type="date"
              className="w-full rounded-lg px-4 py-3 bg-neutral-800 text-white border-none outline-none focus:ring-2 focus:ring-yellow-400 transition"
            />
          </div>
          <div className="flex-1">
            <label className="block text-neutral-200 mb-1 font-semibold">Time</label>
            <input
              type="time"
              className="w-full rounded-lg px-4 py-3 bg-neutral-800 text-white border-none outline-none focus:ring-2 focus:ring-yellow-400 transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-neutral-200 mb-1 font-semibold">Passenger Number</label>
          <input
            type="number"
            min="1"
            max="20"
            className="w-full rounded-lg px-4 py-3 bg-neutral-800 text-white border-none outline-none focus:ring-2 focus:ring-yellow-400 transition"
            placeholder="No. of passengers"
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-neutral-200 mb-1 font-semibold">First Name</label>
            <input
              type="text"
              className="w-full rounded-lg px-4 py-3 bg-neutral-800 text-white border-none outline-none focus:ring-2 focus:ring-yellow-400 transition"
              placeholder="First name"
            />
          </div>
          <div className="flex-1">
            <label className="block text-neutral-200 mb-1 font-semibold">Last Name</label>
            <input
              type="text"
              className="w-full rounded-lg px-4 py-3 bg-neutral-800 text-white border-none outline-none focus:ring-2 focus:ring-yellow-400 transition"
              placeholder="Last name"
            />
          </div>
        </div>

        <div>
          <label className="block text-neutral-200 mb-1 font-semibold">Email</label>
          <input
            type="email"
            className="w-full rounded-lg px-4 py-3 bg-neutral-800 text-white border-none outline-none focus:ring-2 focus:ring-yellow-400 transition"
            placeholder="your@email.com"
          />
        </div>




        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-auto sm:flex-[0.6]">
            <label className="block text-neutral-200 mb-1 font-semibold">Country Code</label>
            <select className="w-full rounded-lg px-4 py-3 bg-neutral-800 text-white border-none outline-none focus:ring-2 focus:ring-yellow-400 transition">
              <option>+61</option>
              <option>+1</option>
              <option>+44</option>
              <option>+91</option>
            </select>
          </div>
          <div className="w-full sm:flex-1">
            <label className="block text-neutral-200 mb-1 font-semibold">Mobile No.</label>
            <input
              type="tel"
              className="w-full rounded-lg px-4 py-3 bg-neutral-800 text-white border-none outline-none focus:ring-2 focus:ring-yellow-400 transition"
              placeholder="Mobile number"
            />
          </div>
        </div>

        <div>
          <label className="block text-neutral-200 mb-1 font-semibold">Taxi Type</label>
          <select className="w-full rounded-lg px-4 py-3 bg-neutral-800 text-white border-none outline-none focus:ring-2 focus:ring-yellow-400 transition">
            <option>Sedan</option>
            <option>Baby Seat Maxi</option>
            <option>Maxi 7 Seats</option>
            <option>Maxi 11 Seats</option>
            <option>Party Bus</option>
            <option>Wheelchair Taxi</option>
          </select>
        </div>

        <div>
          <label className="block text-neutral-200 mb-1 font-semibold">Trip Type</label>
          <select className="w-full rounded-lg px-4 py-3 bg-neutral-800 text-white border-none outline-none focus:ring-2 focus:ring-yellow-400 transition">
            <option>One Way</option>
            <option>Return Trip</option>
          </select>
        </div>

        <div>
          <label className="block text-neutral-200 mb-1 font-semibold">Additional Information</label>
          <textarea
            className="w-full rounded-lg px-4 py-3 bg-neutral-800 text-white border-none outline-none focus:ring-2 focus:ring-yellow-400 transition min-h-[60px]"
            placeholder="Any special requests or info"
          ></textarea>
        </div>

        <button type="submit" className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold text-lg px-6 py-3 rounded-full mt-2 shadow-lg transition-all duration-200 yellow-glow anim-pop">
          Submit Booking
        </button>
      </form>
    </section>
  );
};

export default BookingForm;