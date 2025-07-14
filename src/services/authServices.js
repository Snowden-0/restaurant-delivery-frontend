
export const login = async (email, password) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Login failed');
    }

    const data = await response.json();
    // In a real app, you might store the token (e.g., in localStorage or a state management solution)
    localStorage.setItem('authToken', data.token);
    console.log(data.token)
    return data; // Return user data or token
  } catch (error) {
    console.error('Error during login:', error); // Removed for security
    throw error; // Re-throw to be handled by the calling component (App.jsx)
  }
};

export const signup = async (userData) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Signup failed');
    }

    const data = await response.json();
    return data; // Return success message or new user data
  } catch (error) {
    console.error('Error during signup:', error); // Removed for security
    throw error; // Re-throw to be handled by the calling component (App.jsx)
  }
};