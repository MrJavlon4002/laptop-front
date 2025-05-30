
import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ size = 'md', color = 'text-primary' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  return (
    <div className="flex justify-center items-center">
      <div 
        className={`animate-spin rounded-full border-t-2 border-b-2 ${sizeClasses[size]} ${color} border-opacity-50`}
        style={{ borderTopColor: 'currentColor', borderRightColor: 'transparent', borderBottomColor: 'currentColor', borderLeftColor: 'transparent' }}
      ></div>
    </div>
  );
};

export default Spinner;
    