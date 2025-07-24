import React, { useState, useEffect } from 'react';
import { fetchProfile } from '../services/userServices';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const { user: authUser, logout } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getProfile = async () => {
      try {
        setLoading(true);
        const data = await fetchProfile();
        setProfileData(data);
      } catch (err) {
        setError(err.message);
        if (err.message.includes('token failed') || err.message.includes('no token')) {
          logout();
        }
      } finally {
        setLoading(false);
      }
    };

    getProfile();
  }, [logout]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-lg text-gray-700">Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <p className="text-lg text-red-600 mb-4">Error: {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4 sm:px-6 lg:px-8">
      {/* Profile Header Section */}
      <div className="relative w-full max-w-4xl bg-white rounded-xl shadow-lg overflow-hidden mb-8">
        <div className="relative h-48 bg-gray-900">
          {/* Optional: Subtle background pattern or texture */}
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'6\' height=\'6\' viewBox=\'0 0 6 6\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.1\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M5 0h1L0 6V5zM6 5v1H5z\'/%3E%3C/g%3E%3C/svg%3E")' }}></div>
        </div>
        <div className="flex flex-col items-center pt-6 px-6 pb-8"> {/* Adjusted padding here */}
          <h1 className="mt-4 text-4xl font-extrabold text-gray-900 drop-shadow-sm">
            {profileData?.name || 'User Name'}
          </h1>
          <p className="text-gray-600 text-lg mt-1 font-medium">{profileData?.email || 'user@example.com'}</p>
        </div>
      </div>

      {/* Profile Details Section */}
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-3 border-b-2 border-gray-200">
          Personal Information
        </h2>

        {profileData ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
              <div>
                <label className="block text-sm font-medium text-gray-500 uppercase tracking-wide">Full Name</label>
                <p className="mt-1 text-lg text-gray-900 font-semibold">{profileData.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 uppercase tracking-wide">Email Address</label>
                <p className="mt-1 text-lg text-gray-900 font-semibold">{profileData.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 uppercase tracking-wide">Phone Number</label>
                <p className="mt-1 text-lg text-gray-900 font-semibold">{profileData.phone_number || 'N/A'}</p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-500 uppercase tracking-wide">Address</label>
                <p className="mt-1 text-lg text-gray-900 font-semibold break-words">{profileData.address || 'N/A'}</p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-600 text-center py-4">No profile data available.</p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;