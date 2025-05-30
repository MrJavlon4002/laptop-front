
import React from 'react';
import { Link } from 'react-router-dom';
import { Laptop } from '../types';

interface LaptopCardProps {
  laptop: Laptop;
}

const StarRating: React.FC<{ rating?: number }> = ({ rating = 0 }) => {
  const totalStars = 5;
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = totalStars - fullStars - (halfStar ? 1 : 0);

  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, i) => (
        <svg key={`full-${i}`} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>
      ))}
      {halfStar && (
        <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20"> {/* Basic half star, can be improved with clip-path */}
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z M10 12.4V0L7.53 5.045l-5.67.82L6.18 9.78l-1.03 5.66L10 12.4z"/>
        </svg>
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <svg key={`empty-${i}`} className="w-4 h-4 text-gray-300 fill-current" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>
      ))}
      {rating > 0 && <span className="ml-1 text-xs text-gray-500">({rating.toFixed(1)})</span>}
    </div>
  );
};


const LaptopCard: React.FC<LaptopCardProps> = ({ laptop }) => {
  const placeholderImageUrl = `https://picsum.photos/seed/${laptop.id}/400/300`;

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 flex flex-col">
      <img 
        src={laptop.imageUrl || placeholderImageUrl} 
        alt={`${laptop.brand} ${laptop.model}`} 
        className="w-full h-48 object-cover" 
      />
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-semibold text-gray-800 mb-1">{laptop.brand} {laptop.model}</h3>
        
        {laptop.rating !== undefined && laptop.rating > 0 && (
          <div className="mb-2">
            <StarRating rating={laptop.rating} />
          </div>
        )}

        <p className="text-gray-600 text-sm mb-1 line-clamp-1" title={laptop.processor}>Processor: {laptop.processor}</p>
        <p className="text-gray-600 text-sm mb-1">RAM: {laptop.ram}</p>
        <p className="text-gray-600 text-sm mb-1">Storage: {laptop.storage}</p>
        {laptop.gpu && <p className="text-gray-600 text-sm mb-1 line-clamp-1" title={laptop.gpu}>GPU: {laptop.gpu}</p>}

        {laptop.tags && laptop.tags.length > 0 && (
          <div className="my-2 flex flex-wrap gap-1">
            {laptop.tags.slice(0, 3).map(tag => ( // Show max 3 tags
              <span key={tag} className="px-2 py-0.5 text-xs bg-secondary text-white rounded-full">{tag}</span>
            ))}
          </div>
        )}
        
        <div className="mt-auto pt-2">
          <p className="text-2xl font-bold text-primary mb-4">${laptop.price.toFixed(2)}</p>
          <Link 
            to={`/laptops/${laptop.id}`} 
            className="w-full block text-center bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LaptopCard;
