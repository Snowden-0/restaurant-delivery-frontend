const ItemsPerPageSelector = ({ 
  value, 
  onChange, 
  options = [6, 9, 12, 18, 24],
  label = "Show:",
  className = ""
}) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <label htmlFor="itemsPerPage" className="text-sm text-gray-600 whitespace-nowrap">
        {label}
      </label>
      <select
        id="itemsPerPage"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option} per page
          </option>
        ))}
      </select>
    </div>
  );
};

export default ItemsPerPageSelector;