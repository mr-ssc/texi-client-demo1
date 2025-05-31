import React from 'react';

const Contact = () => {
  return (
    <section
      id="contact"
      className="py-16 px-4 bg-neutral-950 bg-gradient-to-t from-black/80 via-neutral-900/90 to-neutral-950/90"
    >
      <div className="max-w-2xl mx-auto matte-card p-8 rounded-3xl shadow-2xl border border-neutral-800">
        <h2 className="text-3xl font-extrabold text-yellow-400 mb-4 tracking-tight">Contact Us</h2>
        <div className="text-neutral-200 text-lg mb-4">
          Have questions or need help? Reach out to our friendly team anytime.
        </div>
        
        <div className="mb-2">
          <span className="font-bold text-yellow-400">Phone:</span>
          <a href="tel:+61412345678" className="ml-2 hover:underline text-neutral-100">
            +61 412 345 678
          </a>
        </div>
        
        <div className="mb-2 flex flex-col sm:flex-row">
          <span className="font-bold text-yellow-400">Email:</span>
          <a
            href="mailto:bookings@platinumtaxi.com.au"
            className="sm:ml-2 hover:underline text-neutral-100 break-all"
          >
            bookings@platinumtaxi.com.au
          </a>
        </div>
        
        <div className="flex flex-col sm:flex-row">
          <span className="font-bold text-yellow-400">Address:</span>
          <span className="sm:ml-2 text-neutral-100">Sydney, NSW, Australia</span>
        </div>
      </div>
    </section>
  );
};

export default Contact;