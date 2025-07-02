// src/components/NotFound.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-800 flex flex-col justify-center items-center text-white px-4">
      <div className="text-center animate-pulse">
        <h1 className="text-[120px] font-extrabold leading-none drop-shadow-md">404</h1>
        <p className="text-2xl mt-4 font-medium">Oops! Page not found.</p>
        <p className="mt-2 text-lg text-gray-200">The page you are looking for doesn’t exist or has been moved.</p>
        <Link
          to="/"
          className="mt-6 inline-block bg-white text-purple-700 font-semibold px-6 py-3 rounded-full shadow-md hover:bg-gray-100 transition duration-300"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
