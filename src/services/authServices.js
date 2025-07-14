
const SIGNUP_ERROR = 'Signup failed. Please try again.';
const LOGIN_ERROR = 'Invalid credentials.';

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
      throw new Error(errorData.message || LOGIN_ERROR);
    }

    const data = await response.json();
    localStorage.setItem('authToken', data.token);
    return data; 
  } catch (error) {
    throw error;
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
      throw new Error(errorData.message || SIGNUP_ERROR);
    }

    const data = await response.json();
    return data; 
  } catch (error) {
    throw error; 
  }
};