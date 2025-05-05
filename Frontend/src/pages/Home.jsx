import { Link } from 'react-router-dom';
import Profile from '../components/ProfileBtn';
import { UserData } from '../contexts/UserContext';
import PageLoader from '../components/PageLoading';

export default function HomePage() {
  const {isAuth, isloading} = UserData();

  if(isloading) return <PageLoader/>;
  
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Navigation Bar */}
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              {/* Logo/Title */}
              <div className="flex items-center">
                <div className="flex-shrink-0 flex items-center">
                  <svg
                    className="h-8 w-8 text-indigo-600"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2a10 10 0 100 20 10 10 0 000-20zm3 7a1 1 0 10-2 0v6a1 1 0 102 0V9zm-7 1a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="ml-2 text-xl font-bold text-gray-900">
                    BlockVote
                  </span>
                </div>
              </div>

              {/* Login/Register Buttons */}
              {isAuth? <Profile/> :(<div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
                >
                  Register
                </Link>
              </div>)}
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">Decentralized</span>
              <span className="block text-indigo-600">Voting Platform</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Secure, transparent, and tamper-proof voting powered by blockchain technology.
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <div className="rounded-md shadow">
                <Link
                  to="/elections"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
                >
                  View Elections
                </Link>
              </div>
              <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                <Link
                  to="/about"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {[
              {
                name: 'Immutable Records',
                description: 'All votes are permanently recorded on the blockchain, preventing tampering or fraud.',
                icon: '🔒',
              },
              {
                name: 'Transparent Process',
                description: 'Every step of the voting process is verifiable by all participants.',
                icon: '👁️',
              },
              {
                name: 'Secure Identity',
                description: 'Cryptographic verification ensures only eligible voters can participate.',
                icon: '🆔',
              },
            ].map((feature) => (
              <div key={feature.name} className="bg-white p-6 rounded-lg shadow">
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-medium text-gray-900">{feature.name}</h3>
                <p className="mt-2 text-gray-500">{feature.description}</p>
              </div>
            ))}
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white mt-12">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <p className="text-center text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} BlockVote. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}