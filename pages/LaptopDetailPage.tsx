
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Laptop } from '../types';
import * as apiService from '../services/apiService';
import Spinner from '../components/Spinner';
import Alert from '../components/Alert';

const StarRatingDetail: React.FC<{ rating?: number }> = ({ rating = 0 }) => {
  const totalStars = 5;
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5; // Basic half-star logic
  const emptyStars = totalStars - fullStars - (halfStar ? 1 : 0);

  return (
    <div className="flex items-center my-2">
      {[...Array(fullStars)].map((_, i) => (
        <svg key={`full-${i}`} className="w-6 h-6 text-yellow-400 fill-current" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>
      ))}
      {halfStar && (
         <svg key="half" className="w-6 h-6 text-yellow-400 fill-current" viewBox="0 0 20 20"> {/* Placeholder for half star, ideally use a proper half star SVG or clip-path */}
            <defs><clipPath id="halfStarClip"><rect x="0" y="0" width="10" height="20" /></clipPath></defs>
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" clipPath="url(#halfStarClip)"/>
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" fillOpacity="0.3" /> {/* Dimmed full star for empty part */}
        </svg>
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <svg key={`empty-${i}`} className="w-6 h-6 text-gray-300 fill-current" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>
      ))}
      {rating > 0 && <span className="ml-2 text-lg text-gray-600">({rating.toFixed(1)} / 5)</span>}
    </div>
  );
};

const LaptopDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [laptop, setLaptop] = useState<Laptop | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const fetchLaptop = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const data = await apiService.getLaptopById(id);
          setLaptop(data);
        } catch (err) {
          console.error("Failed to fetch laptop details:", err);
          setError("Failed to load laptop details. It might not exist or there was a server error.");
        } finally {
          setIsLoading(false);
        }
      };
      fetchLaptop();
    } else {
      setError("No laptop ID provided.");
      setIsLoading(false);
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <Alert type="error" message={error} />
        <Link to="/laptops" className="mt-4 inline-block bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded">
          Back to Laptops
        </Link>
      </div>
    );
  }

  if (!laptop) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-xl text-gray-600">Laptop not found.</p>
        <Link to="/laptops" className="mt-4 inline-block bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded">
          Back to Laptops
        </Link>
      </div>
    );
  }
  
  const placeholderImageUrl = `https://picsum.photos/seed/${laptop.id}/800/600`;

  return (
    <div className="bg-white shadow-xl rounded-lg p-8 md:p-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
        <div>
          <img 
            src={laptop.imageUrl || placeholderImageUrl} 
            alt={`${laptop.brand} ${laptop.model}`} 
            className="w-full h-auto max-h-[500px] object-contain rounded-lg shadow-md"
          />
        </div>
        <div className="space-y-6">
          <h1 className="text-4xl font-bold text-gray-800">{laptop.brand} {laptop.model}</h1>
          
          {laptop.rating !== undefined && laptop.rating > 0 && <StarRatingDetail rating={laptop.rating} />}
          
          <p className="text-3xl font-semibold text-primary">${laptop.price.toFixed(2)}</p>

          {laptop.description && <p className="text-gray-700 text-lg leading-relaxed">{laptop.description}</p>}
          
          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Specifications</h2>
            <ul className="space-y-2 text-gray-600">
              <li><strong>Processor:</strong> {laptop.processor}</li>
              {laptop.gpu && <li><strong>GPU:</strong> {laptop.gpu}</li>}
              <li><strong>RAM:</strong> {laptop.ram}</li>
              <li><strong>Storage:</strong> {laptop.storage}</li>
              {laptop.screenSize && <li><strong>Screen Size:</strong> {laptop.screenSize}</li>}
              {laptop.os && <li><strong>Operating System:</strong> {laptop.os}</li>}
              <li><strong>Stock:</strong> <span className={laptop.stock > 0 ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>{laptop.stock > 0 ? `${laptop.stock} units available` : 'Out of Stock'}</span></li>
            </ul>
          </div>

          {laptop.tags && laptop.tags.length > 0 && (
            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-2xl font-semibold text-gray-700 mb-3">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {laptop.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 text-sm bg-secondary text-white rounded-full shadow-sm">{tag}</span>
                ))}
              </div>
            </div>
          )}


          <div className="mt-8 flex space-x-4">
            <button 
              disabled={laptop.stock === 0}
              className="bg-accent hover:bg-accent-dark text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {laptop.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>
            <Link 
              to="/laptops" 
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-lg text-lg transition-colors"
            >
              Back to Laptops
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LaptopDetailPage;
