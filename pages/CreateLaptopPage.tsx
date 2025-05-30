
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Laptop, ApiError } from '../types';
import * as apiService from '../services/apiService';
import Spinner from '../components/Spinner';
import Alert from '../components/Alert';
import { BRAND_OPTIONS, RAM_OPTIONS, STORAGE_OPTIONS, OS_OPTIONS } from '../constants';
import toast from 'react-hot-toast';

type LaptopFormData = Omit<Laptop, 'id' | 'createdAt' | 'updatedAt'> & {
    tagsString?: string; 
};

const CreateLaptopPage: React.FC = () => {
  const navigate = useNavigate();
  const initialFormData: LaptopFormData = {
    brand: BRAND_OPTIONS[0] || '', 
    model: '', 
    processor: '',
    ram: RAM_OPTIONS[0] || '', 
    storage: STORAGE_OPTIONS[0] || '', 
    screenSize: '', 
    os: OS_OPTIONS[0] || '', 
    price: 0, 
    stock: 0, 
    description: '', 
    imageUrl: '',
    gpu: '',       
    rating: 0,     
    tags: [],      
    tagsString: '',
  };

  const [formData, setFormData] = useState<LaptopFormData>(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      const updatedState = { ...prev } as LaptopFormData & { [key: string]: any };
      let processedValue: any = value;

      if (name === 'price' || name === 'stock' || name === 'rating') {
        let numValue = parseFloat(value);
        if (isNaN(numValue)) numValue = 0;
        if (name === 'rating') numValue = Math.max(0, Math.min(5, numValue));
        processedValue = numValue;
      }
      
      updatedState[name] = processedValue;

      if (name === 'tagsString') {
        updatedState.tagsString = value; 
        updatedState.tags = value.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
      }
      
      return updatedState as LaptopFormData;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const { tagsString, ...payload } = formData;
    payload.rating = Number(payload.rating) || 0;
    payload.tags = payload.tags || []; // Ensure tags is an array

    try {
      await apiService.createLaptop(payload);
      toast.success('Laptop added successfully!');
      navigate('/admin/dashboard');
    } catch (err) {
      const apiError = err as ApiError;
      let errorMessages = apiError.message;
      if (typeof apiError.errors === 'object' && !Array.isArray(apiError.errors)) {
        errorMessages = Object.entries(apiError.errors).map(([key, val]) => `${key}: ${(val as string[]).join(', ')}`).join('\n');
      } else if (Array.isArray(apiError.errors)) {
         errorMessages = apiError.errors.map(e => (e as {message: string}).message).join('\n');
      }
      setError(errorMessages || 'An error occurred. Please try again.');
      toast.error(errorMessages || 'Operation failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Add New Laptop</h1>
        <Link to="/admin/dashboard" className="text-primary hover:text-primary-dark transition-colors">
          &larr; Back to Dashboard
        </Link>
      </div>
      
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-xl">
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
              <input type="text" name="gpu" id="gpu" value={formData.gpu || ''} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" />
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
              <input type="text" name="screenSize" id="screenSize" value={formData.screenSize || ''} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" />
            </div>
            <div>
              <label htmlFor="os" className="block text-sm font-medium text-gray-700">Operating System</label>
              <select name="os" id="os" value={formData.os || OS_OPTIONS[0]} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary">
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
              <input type="number" name="rating" id="rating" value={formData.rating || 0} onChange={handleChange} min="0" max="5" step="0.1" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" />
            </div>
            <div>
              <label htmlFor="tagsString" className="block text-sm font-medium text-gray-700">Tags (comma-separated, optional)</label>
              <input type="text" name="tagsString" id="tagsString" value={formData.tagsString || ''} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" placeholder="e.g. gaming, student, lightweight" />
            </div>
             <div className="md:col-span-2">
              <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">Image URL (Optional)</label>
              <input type="url" name="imageUrl" id="imageUrl" value={formData.imageUrl || ''} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" placeholder="https://example.com/image.jpg" />
            </div>
          </div>
          
          <div className="md:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description (Optional)</label>
            <textarea name="description" id="description" value={formData.description || ''} onChange={handleChange} rows={3} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"></textarea>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Link to="/admin/dashboard" className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
              Cancel
            </Link>
            <button type="submit" disabled={isLoading} className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-light disabled:bg-gray-400">
              {isLoading ? <Spinner size="sm" color="text-white"/> : 'Add Laptop'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateLaptopPage;