
import React from 'react';
import { useAuth } from '../hooks/useAuth';
import Spinner from '../components/Spinner';

const ProfilePage: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user) {
    // This should ideally be handled by ProtectedRoute, but as a fallback:
    return <p className="text-center text-red-500">User not found. Please log in.</p>;
  }

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-xl rounded-lg p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4">Your Profile</h1>
      <div className="space-y-4">
        <div>
          <p className="text-sm font-medium text-gray-500">Username</p>
          <p className="text-lg text-gray-800">{user.username}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Email</p>
          <p className="text-lg text-gray-800">{user.email}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Role</p>
          <p className="text-lg text-gray-800 capitalize">{user.role}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">User ID</p>
          <p className="text-lg text-gray-800 break-all">{user.id}</p>
        </div>
        {/* Add more profile information or actions here, e.g., change password */}
      </div>
      <div className="mt-8 border-t pt-6">
        <button className="bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded transition-colors">
            Edit Profile (Not Implemented)
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
    