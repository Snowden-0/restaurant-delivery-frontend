import { UtensilsCrossed, MapPin, Phone, Mail } from 'lucide-react';

const CONTACT_ICONS_CLASS = 'flex items-center space-x-2';
const QUICK_LINKS_CLASS = 'text-gray-400 hover:text-white transition-colors';
const COPYRIGHT_CLASS = 'border-t border-gray-800 mt-8 pt-8 text-center text-gray-400';
const FOOTER_CLASS = 'bg-gray-900 text-white py-12';
const FOOTER_ITEMS_CLASS = 'grid grid-cols-1 md:grid-cols-4 gap-8';

const Footer = () => {
  return (
    <footer className={FOOTER_CLASS}>
      <div className="max-w-7xl mx-auto px-4">
        <div className={FOOTER_ITEMS_CLASS}>
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-white p-2 rounded-lg">
                <UtensilsCrossed className="text-gray-900" size={20} />
              </div>
              <h3 className="text-lg font-semibold">FoodieExpress</h3>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              Your favorite meals delivered hot and fresh. We connect you with the best restaurants in your area.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#" className={QUICK_LINKS_CLASS}>About Us</a></li>
              <li><a href="#" className={QUICK_LINKS_CLASS}>Restaurants</a></li>
              <li><a href="#" className={QUICK_LINKS_CLASS}>Careers</a></li>
              <li><a href="#" className={QUICK_LINKS_CLASS}>Blog</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-400">
              <li className={CONTACT_ICONS_CLASS}>
                <MapPin size={14} />
                <span>123 Food Street, City</span>
              </li>
              <li className={CONTACT_ICONS_CLASS}>
                <Phone size={14} />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className={CONTACT_ICONS_CLASS}>
                <Mail size={14} />
                <span>info@foodieexpress.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className={COPYRIGHT_CLASS}>
          <p>&copy; 2025 FoodieExpress. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;