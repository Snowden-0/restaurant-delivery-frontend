const Input = ({ label, id, name, type, value, onChange, required }) => {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
      />
    </div>
  );
};

export default Input;