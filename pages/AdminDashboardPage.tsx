
import React, { useState, useEffect, useCallback } from 'react';
import { Laptop, ApiError } from '../types'; // Ensure ApiError is imported if used for error typing
import * as apiService from '../services/apiService';
import Spinner from '../components/Spinner';
import Alert from '../components/Alert';
import Pagination from '../components/Pagination';
import { DEFAULT_PAGE_LIMIT } from '../constants';
import toast from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom'; // Import useNavigate and Link

const AdminDashboardPage: React.FC = () => {
  const [laptops, setLaptops] = useState<Laptop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const navigate = useNavigate(); // Initialize useNavigate

  const fetchLaptops = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiService.getLaptops({ 
        page: currentPage, 
        limit: DEFAULT_PAGE_LIMIT,
      });
      setLaptops(response.data);
      setTotalPages(response.meta.totalPages);
      setCurrentPage(response.meta.page);
    } catch (err) {
      console.error("Failed to fetch laptops for admin:", err);
      const apiError = err as ApiError; // Type assertion
      const errorMessage = apiError?.message || "Failed to load laptops. Please try again later.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchLaptops();
  }, [fetchLaptops]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  const handleDeleteLaptop = async (laptopId: string) => {
    if (window.confirm("Are you sure you want to delete this laptop? This action cannot be undone.")) {
      try {
        await apiService.deleteLaptop(laptopId);
        toast.success("Laptop deleted successfully!");
        if (laptops.length === 1 && currentPage > 1) {
            setCurrentPage(prev => prev -1); // Triggers refetch due to dependency change
        } else {
            fetchLaptops(); // Refresh the list
        }
      } catch (err) {
        console.error("Failed to delete laptop:", err);
        const apiError = err as ApiError;
        toast.error(apiError?.message || "Failed to delete laptop. Please try again.");
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Manage Laptops</h1>
        <button
          onClick={() => navigate('/admin/laptops/new')} // Navigate to CreateLaptopPage
          className="bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add New Laptop
        </button>
      </div>

      {isLoading ? (
        <Spinner size="lg" />
      ) : error ? (
        <Alert type="error" message={error} />
      ) : laptops.length > 0 ? (
        <>
          <div className="bg-white shadow-md rounded-lg overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brand & Model</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {laptops.map(laptop => (
                  <tr key={laptop.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img src={laptop.imageUrl || `https://picsum.photos/seed/${laptop.id}/50/50`} alt={laptop.model} className="w-12 h-12 object-cover rounded"/>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{laptop.brand}</div>
                      <div className="text-sm text-gray-500">{laptop.model}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${laptop.price.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${laptop.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {laptop.stock}
                        </span>
                    </td>
                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {laptop.rating !== undefined ? laptop.rating.toFixed(1) : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <Link to={`/admin/laptops/edit/${laptop.id}`} className="text-primary-dark hover:text-primary transition-colors">Edit</Link>
                      <button onClick={() => handleDeleteLaptop(laptop.id)} className="text-red-600 hover:text-red-800 transition-colors">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        </>
      ) : (
        <p className="text-center text-gray-600 text-xl mt-10">No laptops found. Add one to get started!</p>
      )}
      {/* LaptopFormModal removed from here */}
    </div>
  );
};

export default AdminDashboardPage;