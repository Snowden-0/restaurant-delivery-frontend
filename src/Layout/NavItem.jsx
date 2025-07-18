const NavItem = ({ icon: Icon, label, href, active, onClick, isCollapsed }) => {
  const handleClick = (e) => {
    e.preventDefault();
    if (onClick) {
      onClick(href);
    }
  };

  return (
    <li>
      <a
        href={href}
        onClick={handleClick}
        className={`
          flex items-center space-x-3 px-4 py-4 rounded-lg transition-all duration-200 group
          ${active 
            ? 'bg-gray-900 text-white' 
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
          }
          ${isCollapsed ? 'justify-center' : ''}
        `}
        title={isCollapsed ? label : ''}
      >
        <Icon size={22} />
        {!isCollapsed && <span className="font-medium">{label}</span>}
      </a>
    </li>
  );
};

export default NavItem;