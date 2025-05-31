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

        <h3 class="text-2xl font-bold text-yellow-400 mb-3 mt-10">Our Premium Services</h3>
        <ul class="grid md:grid-cols-2 gap-4 text-neutral-100 mb-8">
          <li class="flex items-center gap-3 bg-neutral-900 rounded-xl px-4 py-3 shadow yellow-glow"><span
            class="text-2xl">✈️</span>Airport & Cruise Transfers</li>
          <li class="flex items-center gap-3 bg-neutral-900 rounded-xl px-4 py-3 shadow"><span
            class="text-2xl">🎉</span>Event & Party Transport</li>
          <li class="flex items-center gap-3 bg-neutral-900 rounded-xl px-4 py-3 shadow"><span
            class="text-2xl">💍</span>Wedding & Racecourse Rides</li>
          <li class="flex items-center gap-3 bg-neutral-900 rounded-xl px-4 py-3 shadow"><span
            class="text-2xl">🚸</span>School & Family Transfers</li>
        </ul>

        <h3 class="text-2xl font-bold text-yellow-400 mb-3 mt-10">Our Fleet</h3>
        <div class="grid md:grid-cols-3 gap-6">
          <div class="bg-neutral-900 rounded-xl p-6 text-center shadow matte-card anim-pop">
            <span class="text-5xl block mb-3">🚗</span>
            <div class="font-bold text-lg mb-1">Sedan</div>
            <div class="text-neutral-400">Perfect for solo or small group rides</div>
          </div>
          <div class="bg-neutral-900 rounded-xl p-6 text-center shadow matte-card anim-pop">
            <span class="text-5xl block mb-3">🚐</span>
            <div class="font-bold text-lg mb-1">Maxi Taxis</div>
            <div class="text-neutral-400">Roomy 7/11 seaters for families & groups</div>
          </div>
          <div class="bg-neutral-900 rounded-xl p-6 text-center shadow matte-card anim-pop">
            <span class="text-5xl block mb-3">🚌</span>
            <div class="font-bold text-lg mb-1">Party Bus</div>
            <div class="text-neutral-400">Ultimate fun for events or big parties</div>
          </div>
        </div>

        <h3 class="text-2xl font-bold text-yellow-400 mb-3 mt-10">What Our Clients Say</h3>
        <div class="grid md:grid-cols-2 gap-6">
          <div class="bg-neutral-900 rounded-xl p-5 shadow matte-card">
            <div class="text-neutral-100 mb-2">“Best taxi service in Sydney! Always on time and drivers are
              super professional.”</div>
            <div class="text-yellow-400 font-bold">– Jessica T.</div>
          </div>
          <div class="bg-neutral-900 rounded-xl p-5 shadow matte-card">
            <div class="text-neutral-100 mb-2">“Loved the easy booking and the clean, luxury cars. Highly
              recommended.”</div>
            <div class="text-yellow-400 font-bold">– Mike L.</div>
          </div>
        </div>

        {/* Services, Fleet, Testimonials sections */}




        {/* ... */}
      </div>
    </section>
  );
};

export default About;