import React from 'react';
import { Link } from 'react-router-dom';
import LoginForm from '../../components/auth/LoginForm';

const MAIN_DIV_CLASS = 'min-h-screen flex items-center justify-center bg-gray-900';
const LOGIN_DIV_CLASS = 'bg-gray-200 p-8 rounded-lg shadow-md w-full max-w-md';
const CREATE_ACCOUNT_LINK_CLASS = 'text-blue-600 hover:text-blue-800 hover:underline';
const LOGIN_TEXT_CLASS = 'text-2xl font-bold text-center mb-6 text-gray-800';

const LoginPage = ({ onLogin }) => {
  return (
    <div className={MAIN_DIV_CLASS}>
    <div className={LOGIN_DIV_CLASS}>
      <h1 className={LOGIN_TEXT_CLASS}>Login</h1>
      <LoginForm onLogin={onLogin} />
      <div className="mt-4 text-center">
        <Link 
          to="/signup" 
          className={CREATE_ACCOUNT_LINK_CLASS}
        >
          Create Account
        </Link>
      </div>
    </div>
    </div>
  );
};

export default LoginPage;