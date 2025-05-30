
import React, { useState, useEffect, useCallback } from 'react';
import { Laptop, LaptopFilterParams, PaginatedLaptopsResponse, ApiError } from '../types'; // Import ApiError
import * as apiService from '../services/apiService';
import LaptopCard from '../components/LaptopCard';
import Spinner from '../components/Spinner';
import Pagination from '../components/Pagination';
import { DEFAULT_PAGE_LIMIT, BRAND_OPTIONS, RAM_OPTIONS, STORAGE_OPTIONS } from '../constants';
import Alert from '../components/Alert'; // Ensure Alert is imported if you use it here

const LaptopsPage: React.FC = () => {
  const [laptops, setLaptops] = useState<Laptop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  
  const [filters, setFilters] = useState<LaptopFilterParams>({
    page: currentPage,
    limit: DEFAULT_PAGE_LIMIT,
    brand: '',
    price_min: undefined, 
    price_max: undefined, 
    ram: '',
    storage: '',
    rating_min: undefined, 
    tags: '',             
  });

  const fetchLaptops = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const currentFilters = { ...filters, page: currentPage, limit: DEFAULT_PAGE_LIMIT };
      const response: PaginatedLaptopsResponse = await apiService.getLaptops(currentFilters);
      setLaptops(response.data);
      setTotalPages(response.meta.totalPages);
      setTotalItems(response.meta.totalItems);
      setCurrentPage(response.meta.page);
    } catch (err) {
      console.error("Failed to fetch laptops:", err);
      const apiError = err as ApiError;
      // Use the detailed message from ApiError, or a fallback
      setError(apiError?.message || "Failed to load laptops. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, [filters, currentPage]);

  useEffect(() => {
    fetchLaptops();
  }, [fetchLaptops]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: (name === 'price_min' || name === 'price_max' || name === 'rating_min') 
              ? (value ? parseFloat(value) : undefined) 
              : value,
    }));
    setCurrentPage(1); 
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  const clearFilters = () => {
    setFilters({
        page: 1,
        limit: DEFAULT_PAGE_LIMIT,
        brand: '',
        price_min: undefined,
        price_max: undefined,
        ram: '',
        storage: '',
        rating_min: undefined,
        tags: '',
    });
    setCurrentPage(1);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Our Laptop Collection</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Filter Laptops</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <div>
            <label htmlFor="brand" className="block text-sm font-medium text-gray-700">Brand</label>
            <select id="brand" name="brand" value={filters.brand} onChange={handleFilterChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary">
              <option value="">All Brands</option>
              {BRAND_OPTIONS.map(brand => <option key={brand} value={brand}>{brand}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="price_min" className="block text-sm font-medium text-gray-700">Min Price</label>
            <input type="number" id="price_min" name="price_min" value={filters.price_min || ''} onChange={handleFilterChange} placeholder="e.g., 500" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" />
          </div>
          <div>
            <label htmlFor="price_max" className="block text-sm font-medium text-gray-700">Max Price</label>
            <input type="number" id="price_max" name="price_max" value={filters.price_max || ''} onChange={handleFilterChange} placeholder="e.g., 1500" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" />
          </div>
          <div>
            <label htmlFor="ram" className="block text-sm font-medium text-gray-700">RAM</label>
            <select id="ram" name="ram" value={filters.ram} onChange={handleFilterChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary">
              <option value="">Any RAM</option>
              {RAM_OPTIONS.map(ram => <option key={ram} value={ram}>{ram}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="storage" className="block text-sm font-medium text-gray-700">Storage</label>
            <select id="storage" name="storage" value={filters.storage} onChange={handleFilterChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary">
              <option value="">Any Storage</option>
              {STORAGE_OPTIONS.map(storage => <option key={storage} value={storage}>{storage}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="rating_min" className="block text-sm font-medium text-gray-700">Min Rating (1-5)</label>
            <input type="number" id="rating_min" name="rating_min" value={filters.rating_min || ''} onChange={handleFilterChange} placeholder="e.g., 4" min="1" max="5" step="0.1" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" />
          </div>
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700">Tags (comma-separated)</label>
            <input type="text" id="tags" name="tags" value={filters.tags} onChange={handleFilterChange} placeholder="e.g., gaming,student" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" />
          </div>
          <div className="flex items-end">
            <button 
                onClick={clearFilters}
                className="w-full bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2.5 px-4 rounded-md transition-colors"
            >
                Clear Filters
            </button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <Spinner size="lg" />
      ) : error ? (
        // Using Alert component for consistency, assuming it's available globally or imported
        <Alert type="error" message={error} />
      ) : laptops.length > 0 ? (
        <>
          <p className="text-gray-600 mb-4 text-sm">Showing {laptops.length} of {totalItems} laptops.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {laptops.map(laptop => (
              <LaptopCard key={laptop.id} laptop={laptop} />
            ))}
          </div>
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        </>
      ) : (
        <p className="text-center text-gray-600 text-xl mt-10">No laptops found matching your criteria. Try adjusting your filters!</p>
      )}
    </div>
  );
};

export default LaptopsPage;
