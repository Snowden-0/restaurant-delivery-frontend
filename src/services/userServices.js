export const fetchProfile = async () => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No authentication token found.');
    }

    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, 
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch profile data.');
    }

    const data = await response.json();
    return data.user;
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
};