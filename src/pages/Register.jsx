import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/CarRental/Header';
import Footer from '../components/CarRental/Footer';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    age: '',
    password: '',
    password_confirmation: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setFormErrors({});

    try {
      await register(formData);
      navigate('/');
    } catch (err) {
      setFormErrors(err.response?.data?.errors || {});
      if (!err.response?.data?.errors) {
        setFormErrors({ general: err.response?.data?.message || 'Registration failed' });
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />

      <div className="flex flex-col items-center py-12 sm:pt-24">
        <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white px-6 py-8 shadow-xl sm:px-10">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
            <p className="mt-2 text-gray-600">Join us for the best car rental experience</p>
          </div>

          {formErrors.general && (
            <div className="mb-6 rounded-md bg-red-50 p-4 text-sm font-medium text-red-600">
              {formErrors.general}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>

              <div className="relative mt-2">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  id="name"
                  name="name"
                  value={formData.name}
                  className="block w-full rounded-md border-gray-300 pl-10 focus:border-purple-500 focus:ring-purple-500 py-2 px-3 border"
                  autoComplete="name"
                  onChange={handleChange}
                  required
                />
              </div>

              {formErrors.name && (
                <p className="mt-2 text-sm text-red-600">{formErrors.name}</p>
              )}
            </div>

            <div className="mb-6">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone
              </label>
              <div className="relative mt-2">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  className="block w-full rounded-md border-gray-300 pl-10 focus:border-purple-500 focus:ring-purple-500 py-2 px-3 border"
                  autoComplete="tel"
                  onChange={handleChange}
                  required
                />
              </div>
              {formErrors.phone && (
                <p className="mt-2 text-sm text-red-600">{formErrors.phone}</p>
              )}
            </div>

            <div className="mb-6">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <div className="relative mt-2">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <input
                  id="address"
                  type="text"
                  name="address"
                  value={formData.address}
                  className="block w-full rounded-md border-gray-300 pl-10 focus:border-purple-500 focus:ring-purple-500 py-2 px-3 border"
                  autoComplete="address"
                  onChange={handleChange}
                  required
                />
              </div>

              {formErrors.address && (
                <p className="mt-2 text-sm text-red-600">{formErrors.address}</p>
              )}
            </div>

            <div className="mb-6">
              <label htmlFor="age" className="block text-sm font-medium text-gray-700">
                Age
              </label>
              <div className="relative mt-2">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <input
                  id="age"
                  type="number"
                  name="age"
                  value={formData.age}
                  min="18"
                  className="block w-full rounded-md border-gray-300 pl-10 focus:border-purple-500 focus:ring-purple-500 py-2 px-3 border"
                  onChange={handleChange}
                  required
                />
              </div>

              {formErrors.age && (
                <p className="mt-2 text-sm text-red-600">{formErrors.age}</p>
              )}
            </div>

            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>

              <div className="relative mt-2">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  className="block w-full rounded-md border-gray-300 pl-10 focus:border-purple-500 focus:ring-purple-500 py-2 px-3 border"
                  autoComplete="username"
                  onChange={handleChange}
                  required
                />
              </div>

              {formErrors.email && (
                <p className="mt-2 text-sm text-red-600">{formErrors.email}</p>
              )}
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>

              <div className="relative mt-2">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  id="password"
                  type="password"
                  name="password"
                  value={formData.password}
                  className="block w-full rounded-md border-gray-300 pl-10 focus:border-purple-500 focus:ring-purple-500 py-2 px-3 border"
                  autoComplete="new-password"
                  onChange={handleChange}
                  required
                />
              </div>

              {formErrors.password && (
                <p className="mt-2 text-sm text-red-600">{formErrors.password}</p>
              )}
            </div>

            <div className="mb-6">
              <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>

              <div className="relative mt-2">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  id="password_confirmation"
                  type="password"
                  name="password_confirmation"
                  value={formData.password_confirmation}
                  className="block w-full rounded-md border-gray-300 pl-10 focus:border-purple-500 focus:ring-purple-500 py-2 px-3 border"
                  autoComplete="new-password"
                  onChange={handleChange}
                  required
                />
              </div>

              {formErrors.password_confirmation && (
                <p className="mt-2 text-sm text-red-600">{formErrors.password_confirmation}</p>
              )}
            </div>

            <div className="mb-6">
              <div className="rounded-md bg-yellow-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-yellow-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">Attention</h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>
                        By creating an account, you agree to our{" "}
                        <a href="#" className="font-medium text-yellow-700 underline hover:text-yellow-600">
                          Terms of Service
                        </a>{" "}
                        and{" "}
                        <a href="#" className="font-medium text-yellow-700 underline hover:text-yellow-600">
                          Privacy Policy
                        </a>
                        .
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isProcessing}
                className="flex w-full items-center justify-center rounded-md bg-[#A78BFA] px-4 py-3 font-bold text-white transition duration-150 ease-in-out hover:bg-[#8B5CF6] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-75"
              >
                {isProcessing ? "Creating account..." : "Create Account"}
              </button>
            </div>
          </form>

          <div className="mt-6 flex items-center justify-center">
            <span className="text-sm text-gray-600">Already have an account?</span>
            <Link to="/login" className="ml-2 text-sm font-medium text-purple-600 hover:text-purple-800">
              Sign in
            </Link>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
} 