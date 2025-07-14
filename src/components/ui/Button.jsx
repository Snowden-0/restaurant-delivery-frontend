
const DEFAULT_BUTTON_CLASS = 'bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition';

const Button = ({ children, type = 'button', onClick, className = '' }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`${DEFAULT_BUTTON_CLASS} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;