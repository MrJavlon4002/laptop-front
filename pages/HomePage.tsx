
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Laptop, ApiError } from '../types';
import * as apiService from '../services/apiService';
import LaptopCard from '../components/LaptopCard';
import Spinner from '../components/Spinner';
import Alert from '../components/Alert'; // Import Alert

const HomePage: React.FC = () => {
  const [featuredLaptops, setFeaturedLaptops] = useState<Laptop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [featuredError, setFeaturedError] = useState<string | null>(null); // Added error state

  useEffect(() => {
    const fetchFeatured = async () => {
      setIsLoading(true);
      setFeaturedError(null); // Clear previous errors
      try {
        const response = await apiService.getLaptops({ page: 1, limit: 3 });
        setFeaturedLaptops(response.data); 
      } catch (error) {
        console.error("Failed to fetch featured laptops:", error);
        const apiError = error as ApiError;
        // Use the detailed message from ApiError, or a fallback
        setFeaturedError(apiError?.message || "Could not load featured laptops. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="space-y-12">
      <section className="bg-gradient-to-r from-primary to-blue-700 text-white py-20 px-6 rounded-lg shadow-xl text-center">
        <h1 className="text-5xl font-bold mb-4">Welcome to Laptop Store Deluxe!</h1>
        <p className="text-xl mb-8">Find the perfect laptop tailored to your needs. Unbeatable prices, unmatched quality.</p>
        <Link 
          to="/laptops" 
          className="bg-accent hover:bg-amber-600 text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform transform hover:scale-105 inline-block"
        >
          Shop All Laptops
        </Link>
      </section>

      <section>
        <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Featured Laptops</h2>
        {isLoading ? (
          <Spinner size="lg" />
        ) : featuredError ? ( // Display Alert if there's an error
          <Alert type="error" message={featuredError} />
        ) : featuredLaptops.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredLaptops.map(laptop => (
              <LaptopCard key={laptop.id} laptop={laptop} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600">No featured laptops available at the moment.</p>
        )}
      </section>

      <section className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Why Choose Us?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mx-auto text-primary mb-3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068M15.75 21H8.25A2.25 2.25 0 0 1 6 18.75V5.25A2.25 2.25 0 0 1 8.25 3h7.5A2.25 2.25 0 0 1 18 5.25v9.75C18 16.072 16.072 18 13.75 18c-1.122 0-2.138-.474-2.867-1.248L10.5 15.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            <h3 className="text-xl font-semibold mb-2">Wide Selection</h3>
            <p className="text-gray-600">From ultrabooks to gaming rigs, we have it all.</p>
          </div>
          <div className="p-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mx-auto text-primary mb-3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            <h3 className="text-xl font-semibold mb-2">Best Prices</h3>
            <p className="text-gray-600">Competitive pricing on all our products.</p>
          </div>
          <div className="p-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mx-auto text-primary mb-3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.125-.504 1.125-1.125V14.25m-17.25 4.5h12.75m0 0H4.125M17.25 4.5c-1.518 0-2.756.401-3.75 1.125M17.25 4.5C18.244 5.224 19.5 5.625 20.625 5.625V4.125A1.125 1.125 0 0 0 19.5 3h-3.75A1.125 1.125 0 0 0 14.625 4.125v1.5M4.875 4.5C3.881 5.224 2.625 5.625 1.5 5.625V4.125A1.125 1.125 0 0 1 2.625 3H6.375A1.125 1.125 0 0 1 7.5 4.125v1.5m0 0v9.375m0-9.375a1.5 1.5 0 0 1 1.5-1.5h3a1.5 1.5 0 0 1 1.5 1.5m-6 0a1.5 1.5 0 0 0-1.5-1.5h-3a1.5 1.5 0 0 0-1.5 1.5m1.5 12.75H3.375V9.75M17.25 17.25H20.625v-7.5" />
            </svg>
            <h3 className="text-xl font-semibold mb-2">Fast Shipping</h3>
            <p className="text-gray-600">Quick and reliable delivery to your doorstep.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
