
import React, { useState, useEffect } from 'react';
import { Laptop, ApiError } from '../types';
import * as apiService from '../services/apiService';
import Spinner from './Spinner';
import Alert from './Alert';
import { BRAND_OPTIONS, RAM_OPTIONS, STORAGE_OPTIONS, OS_OPTIONS } from '../constants';
import toast from 'react-hot-toast';

interface LaptopFormModalProps {
  laptop: Laptop | null;
  onClose: () => void;
  onSuccess: () => void;
}

// Define the structure of the form data, excluding auto-generated fields
// but including all fields needed for creation/update.
type LaptopFormData = Omit<Laptop, 'id' | 'createdAt' | 'updatedAt'> & {
    tagsString?: string; // For handling tags as a comma-separated string in the form
};


const LaptopFormModal: React.FC<LaptopFormModalProps> = ({ laptop, onClose, onSuccess }) => {
  const initialFormData: LaptopFormData = {
    brand: '', 
    model: '', 
    processor: '', // Renamed from cpu
    ram: RAM_OPTIONS[0] || '', 
    storage: STORAGE_OPTIONS[0] || '', 
    screenSize: '', 
    os: OS_OPTIONS[0] || '', 
    price: 0, 
    stock: 0, 
    description: '', 
    imageUrl: '',
    gpu: '',        // New field
    rating: 0,      // New field
    tags: [],       // New field (actual array)
    tagsString: '', // Helper for form input
  };

  const [formData, setFormData] = useState<LaptopFormData>(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (laptop) {
      setFormData({
        brand: laptop.brand,
        model: laptop.model,
        processor: laptop.processor,
        ram: laptop.ram,
        storage: laptop.storage,
        screenSize: laptop.screenSize || '',
        os: laptop.os || '',
        price: laptop.price,
        stock: laptop.stock,
        description: laptop.description || '',
        imageUrl: laptop.imageUrl || '',
        gpu: laptop.gpu || '',
        rating: laptop.rating || 0,
        tags: laptop.tags || [],
        tagsString: (laptop.tags || []).join(', '),
      });
    } else {
       setFormData(initialFormData);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [laptop]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      const updatedState = { ...prev } as LaptopFormData & { [key: string]: any }; // Type assertion for dynamic key access
      let processedValue: any = value;

      if (name === 'price' || name === 'stock' || name === 'rating') {
        let numValue = parseFloat(value);
        if (isNaN(numValue)) {
            numValue = 0; // Default to 0 if parsing fails
        }

        if (name === 'rating') {
            // Clamp rating between 0 and 5
            numValue = Math.max(0, Math.min(5, numValue));
        }
        processedValue = numValue;
      }
      
      updatedState[name] = processedValue;

      if (name === 'tagsString') {
        // Ensure tagsString is correctly assigned as string, and tags array is updated
        updatedState.tagsString = value; 
        updatedState.tags = value.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
      }
      
      return updatedState as LaptopFormData; // Cast back to LaptopFormData
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Prepare payload by removing helper fields like tagsString
    const { tagsString, ...payload } = formData;
    
    // Ensure rating is a number
    payload.rating = Number(payload.rating) || 0;


    try {
      if (laptop && laptop.id) {
        await apiService.updateLaptop(laptop.id, payload);
        toast.success('Laptop updated successfully!');
      } else { 
        await apiService.createLaptop(payload);
        toast.success('Laptop added successfully!');
      }
      onSuccess();
    } catch (err) {
      const apiError = err as ApiError;
      let errorMessages = apiError.message;
      if (typeof apiError.errors === 'object' && !Array.isArray(apiError.errors)) { // Zod-like errors
        errorMessages = Object.values(apiError.errors).flat().join('\n');
      } else if (Array.isArray(apiError.errors)) { // Backend specific array of error messages
         errorMessages = apiError.errors.map(e => (e as {message: string}).message).join('\n');
      }
      setError(errorMessages || 'An error occurred. Please try again.');
      toast.error(errorMessages || 'Operation failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">{laptop ? 'Edit Laptop' : 'Add New Laptop'}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <div>
              <label htmlFor="brand" className="block text-sm font-medium text-gray-700">Brand</label>
              <select name="brand" id="brand" value={formData.brand} onChange={handleChange} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary">
                <option value="" disabled>Select Brand</option>
                {BRAND_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="model" className="block text-sm font-medium text-gray-700">Model</label>
              <input type="text" name="model" id="model" value={formData.model} onChange={handleChange} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" />
            </div>
            <div>
              <label htmlFor="processor" className="block text-sm font-medium text-gray-700">Processor</label>
              <input type="text" name="processor" id="processor" value={formData.processor} onChange={handleChange} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" />
            </div>
             <div>
              <label htmlFor="gpu" className="block text-sm font-medium text-gray-700">GPU (Optional)</label>
              <input type="text" name="gpu" id="gpu" value={formData.gpu} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" />
            </div>
            <div>
              <label htmlFor="ram" className="block text-sm font-medium text-gray-700">RAM</label>
              <select name="ram" id="ram" value={formData.ram} onChange={handleChange} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary">
                {RAM_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="storage" className="block text-sm font-medium text-gray-700">Storage</label>
              <select name="storage" id="storage" value={formData.storage} onChange={handleChange} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary">
                {STORAGE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="screenSize" className="block text-sm font-medium text-gray-700">Screen Size (e.g., 15.6 inch)</label>
              <input type="text" name="screenSize" id="screenSize" value={formData.screenSize} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" />
            </div>
            <div>
              <label htmlFor="os" className="block text-sm font-medium text-gray-700">Operating System</label>
              <select name="os" id="os" value={formData.os} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary">
                 {OS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price ($)</label>
              <input type="number" name="price" id="price" value={formData.price} onChange={handleChange} required min="0" step="0.01" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" />
            </div>
            <div>
              <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Stock</label>
              <input type="number" name="stock" id="stock" value={formData.stock} onChange={handleChange} required min="0" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" />
            </div>
            <div>
              <label htmlFor="rating" className="block text-sm font-medium text-gray-700">Rating (0-5, optional)</label>
              <input type="number" name="rating" id="rating" value={formData.rating} onChange={handleChange} min="0" max="5" step="0.1" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" />
            </div>
            <div>
              <label htmlFor="tagsString" className="block text-sm font-medium text-gray-700">Tags (comma-separated, optional)</label>
              <input type="text" name="tagsString" id="tagsString" value={formData.tagsString} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" placeholder="e.g. gaming, student, lightweight" />
            </div>
             <div className="md:col-span-2">
              <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">Image URL (Optional)</label>
              <input type="url" name="imageUrl" id="imageUrl" value={formData.imageUrl} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" placeholder="https://example.com/image.jpg" />
            </div>
          </div>
          
          <div className="md:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description (Optional)</label>
            <textarea name="description" id="description" value={formData.description} onChange={handleChange} rows={3} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"></textarea>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
              Cancel
            </button>
            <button type="submit" disabled={isLoading} className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-light disabled:bg-gray-400">
              {isLoading ? <Spinner size="sm" color="text-white"/> : (laptop ? 'Save Changes' : 'Add Laptop')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LaptopFormModal;
