
import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center px-4">
      <img src="https://picsum.photos/seed/404page/500/300" alt="Lost robot" className="w-64 h-auto mb-8 rounded-lg shadow-lg"/>
      <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
      <h2 className="text-3xl font-semibold text-gray-700 mb-6">Oops! Page Not Found.</h2>
      <p className="text-gray-600 mb-8 max-w-md">
        It seems like you've ventured into uncharted territory. The page you're looking for doesn't exist or has been moved.
      </p>
      <Link 
        to="/" 
        className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors shadow-md hover:shadow-lg"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
    