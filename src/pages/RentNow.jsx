import React, { useState } from 'react';
import Header from '../components/CarRental/Header';
import Footer from '../components/CarRental/Footer';
import { reservationService } from "../services/api";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function RentNow() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        pickup_location: '',
        dropoff_location: '',
        pickup_date: '',
        dropoff_date: '',
        car_type: 'economy',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        
        try {
            // Send the booking data to the Laravel backend
            const response = await bookingService.createBooking({
                ...formData,
                user_id: user.id
            });
            
            alert('Booking submitted! We will contact you shortly to confirm your reservation.');
            navigate('/');
        } catch (error) {
            console.error('Error submitting booking:', error);
            setError(error.response?.data?.message || 'There was an error submitting your booking. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="car-rental-app">
            <Header />
            
            <div className="py-16 bg-gray-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
                        Rent Your Car Now
                    </h1>
                    
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        {error && (
                            <div className="mb-6 rounded bg-red-50 p-4 text-red-800">
                                {error}
                            </div>
                        )}
                        
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="pickup_location" className="block text-sm font-medium text-gray-700 mb-1">
                                        Pickup Location
                                    </label>
                                    <select 
                                        id="pickup_location"
                                        name="pickup_location"
                                        value={formData.pickup_location}
                                        onChange={handleChange}
                                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-[#A78BFA] focus:border-[#A78BFA]"
                                        required
                                    >
                                        <option value="">Select location</option>
                                        <option value="casablanca">Casablanca</option>
                                        <option value="rabat">Rabat</option>
                                        <option value="marrakech">Marrakech</option>
                                        <option value="tangier">Tangier</option>
                                        <option value="agadir">Agadir</option>
                                    </select>
                                </div>
                                
                                <div>
                                    <label htmlFor="dropoff_location" className="block text-sm font-medium text-gray-700 mb-1">
                                        Dropoff Location
                                    </label>
                                    <select 
                                        id="dropoff_location"
                                        name="dropoff_location"
                                        value={formData.dropoff_location}
                                        onChange={handleChange}
                                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-[#A78BFA] focus:border-[#A78BFA]"
                                        required
                                    >
                                        <option value="">Select location</option>
                                        <option value="casablanca">Casablanca</option>
                                        <option value="rabat">Rabat</option>
                                        <option value="marrakech">Marrakech</option>
                                        <option value="tangier">Tangier</option>
                                        <option value="agadir">Agadir</option>
                                    </select>
                                </div>
                                
                                <div>
                                    <label htmlFor="pickup_date" className="block text-sm font-medium text-gray-700 mb-1">
                                        Pickup Date & Time
                                    </label>
                                    <input 
                                        type="datetime-local"
                                        id="pickup_date"
                                        name="pickup_date"
                                        value={formData.pickup_date}
                                        onChange={handleChange}
                                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-[#A78BFA] focus:border-[#A78BFA]"
                                        required
                                    />
                                </div>
                                
                                <div>
                                    <label htmlFor="dropoff_date" className="block text-sm font-medium text-gray-700 mb-1">
                                        Dropoff Date & Time
                                    </label>
                                    <input 
                                        type="datetime-local"
                                        id="dropoff_date"
                                        name="dropoff_date"
                                        value={formData.dropoff_date}
                                        onChange={handleChange}
                                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-[#A78BFA] focus:border-[#A78BFA]"
                                        required
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label htmlFor="car_type" className="block text-sm font-medium text-gray-700 mb-1">
                                    Car Type
                                </label>
                                <select 
                                    id="car_type"
                                    name="car_type"
                                    value={formData.car_type}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-[#A78BFA] focus:border-[#A78BFA]"
                                    required
                                >
                                    <option value="economy">Economy</option>
                                    <option value="compact">Compact</option>
                                    <option value="midsize">Midsize</option>
                                    <option value="suv">SUV</option>
                                    <option value="luxury">Luxury</option>
                                </select>
                            </div>
                            
                            <div className="flex justify-center">
                                <button 
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="bg-[#A78BFA] hover:bg-[#8B5CF6] text-white font-bold py-3 px-8 rounded-md transition duration-200 disabled:opacity-70"
                                >
                                    {isSubmitting ? 'Processing...' : 'Complete Reservation'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            
            <Footer />
        </div>
    );
} 