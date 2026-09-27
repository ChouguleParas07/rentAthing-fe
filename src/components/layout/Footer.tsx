import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="text-2xl font-bold text-green-600 tracking-tight">Stashly</Link>
            <p className="mt-4 text-sm text-gray-500">
              Rent what you need, share what you have. Stashly is the premier community marketplace for peer-to-peer rentals.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Platform</h3>
            <ul className="mt-4 space-y-3">
              <li><Link to="/products" className="text-sm text-gray-500 hover:text-green-600 transition-colors">Browse Items</Link></li>
              <li><Link to="/dashboard" className="text-sm text-gray-500 hover:text-green-600 transition-colors">List an Item</Link></li>
              <li><Link to="/how-it-works" className="text-sm text-gray-500 hover:text-green-600 transition-colors">How it Works</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Support</h3>
            <ul className="mt-4 space-y-3">
              <li><Link to="/faq" className="text-sm text-gray-500 hover:text-green-600 transition-colors">FAQ</Link></li>
              <li><a href="https://code-it-green.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-500 hover:text-green-600 transition-colors">Contact Us</a></li>
              <li><Link to="/trust" className="text-sm text-gray-500 hover:text-green-600 transition-colors">Trust & Safety</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Legal</h3>
            <ul className="mt-4 space-y-3">
              <li><Link to="/terms" className="text-sm text-gray-500 hover:text-green-600 transition-colors">Terms of Service</Link></li>
              <li><Link to="/privacy" className="text-sm text-gray-500 hover:text-green-600 transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

        </div>

        <div className="mt-12 border-t border-gray-200 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-base text-gray-400">
            &copy; {new Date().getFullYear()} Stashly. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0 text-sm">
            <a href="#" className="text-gray-400 hover:text-green-600 transition-colors">Facebook</a>
            <a href="#" className="text-gray-400 hover:text-green-600 transition-colors">Instagram</a>
            <a href="#" className="text-gray-400 hover:text-green-600 transition-colors">Twitter</a>
            <a href="#" className="text-gray-400 hover:text-green-600 transition-colors">LinkedIn</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;