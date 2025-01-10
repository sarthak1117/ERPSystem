import { useState } from 'react';
import { Link } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const Header = ({ isCollapsed }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className={`bg-white p-2 transition-all duration-300 w-full ${isCollapsed ? 'pl-2 pr-2' : 'pl-2 pr-2'}`}>
      <div className="container mx-auto flex justify-between items-center">
        {/* Left Section: Brand Logo */}
        <div className="flex items-center">
          <Link to="/" className="text-black text-xl font-bold ml-4">
            {/* You can add your brand logo here */}
          </Link>
        </div>

        {/* Right Section: Search and Profile */}
        <div className="flex items-center space-x-4">
          <form className={`hidden md:flex ${isCollapsed ? 'hidden' : 'flex'}`}>
            <input
              type="text"
              className="px-2 py-1 rounded bg-white text-black border border-gray-300"
              placeholder="Search"
            />
            <button
              className="ml-2 px-3 py-1 text-sm bg-green-400 text-black rounded"
              type="submit"
            >
              Search
            </button>
          </form>

          <div className="relative">
            <button
              className="flex items-center text-black"
              onClick={toggleDropdown}
            >
              <AccountCircleIcon />
            </button>

            {isOpen && (
              <ul className="absolute right-0 mt-2 w-48 bg-white text-gray-700 rounded-md shadow-lg py-2">
                <li className="hover:bg-gray-100">
                  <Link to="/profile" className="block px-4 py-2">
                    My Profile
                  </Link>
                </li>
                <li className="hover:bg-gray-100">
                  <Link to="/settings" className="block px-4 py-2">
                    Change Password
                  </Link>
                </li>
                <li className="hover:bg-gray-100">
                  <Link to="/login" className="block px-4 py-2">
                    Logout
                  </Link>
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isCollapsed && (
        <div className="md:hidden mt-4">
          <Link className="block text-black mb-2" to="/dashboard">
            Dashboard
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Header;
