const HomePage = ({ onLogout }) => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome!</h1>
      <p className="text-lg text-gray-600 mb-6">
        You're successfully logged in.
      </p>
      <button
        onClick={onLogout}
        className="bg-gray-800 text-white px-6 py-2 rounded-md hover:bg-gray-700 transition"
      >
        Logout
      </button>
    </div>
  );
};

export default HomePage;