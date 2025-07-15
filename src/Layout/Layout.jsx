import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState('/');

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);
  const toggleSidebarCollapse = () => setIsSidebarCollapsed(!isSidebarCollapsed);
  const handleItemClick = (href) => {
    setActiveItem(href);
    // Close mobile sidebar when item is clicked
    if (isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onToggleSidebar={toggleSidebar}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebarCollapse={toggleSidebarCollapse}
        isSidebarCollapsed={isSidebarCollapsed}
      />

      <div className="flex">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={closeSidebar}
          isCollapsed={isSidebarCollapsed}
          activeItem={activeItem}
          onItemClick={handleItemClick}
        />

        <main
          className={`flex-1 ${isSidebarCollapsed ? "lg:ml-24" : "lg:ml-64"}`}
        >
          <div className="p-6 min-h-screen">{children}</div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default Layout;