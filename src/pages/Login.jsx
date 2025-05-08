import React, { useState, useEffect } from 'react';
import { LogIn } from "lucide-react";
import Cookies from 'js-cookie';
import { Link, useNavigate } from 'react-router-dom'; 
import ClientAxios, { getCsrfToken } from '../server/AxiosClient';
import Header from '../components/CarRental/Header';
import Footer from '../components/CarRental/Footer';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  // Using a single formData state for form fields
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false
  });
  
  // Using a structured formErrors state
  const [formErrors, setFormErrors] = useState({
    email: '',
    password: '',
    general: ''
  });
  
  const [isProcessing, setIsProcessing] = useState(false);

  // Get CSRF cookie when component mounts
  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        await getCsrfToken();
      } catch (error) {
        console.error('Error initializing CSRF protection:', error);
        setFormErrors(prev => ({
          ...prev,
          general: 'Unable to establish a secure connection. Please try refreshing the page.'
        }));
      }
    };
    
    fetchCsrfToken();
  }, []);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when field is changed
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setFormErrors(prev => ({
        ...prev,
        general: "Tous les champs sont obligatoires"
      }));
      return;
    }
    
    setIsProcessing(true);
    setFormErrors({
      email: '',
      password: '',
      general: ''
    });

    try {
      // This is now a no-op but we keep it to maintain the code structure
      await getCsrfToken();

      const res = await ClientAxios.post("/api/login", { 
        email: formData.email, 
        password: formData.password 
      });
      console.log('Login response:', res.data);

      // Set cookies and auth headers
      Cookies.set("access_token", res.data.token, {
        expires: formData.remember ? 30 : 1, // 30 days if remember me is checked, 1 day otherwise
        path: '/'
      });
      
      // Set the Authorization header for future requests
      ClientAxios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;

      // Use the login function from AuthContext
      await login({
        email: formData.email,
        password: formData.password,
        remember: formData.remember
      });

      // Redirect to home page after successful login
      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
      console.error('Error response:', err.response?.data);
      
      // Handle different types of errors
      if (err.response?.data?.errors) {
        if (err.response.data.errors.email) {
          setFormErrors(prev => ({
            ...prev,
            email: err.response.data.errors.email[0]
          }));
        } else if (err.response.data.errors.password) {
          setFormErrors(prev => ({
            ...prev, 
            password: err.response.data.errors.password[0]
          }));
        } else {
          setFormErrors(prev => ({
            ...prev,
            general: "Une erreur s'est produite. Veuillez réessayer."
          }));
        }
      } else if (err.response?.data?.message) {
        setFormErrors(prev => ({
          ...prev,
          general: err.response.data.message
        }));
      } else if (err.response?.status === 419) {
        setFormErrors(prev => ({
          ...prev,
          general: "Erreur de validation CSRF. Veuillez rafraîchir la page et réessayer."
        }));
      } else {
        setFormErrors(prev => ({
          ...prev,
          general: "Une erreur s'est produite. Veuillez réessayer."
        }));
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
            <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
            <p className="mt-2 text-gray-600">Sign in to your account to continue</p>
          </div>

          {formErrors.general && (
            <div className="mb-6 rounded-md bg-red-50 p-4 text-sm font-medium text-red-600">
              {formErrors.general}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
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
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <Link to="/forgot-password" className="text-sm text-purple-600 hover:text-purple-800">
                  Forgot password?
                </Link>
              </div>

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
                  autoComplete="current-password"
                  onChange={handleChange}
                  required
                />
              </div>

              {formErrors.password && (
                <p className="mt-2 text-sm text-red-600">{formErrors.password}</p>
              )}
            </div>

            <div className="mb-6 block">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="remember"
                  checked={formData.remember}
                  onChange={handleChange}
                  className="rounded border-gray-300 text-purple-600 shadow-sm focus:ring-purple-500 h-4 w-4"
                />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
            </div>

            <div>
              <button
                type="submit"
                disabled={isProcessing}
                className="flex w-full items-center justify-center rounded-md bg-[#A78BFA] px-4 py-3 font-bold text-white transition duration-150 ease-in-out hover:bg-[#8B5CF6] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-75"
              >
                {isProcessing ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 h-5 w-5" />
                    Sign in
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 flex items-center justify-center">
            <span className="text-sm text-gray-600">Don't have an account?</span>
            <Link to="/register" className="ml-2 text-sm font-medium text-purple-600 hover:text-purple-800">
              Create an account
            </Link>
          </div>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                className="flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.545 10.239v3.821h5.445c-0.643 2.783-2.835 4.76-5.445 4.76-3.312 0-6-2.688-6-6s2.688-6 6-6c1.757 0 3.332 0.768 4.452 1.979l2.802-2.802c-1.932-1.8-4.535-2.897-7.254-2.897-5.967 0-10.8 4.833-10.8 10.8s4.833 10.8 10.8 10.8c6.435 0 10.8-4.533 10.8-10.8 0-0.688-0.068-1.352-0.199-2h-10.599z" />
                </svg>
              </button>

              <button
                type="button"
                className="flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}