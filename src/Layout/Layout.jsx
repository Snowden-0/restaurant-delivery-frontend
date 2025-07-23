import {Outlet} from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";


const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6"><Outlet /></div>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
