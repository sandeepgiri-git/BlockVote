import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserCircleIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { UserData } from '../contexts/UserContext';

const Profile = ({ walletAddress = '', isWalletConnected = false }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const {user,logout} = UserData();
  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const navigate = useNavigate();

  return (
    <div className="relative mt-3">
      <button
        onClick={toggleDropdown}
        className="flex items-center space-x-1 p-1.5 rounded-full bg-gradient-to-r from-blue-100 to-teal-100 hover:from-blue-200 hover:to-teal-200 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300"
      >
        <UserCircleIcon className="h-8 w-8 text-teal-600" />
        <ChevronDownIcon className="h-4 w-4 text-gray-600" />
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 animate-fade-in z-50">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <UserCircleIcon className="h-10 w-10 text-teal-600" />
              <div>
                {isWalletConnected ? (
                  <p className="text-xs text-gray-500 font-mono truncate">{walletAddress}</p>
                ) : (
                  <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                )}
              </div>
            </div>
          </div>
          <div className="py-2">
            <Link
              to="/profile"
              onClick={() => setIsDropdownOpen(false)}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-800 transition-colors"
            >
              View Profile
            </Link>
            <Link
              to="/settings"
              onClick={() => setIsDropdownOpen(false)}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-800 transition-colors"
            >
              Settings
            </Link>
            <button
              onClick={() => logout(navigate)}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-800 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;