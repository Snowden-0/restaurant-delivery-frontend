import React from 'react';
import { Link } from 'react-router-dom';
import SignupForm from '../../components/auth/SignupForm';

const SignupPage = ({ onSignup }) => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Sign Up</h1>
      <SignupForm onSignup={onSignup} />
      <div className="mt-4 text-center">
        <Link 
          to="/login" 
          className="text-blue-600 hover:text-blue-800 hover:underline"
        >
          Already have an account? Login
        </Link>
      </div>
    </div>
  );
};

export default SignupPage;