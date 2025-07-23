import React from 'react';
import { Link } from 'react-router-dom';
import SignupForm from '../../components/auth/SignupForm';

const MAIN_DIV_CLASS = 'min-h-screen flex items-center justify-center bg-gray-900';
const SIGNUP_DIV_CLASS = 'bg-gray-200 p-8 rounded-lg shadow-md w-full max-w-md';
const LOGIN_ACCOUNT_LINK_CLASS = 'text-blue-600 hover:text-blue-800 hover:underline';
const SIGNUP_TEXT_CLASS = 'text-2xl font-bold text-center mb-6 text-gray-800';

const SignupPage = ({ onSignup }) => {
  return (
    <div className={MAIN_DIV_CLASS}>
    <div className={SIGNUP_DIV_CLASS}>
      <h1 className={SIGNUP_TEXT_CLASS}>Sign Up</h1>
      <SignupForm onSignup={onSignup} />
      <div className="mt-4 text-center">
        <Link 
          to="/login" 
          className={LOGIN_ACCOUNT_LINK_CLASS}
        >
          Already have an account? Login
        </Link>
      </div>
    </div>
    </div>
  );
};

export default SignupPage;