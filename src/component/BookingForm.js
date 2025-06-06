import React, { useState, useEffect, useRef } from 'react';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, getDoc, addDoc, setDoc, Timestamp, serverTimestamp, increment } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";

// Firebase configuration and initialization
const firebaseConfig = {
  apiKey: "AIzaSyAY3TseN8w0IvVJIxpaYvLKnP3H1DmtFYg",
  authDomain: "requiementgathering.firebaseapp.com",
  projectId: "requiementgathering",
  storageBucket: "requiementgathering.firebasestorage.app",
  messagingSenderId: "297040139948",
  appId: "1:297040139948:web:4a339a1d3150e95a3c3109",
  measurementId: "G-TB2KW7KLLB"
};

const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const firestore = getFirestore(app);

const BookingForm = () => {
  const [taxiTypes, setTaxiTypes] = useState([]);
  const [tripTypes, setTripTypes] = useState([]);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [totalFare, setTotalFare] = useState(null);
  const [distance, setDistance] = useState(null);
  const [distanceFailed, setDistanceFailed] = useState(false);
  const [formData, setFormData] = useState({
    pickupAddress: '',
    dropAddress: '',
    serviceTypeId: '',
    taxiTypeId: '',
    tripTypeId: '',
    passengerNumber: '2',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    countryCode: '+91',
    mobileNumber: '9876543210',
    additionalInfo: 'Please arrive on time.',
    tripDate: new Date().toISOString().split('T')[0],
    tripStartTime: '10:00',
    tripStatus: 'Pending',
  });

  const pickupRef = useRef(null);
  const dropRef = useRef(null);
  const [pickupCoords, setPickupCoords] = useState(null);
  const [dropCoords, setDropCoords] = useState(null);

  const companyId = 'abc_pvt_ltd';
  const basePath = `Easy2Solutions/companyDirectory/tenantCompanies/${companyId}`;
  const taxiTypesPath = `${basePath}/settings/taxiBookingSettings/taxiTypes`;
  const tripTypesPath = `${basePath}/settings/taxiBookingSettings/tripTypes`;
  const serviceTypesPath = `${basePath}/settings/taxiBookingSettings/serviceTypes`;
  const settingsPath = `${basePath}/settings/taxiBookingSettings`;
  const bookingsPath = `${basePath}/taxiBookings`;
  const visitorCounterPath = `${basePath}/analytics/visitorCounters/daily`;

  // Initialize Google Places Autocomplete (if available)
  useEffect(() => {
    if (window.google && window.google.maps) {
      const pickupAutocomplete = new window.google.maps.places.Autocomplete(pickupRef.current, {
        types: ['address'],
        componentRestrictions: { country: 'in' }, // Restrict to India
      });
      const dropAutocomplete = new window.google.maps.places.Autocomplete(dropRef.current, {
        types: ['address'],
        componentRestrictions: { country: 'in' },
      });

      pickupAutocomplete.addListener('place_changed', () => {
        const place = pickupAutocomplete.getPlace();
        if (place.formatted_address) {
          setFormData(prev => ({ ...prev, pickupAddress: place.formatted_address }));
          setPickupCoords({
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          });
        }
      });

      dropAutocomplete.addListener('place_changed', () => {
        const place = dropAutocomplete.getPlace();
        if (place.formatted_address) {
          setFormData(prev => ({ ...prev, dropAddress: place.formatted_address }));
          setDropCoords({
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          });
        }
      });
    } else {
      console.warn('Google Maps API not loaded; manual address input enabled.');
    }
  }, []);

  // Calculate distance when both coordinates are available
  useEffect(() => {
    if (pickupCoords && dropCoords && window.google && window.google.maps) {
      const distanceService = new window.google.maps.DistanceMatrixService();
      distanceService.getDistanceMatrix(
        {
          origins: [pickupCoords],
          destinations: [dropCoords],
          travelMode: 'DRIVING',
          unitSystem: window.google.maps.UnitSystem.METRIC,
        },
        (response, status) => {
          if (status === 'OK' && response.rows[0].elements[0].status === 'OK') {
            const distanceKm = response.rows[0].elements[0].distance.value / 1000; // Convert meters to km
            setDistance(distanceKm);
            setDistanceFailed(false);
            if (settings && settings.perKmFare) {
              const fare = distanceKm * settings.perKmFare;
              setTotalFare(fare);
            }
          } else {
            console.error('Distance Matrix Error:', status, response);
            setDistanceFailed(true);
            if (settings) {
              setTotalFare(settings.minimumFare || 50.0);
            }
          }
        }
      );
    } else if (settings && (formData.pickupAddress && formData.dropAddress)) {
      // Fallback to minimum fare if coordinates are unavailable but addresses are entered
      setDistanceFailed(true);
      setTotalFare(settings.minimumFare || 50.0);
    }
  }, [pickupCoords, dropCoords, settings, formData.pickupAddress, formData.dropAddress]);

  // Increment visitor counter on page load
  useEffect(() => {
    const updateVisitorCounter = async () => {
      try {
        const currentDate = new Date().toISOString().split('T')[0];
        const counterRef = doc(firestore, visitorCounterPath, currentDate);
        await setDoc(
          counterRef,
          {
            count: increment(1),
            lastUpdated: serverTimestamp(),
            page: 'TaxiBookingPage',
          },
          { merge: true }
        );
      } catch (err) {
        console.error('Visitor Counter Error:', err);
      }
    };

    updateVisitorCounter();
  }, []); // Empty dependency array ensures this runs once on component mount

  // Fetch Firestore data
  useEffect(() => {
    console.log('Firestore instance:', firestore);
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log('Fetching data from Firestore...');

        // Fetch Taxi Types
        const taxiTypesSnapshot = await getDocs(collection(firestore, taxiTypesPath));
        const taxiTypesData = taxiTypesSnapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name,
        }));
        console.log('Taxi Types:', taxiTypesData);
        setTaxiTypes(taxiTypesData);

        // Fetch Trip Types
        const tripTypesSnapshot = await getDocs(collection(firestore, tripTypesPath));
        const tripTypesData = tripTypesSnapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name,
        }));
        console.log('Trip Types:', tripTypesData);
        setTripTypes(tripTypesData);

        // Fetch Service Types
        const serviceTypesSnapshot = await getDocs(collection(firestore, serviceTypesPath));
        const serviceTypesData = serviceTypesSnapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name,
        }));
        console.log('Service Types:', serviceTypesData);
        setServiceTypes(serviceTypesData);

        // Fetch Settings
        const settingsDoc = await getDoc(doc(firestore, settingsPath));
        if (settingsDoc.exists()) {
          const settingsData = settingsDoc.data();
          console.log('Settings:', settingsData);
          setSettings(settingsData);
          // Set initial fare only if distance is not yet calculated
          if (!distance) {
            setTotalFare(settingsData.minimumFare || 50.0);
          }
        } else {
          throw new Error('Settings document not found');
        }
      } catch (err) {
        console.error('Firestore Error:', err);
        setError('Failed to load data: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = formData;

    if (!data.pickupAddress || !data.dropAddress || !data.serviceTypeId || !data.taxiTypeId || !data.tripTypeId ||
        !data.passengerNumber || !data.firstName || !data.lastName || !data.email || !data.countryCode || !data.mobileNumber ||
        !data.tripDate || !data.tripStartTime) {
      alert('Please fill all required fields');
      return;
    }

    if (!totalFare) {
      alert('Unable to calculate fare; please try again or contact support');
      return;
    }

    setFormData(data);
    setShowConfirmModal(true);
  };

  const confirmBooking = async () => {
    try {
      setIsBooking(true);
      const bookingData = {
        passengerNumbers: parseInt(formData.passengerNumber, 10),
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        countryCode: formData.countryCode,
        mobileNumber: formData.mobileNumber,
        taxiTypeId: formData.taxiTypeId,
        tripTypeId: formData.tripTypeId,
        serviceTypeId: formData.serviceTypeId,
        additionalInfo: formData.additionalInfo || '',
        pickupAddress: formData.pickupAddress,
        dropAddress: formData.dropAddress,
        tripDate: Timestamp.fromDate(new Date(formData.tripDate)),
        tripStartTime: formData.tripStartTime,
        tripStatus: 'Pending',
        accepted: false,
        totalFareAmount: totalFare,
        lastUpdatedBy: 'customer',
        createdAt: serverTimestamp(),
        lastUpdatedAt: serverTimestamp(),
        distanceCalculated: !distanceFailed, // Store whether distance was calculated
      };

      await addDoc(collection(firestore, bookingsPath), bookingData);

      if (totalFare > (settings?.whatsappNotificationFareThreshold || 0)) {
        sendWhatsAppNotification(formData.firstName, formData.lastName, totalFare);
      }

      setShowConfirmModal(false);
      setShowSuccessModal(true);
    } catch (err) {
      console.error('Booking Error:', err);
      alert('Error creating booking: ' + err.message);
      setShowConfirmModal(false);
    } finally {
      setIsBooking(false);
    }
  };

  const sendWhatsAppNotification = (firstName, lastName, fare) => {
    const mobileNumber = '9426604346';
    const message = `New booking by ${firstName} ${lastName}. Total fare: ${fare.toFixed(2)} INR.;
    console.log(Sending WhatsApp to ${mobileNumber}: ${message})`;
    // Implement WhatsApp API call here
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-[#18181b] rounded-3xl p-8 max-w-sm w-full border border-[#27272a] flex flex-col items-center">
          <div className="w-8 h-8 border-4 border-t-yellow-400 border-gray-600 rounded-full animate-spin mb-4"></div>
          <p className="text-[#e4e4e7] text-lg font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <section id="booking" className="flex justify-center items-center py-16 px-4 bg-neutral-900 bg-gradient-to-b from-black/80 via-neutral-900/90 to-neutral-950/90">
      <form onSubmit={handleSubmit} className="matte-card anim-fade p-8 md:p-12 rounded-3xl max-w-2xl w-full grid grid-cols-1 gap-6 shadow-2xl border border-neutral-800">
        <h2 className="text-3xl font-extrabold text-yellow-400 mb-2 tracking-tight text-center">Book Your Taxi</h2>

        <div>
          <label className="block text-neutral-200 mb-1 font-semibold">Service Type</label>
          <select
            name="serviceTypeId"
            className="w-full rounded-lg px-4 py-3 bg-neutral-800 text-white border-none outline-none focus:ring-2 focus:ring-yellow-400 transition"
            value={formData.serviceTypeId}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Service Type</option>
            {serviceTypes.map(type => (
              <option key={type.id} value={type.id}>{type.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-neutral-200 mb-1 font-semibold">Pickup Address</label>
          <input
            type="text"
            name="pickupAddress"
            ref={pickupRef}
            className="w-full rounded-lg px-4 py-3 bg-neutral-800 text-white border-none outline-none focus:ring-2 focus:ring-yellow-400 transition"
            value={formData.pickupAddress}
            onChange={handleInputChange}
            placeholder="Enter pickup address"
            required
          />
        </div>

        <div>
          <label className="block text-neutral-200 mb-1 font-semibold">Drop Address</label>
          <input
            type="text"
            name="dropAddress"
            ref={dropRef}
            className="w-full rounded-lg px-4 py-3 bg-neutral-800 text-white border-none outline-none focus:ring-2 focus:ring-yellow-400 transition"
            value={formData.dropAddress}
            onChange={handleInputChange}
            placeholder="Enter drop address"
            required
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-neutral-200 mb-1 font-semibold">Date</label>
            <input
              type="date"
              name="tripDate"
              className="w-full rounded-lg px-4 py-3 bg-neutral-800 text-white border-none outline-none focus:ring-2 focus:ring-yellow-400 transition"
              value={formData.tripDate}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="flex-1">
            <label className="block text-neutral-200 mb-1 font-semibold">Time</label>
            <input
              type="time"
              name="tripStartTime"
              className="w-full rounded-lg px-4 py-3 bg-neutral-800 text-white border-none outline-none focus:ring-2 focus:ring-yellow-400 transition"
              value={formData.tripStartTime}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-neutral-200 mb-1 font-semibold">Passenger Number</label>
          <input
            type="number"
            name="passengerNumber"
            min="1"
            max="20"
            className="w-full rounded-lg px-4 py-3 bg-neutral-800 text-white border-none outline-none focus:ring-2 focus:ring-yellow-400 transition"
            value={formData.passengerNumber}
            onChange={handleInputChange}
            placeholder="Number"
            required
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-neutral-200 mb-1 font-semibold">First Name</label>
            <input
              type="text"
              name="firstName"
              className="w-full rounded-lg px-4 py-3 bg-neutral-800 text-white border-none outline-none focus:ring-2 focus:ring-yellow-400 transition"
              value={formData.firstName}
              onChange={handleInputChange}
              placeholder="First name"
              required
            />
          </div>
          <div className="flex-1">
            <label className="block text-neutral-200 mb-1 font-semibold">Last Name</label>
            <input
              type="text"
              name="lastName"
              className="w-full rounded-lg px4-py-4 py-3 bg-neutral-800 text-white border-none outline-none focus:ring-2 focus:ring-yellow-400 transition"
              value={formData.lastName}
              onChange={handleInputChange}
              placeholder="Last name"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-neutral-200 mb-1 font-semibold">Email</label>
          <input
            type="email"
            name="email"
            className="w-full rounded-lg px-4 py-3 bg-neutral-800 text-white border-none outline-none focus:ring-2 focus:ring-yellow-400 transition"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="your@email.com"
            required
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-auto sm:flex-[0.6]">
            <label className="block text-neutral-200 mb-1 font-semibold">Country Code</label>
            <select
              name="countryCode"
              className="w-full rounded-lg px-4 py-3 bg-neutral-800 text-white border-none outline-none focus:ring-2 focus:ring-yellow-400 transition"
              value={formData.countryCode}
              onChange={handleInputChange}
              required
            >
              <option value="+61">+61</option>
              <option value="+1">+1</option>
              <option value="+44">+44</option>
              <option value="+91">+91</option>
            </select>
          </div>
          <div className="w-full sm:flex-1">
            <label className="block text-neutral-200 mb-1 font-semibold">Mobile No.</label>
            <input
              type="tel"
              name="mobileNumber"
              className="w-full rounded-lg px-4 py-3 bg-neutral-800 text-white border-none outline-none focus:ring-2 focus:ring-yellow-400 transition"
              value={formData.mobileNumber}
              onChange={handleInputChange}
              placeholder="Mobile number"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-neutral-200 mb-1 font-semibold">Taxi Type</label>
          <select
            name="taxiTypeId"
            className="w-full rounded-lg px-4 py-3 bg-neutral-800 text-white border-none outline-none focus:ring-2 focus:ring-yellow-400 transition"
            value={formData.taxiTypeId}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Taxi Type</option>
            {taxiTypes.map(type => (
              <option key={type.id} value={type.id}>{type.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-neutral-200 mb-1 font-semibold">Trip Type</label>
          <select
            name="tripTypeId"
            className="w-full rounded-lg px-4 py-3 bg-neutral-800 text-white border-none outline-none focus:ring-2 focus:ring-yellow-400 transition"
            value={formData.tripTypeId}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Trip Type</option>
            {tripTypes.map(type => (
              <option key={type.id} value={type.id}>{type.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-neutral-200 mb-1 font-semibold">Additional Information</label>
          <textarea
            name="additionalInfo"
            className="w-full rounded-lg px-4 py-3 bg-neutral-800 text-white border-none outline-none focus:ring-2 focus:ring-yellow-400 transition min-h-[60px]"
            value={formData.additionalInfo}
            onChange={handleInputChange}
            placeholder="Any special requests or info"
          />
        </div>

        <button
          type="submit"
          className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold text-lg px-6 py-3 rounded-full mt-2 shadow-lg transition-all duration-200 yellow-glow anim-pop"
        >
          Submit Booking
        </button>
      </form>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-[#18181b] rounded-3xl p-6 max-w-md w-full border border-[#27272a]">
            <h3 className="text-2xl font-bold text-[#facc15] mb-4">Confirm Booking</h3>
            <p className="text-[#e4e4e7] mb-2">
              Total fare for this trip is ₹{totalFare ? totalFare.toFixed(2) : 0}
              {distance ? ` for ${distance.toFixed(2)} km` : ''}.
            </p>
            {distanceFailed && (
              <p className="text-[#e4e4e7] text-sm mb-4">
                Note: Fare rate will be updated based on distance traveled and finalized after discussion with the driver.
              </p>
            )}
            <p className="text-[#e4e4e7] mb-6">Are you sure you want to book this ride?</p>
            <div className="flex justify-end gap-4">
              <button
                className="bg-[#27272a] text-[#e4e4e7] px-4 py-2 rounded-full hover:bg-[#3f3f46] transition"
                onClick={() => setShowConfirmModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-[#facc15] text-black px-4 py-2 rounded-full hover:bg-[#eab308] transition"
                onClick={confirmBooking}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Wait Dialog */}
      {isBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-[#18181b] rounded-3xl p-8 max-w-sm w-full border border-[#27272a] flex flex-col items-center">
            <div className="w-8 h-8 border-4 border-t-yellow-400 border-gray-600 rounded-full animate-spin mb-4"></div>
            <p className="text-[#e4e4e7] text-lg font-semibold">Wait...</p>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-[#18181b] rounded-3xl p-6 max-w-md w-full border border-[#27272a]">
            <h3 className="text-2xl font-bold text-[#facc15] mb-4">Booking Successful</h3>
            <p className="text-[#e4e4e7] mb-6">Your booking has been successfully registered!</p>
            <div className="flex justify-end">
              <button
                className="bg-[#facc15] text-black px-4 py-2 rounded-full hover:bg-[#eab308] transition"
                onClick={() => setShowSuccessModal(false)}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default BookingForm;