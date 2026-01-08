import { Link } from 'react-router-dom';
import Profile from '../components/ProfileBtn';
import { UserData } from '../contexts/UserContext';
import PageLoader from '../components/PageLoading';
import { Suspense, useEffect, useRef } from 'react';

export default function HomePage() {
  const { isAuth, isloading, isAdmin } = UserData();
  const featuresRef = useRef(null);

  
  // Scroll-triggered animation for features section
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-slide-in');
          }
        });
      },
      { threshold: 0.2 }
    );

    if (featuresRef.current) {
      observer.observe(featuresRef.current);
    }

    return () => {
      if (featuresRef.current) {
        observer.unobserve(featuresRef.current);
      }
    };
  }, []);

  if (isloading) 
    return <PageLoader />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-100">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-lg sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo/Title */}
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <svg
                  className="h-10 w-10 text-teal-600 transform hover:scale-110 transition-transform duration-300"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2a10 10 0 100 20 10 10 0 000-20zm3 7a1 1 0 10-2 0v6a1 1 0 102 0V9zm-7 1a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="ml-3 text-2xl font-extrabold text-gray-900 tracking-tight">
                  BlockVote
                </span>
              </div>
            </div>

            {/* Login/Register Buttons or Profile */}
            <div className="flex items-center space-x-4">
              {isAuth ? (
                <Suspense fallback={<PageLoader/>} >
                  <h2 className='font-bold my-2 text-2xl'>{isAdmin && "Admin"}</h2>
                  <Profile />
                </Suspense>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transform hover:scale-105 transition-all duration-300"
                    aria-label="Log in to your account"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 text-sm font-medium rounded-md text-white bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transform hover:scale-105 transition-all duration-300"
                    aria-label="Register a new account"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center animate-fade-in">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-gray-900">
            <span className="block">Secure & Decentralized</span>
            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-600">
              Voting Platform
            </span>
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg sm:text-xl text-gray-600 leading-relaxed">
            Empower transparent and tamper-proof elections with blockchain technology.
          </p>
          <div className="mt-8 max-w-xl mx-auto sm:flex sm:justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            {isAuth && (<Link
              to="/elections"
              className="w-full sm:w-auto flex items-center justify-center px-8 py-3 text-base font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transform hover:scale-105 transition-all duration-300 shadow-lg"
              aria-label="View active elections"
            >
              View Elections
            </Link>)}
            <Link
              to="/result"
              className="w-full sm:w-auto flex items-center justify-center px-8 py-3 text-base font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transform hover:scale-105 transition-all duration-300 shadow-lg"
              aria-label="View active elections"
            >
              Results
            </Link>
            {isAdmin && <Link
              to="/create-election"
              className="w-full sm:w-auto flex items-center justify-center px-8 py-3 text-base font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transform hover:scale-105 transition-all duration-300 shadow-lg"
              aria-label="View active elections"
            >
              Create Election
            </Link>}
            {/* <Link
              to="/about"
              className="w-full sm:w-auto flex items-center justify-center px-8 py-3 text-base font-medium rounded-md text-teal-600 bg-white hover:bg-teal-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transform hover:scale-105 transition-all duration-300 shadow-lg"
              aria-label="Learn more about BlockVote"
            >
              Learn More
            </Link> */}
          </div>
        </div>

        {/* Features Section */}
        <div ref={featuresRef} className="mt-20 grid gap-8 sm:grid-cols-2 md:grid-cols-3">
          {[
            {
              name: 'Immutable Records',
              description: 'Votes are permanently recorded on the blockchain, ensuring no tampering or fraud.',
              icon: '🔒',
            },
            {
              name: 'Transparent Process',
              description: 'Every vote and process is publicly verifiable, fostering trust in elections.',
              icon: '👁️',
            },
            {
              name: 'Secure Identity',
              description: 'Cryptographic verification ensures only eligible voters can participate.',
              icon: '🆔',
            },
          ].map((feature) => (
            <div
              key={feature.name}
              className="relative bg-white bg-opacity-80 backdrop-blur-md p-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 border border-teal-100"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-teal-600 rounded-t-xl"></div>
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900">{feature.name}</h3>
              <p className="mt-3 text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-blue-600 to-teal-600 text-white">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3">
              <svg
                className="h-8 w-8"
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
              <span className="text-lg font-bold">BlockVote</span>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-6">
              <Link to="/about" className="text-sm hover:underline" aria-label="About BlockVote">
                About
              </Link>
              <Link to="/contact" className="text-sm hover:underline" aria-label="Contact us">
                Contact
              </Link>
              <Link to="/privacy" className="text-sm hover:underline" aria-label="Privacy policy">
                Privacy
              </Link>
            </div>
          </div>
          <p className="mt-6 text-center text-sm opacity-80">
            © {new Date().getFullYear()} BlockVote. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

// import { Link } from 'react-router-dom';
// import Profile from '../components/ProfileBtn';
// import { UserData } from '../contexts/UserContext';
// import PageLoader from '../components/PageLoading';

// export default function HomePage() {
//   const {isAuth, isloading} = UserData();

//   if(isloading) return <PageLoader/>;
  
//   return (
//     <>
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
//         {/* Navigation Bar */}
//         <nav className="bg-white shadow-sm">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//             <div className="flex justify-between h-16">
//               {/* Logo/Title */}
//               <div className="flex items-center">
//                 <div className="flex-shrink-0 flex items-center">
//                   <svg
//                     className="h-8 w-8 text-indigo-600"
//                     xmlns="http://www.w3.org/2000/svg"
//                     viewBox="0 0 24 24"
//                     fill="currentColor"
//                   >
//                     <path
//                       fillRule="evenodd"
//                       d="M12 2a10 10 0 100 20 10 10 0 000-20zm3 7a1 1 0 10-2 0v6a1 1 0 102 0V9zm-7 1a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"
//                       clipRule="evenodd"
//                     />
//                   </svg>
//                   <span className="ml-2 text-xl font-bold text-gray-900">
//                     BlockVote
//                   </span>
//                 </div>
//               </div>

//               {/* Login/Register Buttons */}
//               {isAuth? <Profile/> :(<div className="flex items-center space-x-4">
//                 <Link
//                   to="/login"
//                   className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
//                 >
//                   Login
//                 </Link>
//                 <Link
//                   to="/register"
//                   className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
//                 >
//                   Register
//                 </Link>
//               </div>)}
//             </div>
//           </div>
//         </nav>

//         {/* Hero Section */}
//         <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
//           <div className="text-center">
//             <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
//               <span className="block">Decentralized</span>
//               <span className="block text-indigo-600">Voting Platform</span>
//             </h1>
//             <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
//               Secure, transparent, and tamper-proof voting powered by blockchain technology.
//             </p>
//             <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
//               <div className="rounded-md shadow">
//                 <Link
//                   to="/elections"
//                   className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
//                 >
//                   View Elections
//                 </Link>
//               </div>
//               <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
//                 <Link
//                   to="/about"
//                   className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
//                 >
//                   Learn More
//                 </Link>
//               </div>
//             </div>
//           </div>

//           {/* Features Section */}
//           <div className="mt-16 grid gap-8 md:grid-cols-3">
//             {[
//               {
//                 name: 'Immutable Records',
//                 description: 'All votes are permanently recorded on the blockchain, preventing tampering or fraud.',
//                 icon: '🔒',
//               },
//               {
//                 name: 'Transparent Process',
//                 description: 'Every step of the voting process is verifiable by all participants.',
//                 icon: '👁️',
//               },
//               {
//                 name: 'Secure Identity',
//                 description: 'Cryptographic verification ensures only eligible voters can participate.',
//                 icon: '🆔',
//               },
//             ].map((feature) => (
//               <div key={feature.name} className="bg-white p-6 rounded-lg shadow">
//                 <div className="text-3xl mb-4">{feature.icon}</div>
//                 <h3 className="text-lg font-medium text-gray-900">{feature.name}</h3>
//                 <p className="mt-2 text-gray-500">{feature.description}</p>
//               </div>
//             ))}
//           </div>
//         </main>

//         {/* Footer */}
//         <footer className="bg-white mt-12">
//           <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
//             <p className="text-center text-gray-500 text-sm">
//               &copy; {new Date().getFullYear()} BlockVote. All rights reserved.
//             </p>
//           </div>
//         </footer>
//       </div>
//     </>
//   );
// }