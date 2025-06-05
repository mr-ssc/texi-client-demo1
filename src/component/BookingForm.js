import React, { useState, useEffect } from 'react';
import firebase from 'firebase/app';
import { Firestore } from 'firebase/firestore'
import { Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './BookingForm.css'; // Your CSS

const BookingForm = () => {
  const [taxiTypes, setTaxiTypes] = useState([]);
  const [tripTypes, setTripTypes] = useState([]);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [totalFare, setTotalFare] = useState(null);
  const [formData, setFormData] = useState({
    pickupAddress: '123 Main St, City, Country',
    dropAddress: '456 Park Ave, City, Country',
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
    tripDate: new Date().toISOString().split('T')[0], // Today's date
    tripStartTime: '10:00',
  });




  // Static company ID
  const companyId = 'abc_pvt_ltd';

  // Firestore paths - fixed template literals
  const basePath = `Easy2Solutions/companyDirectory/tenantCompanies/${companyId}`;
  const taxiTypesPath = `${basePath}/settings/taxiBookingSettings/taxiTypes`;
  const tripTypesPath = `${basePath}/settings/taxiBookingSettings/tripTypes`;
  const serviceTypesPath = `${basePath}/settings/taxiBookingSettings/serviceTypes`;
  const settingsPath = `${basePath}/settings/taxiBookingSettings`;
  const bookingsPath = `${basePath}/taxiBookings`;
  const visitorCounterPath = `${basePath}/analytics/visitorCounters/daily`;

  // Fetch Firestore data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const taxiTypesSnapshot = await firebase.firestore().collection(taxiTypesPath).get();
        const taxiTypesData = taxiTypesSnapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name,
        }));
        setTaxiTypes(taxiTypesData);

        const tripTypesSnapshot = await firebase.firestore().collection(tripTypesPath).get();
        const tripTypesData = tripTypesSnapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name,
        }));
        setTripTypes(tripTypesData);

        const serviceTypesSnapshot = await firebase.firestore().collection(serviceTypesPath).get();
        const serviceTypesData = serviceTypesSnapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name,
        }));
        setServiceTypes(serviceTypesData);

        const settingsDoc = await firebase.firestore().doc(settingsPath).get();
        if (settingsDoc.exists) {
          setSettings(settingsDoc.data());
          // Set default fare from settings or use static value
          setTotalFare(settingsDoc.data().minimumFare || 50.0);
        } else {
          throw new Error('Settings document not found');
        }
      } catch (err) {
        setError('Failed to load data: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);





  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = formData;

    if (!data.pickupAddress || !data.dropAddress || !data.serviceTypeId || !data.taxiTypeId || !data.tripTypeId ||
      !data.passengerNumber || !data.firstName || !data.lastName || !data.email || !data.countryCode || !data.mobileNumber ||
      !data.tripDate || !data.tripStartTime) {
      alert('Please fill all required fields');
      return;
    }

    // Use static fare (from settings or hardcoded)
    const fare = totalFare || 50.0;
    setTotalFare(fare);
    setFormData(data);
    setShowConfirmModal(true);
  };

  // Handle booking confirmation
  const confirmBooking = async () => {
    try {
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
        tripDate: firebase.firestore.Timestamp.fromDate(new Date(formData.tripDate)),
        tripStartTime: formData.tripStartTime,
        tripStatus: 'pending',
        accepted: false,
        totalFareAmount: totalFare,
        lastUpdatedBy: 'customer',
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        lastUpdatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      };

      await firebase.firestore().collection(bookingsPath).add(bookingData);

      const currentDate = new Date().toISOString().split('T')[0];
      const counterRef = firebase.firestore().collection(visitorCounterPath).doc(currentDate);
      await counterRef.set(
        {
          count: firebase.firestore.FieldValue.increment(1),
          lastUpdated: firebase.firestore.FieldValue.serverTimestamp(),
          page: 'TaxiBookingPage',
        },
        { merge: true }
      );

      if (totalFare > (settings?.whatsappNotificationFareThreshold || 0)) {
        sendWhatsAppNotification(formData.firstName, formData.lastName, totalFare);
      }

      setShowConfirmModal(false);
      setShowSuccessModal(true);
    } catch (err) {
      alert('Error creating booking: ' + err.message);
      setShowConfirmModal(false);
    }
  };

  // WhatsApp notification placeholder
  const sendWhatsAppNotification = (firstName, lastName, fare) => {
    const mobileNumber = '9426604346';
    const message = `New booking by ${firstName} ${lastName}. Total fare: ${fare.toFixed(2)} INR.`;
    console.log(`Sending WhatsApp to ${mobileNumber}: ${message}`);
    // Add actual WhatsApp API call here
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <section className="booking-section">
      <form onSubmit={handleSubmit} className="booking-form">
        <h2 className="form-title">Book Your Taxi</h2>

        <div className="form-group">
          <label className="form-label">Service Type</label>
          <select
            name="serviceTypeId"
            className="form-input"
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

        <div className="form-group">
          <label className="form-label">Pickup Address</label>
          <input
            type="text"
            name="pickupAddress"
            className="form-input"
            value={formData.pickupAddress}
            onChange={handleInputChange}
            placeholder="Enter pickup address"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Drop Address</label>
          <input
            type="text"
            name="dropAddress"
            className="form-input"
            value={formData.dropAddress}
            onChange={handleInputChange}
            placeholder="Enter drop address"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group flex-1">
            <label className="form-label">Date</label>
            <input
              type="date"
              name="tripDate"
              className="form-input"
              value={formData.tripDate}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group flex-1">
            <label className="form-label">Time</label>
            <input
              type="time"
              name="tripStartTime"
              className="form-input"
              value={formData.tripStartTime}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Passenger Number</label>
          <input
            type="number"
            name="passengerNumber"
            min="1"
            max="20"
            className="form-input"
            value={formData.passengerNumber}
            onChange={handleInputChange}
            placeholder="No. of passengers"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group flex-1">
            <label className="form-label">First Name</label>
            <input
              type="text"
              name="firstName"
              className="form-input"
              value={formData.firstName}
              onChange={handleInputChange}
              placeholder="First name"
              required
            />
          </div>
          <div className="form-group flex-1">
            <label className="form-label">Last Name</label>
            <input
              type="text"
              name="lastName"
              className="form-input"
              value={formData.lastName}
              onChange={handleInputChange}
              placeholder="Last name"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            type="email"
            name="email"
            className="form-input"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="your@email.com"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Country Code</label>
            <select
              name="countryCode"
              className="form-input"
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
          <div className="form-group flex-1">
            <label className="form-label">Mobile No.</label>
            <input
              type="tel"
              name="mobileNumber"
              className="form-input"
              value={formData.mobileNumber}
              onChange={handleInputChange}
              placeholder="Mobile number"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Taxi Type</label>
          <select
            name="taxiTypeId"
            className="form-input"
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

        <div className="form-group">
          <label className="form-label">Trip Type</label>
          <select
            name="tripTypeId"
            className="form-input"
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

        <div className="form-group">
          <label className="form-label">Additional Information</label>
          <textarea
            name="additionalInfo"
            className="form-input textarea"
            value={formData.additionalInfo}
            onChange={handleInputChange}
            placeholder="Any special requests or info"
          />
        </div>

        <button type="submit" className="submit-button">
          Submit Booking
        </button>
      </form>

      {/* Confirmation Modal */}
      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} dialogClassName="custom-modal">
        <Modal.Header closeButton className="bg-[#18181b] text-[#facc15] border-[#27272a]">
          <Modal.Title>Confirm Booking</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-[#18181b] text-[#e4e4e7]">
          Total fare for this trip is ₹{totalFare ? totalFare.toFixed(2) : 0}. Are you sure you want to book this ride?
        </Modal.Body>
        <Modal.Footer className="bg-[#18181b] border-[#27272a]">
          <Button className="bg-[#27272a] text-[#e4e4e7]" onClick={() => setShowConfirmModal(false)}>
            Cancel
          </Button>
          <Button className="bg-[#facc15] text-black" onClick={confirmBooking}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Success Modal */}
      <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)} dialogClassName="custom-modal">
        <Modal.Header closeButton className="bg-[#18181b] text-[#facc15] border-[#27272a]">
          <Modal.Title>Booking Successful</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-[#18181b] text-[#e4e4e7]">
          Your booking has been successfully registered!
        </Modal.Body>
        <Modal.Footer className="bg-[#18181b] border-[#27272a]">
          <Button className="bg-[#facc15] text-[#000000]" onClick={() => setShowSuccessModal(false)}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </section>
  );
};

export default BookingForm;