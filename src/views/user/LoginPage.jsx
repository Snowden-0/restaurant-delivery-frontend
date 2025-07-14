import React from 'react';
import { Link } from 'react-router-dom';
import LoginForm from '../../components/auth/LoginForm';

const LoginPage = ({ onLogin }) => {
  return (
    <div className="bg-gray-200 p-8 rounded-lg shadow-md w-full max-w-md">
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Login</h1>
      <LoginForm onLogin={onLogin} />
      <div className="mt-4 text-center">
        <Link 
          to="/signup" 
          className="text-blue-600 hover:text-blue-800 hover:underline"
        >
          Create Account
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;