import { useState } from 'react';
import { ethers } from 'ethers';
import { useNavigate, Link } from 'react-router-dom';
import { UserData } from '../contexts/UserContext';

const RegisterPage = () => {
  const {
    isWalletRegistration,
    setIsWalletRegistration,
    handleSubmit,
    isLoading,
    error,
    success,
    showOtpCard,
    setShowOtpCard,
    handleOtpSubmit,
  } = UserData();

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [otpData, setOtpData] = useState({
    otp: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOtpChange = (e) => {
    const { name, value } = e.target;
    setOtpData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle wallet connection
  const connectWallet = async () => {
    setIsLoading(true);
    setError('');

    try {
      if (!window.ethereum) {
        throw new Error('Please install MetaMask or another Ethereum wallet');
      }

      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      let ensName = null;
      try {
        ensName = await provider.lookupAddress(accounts[0]);
      } catch (e) {
        console.log('No ENS name found');
      }

      setFormData((prev) => ({
        ...prev,
        walletAddress: accounts[0],
        name: ensName || accounts[0].slice(0, 8) + '...' + accounts[0].slice(-4),
        isWalletConnected: true,
      }));

      setSuccess('Wallet connected successfully');
    } catch (err) {
      setError(err.message || 'Failed to connect wallet');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle wallet registration
  const handleWalletRegistration = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      if (!formData.isWalletConnected) {
        throw new Error('Please connect your wallet first');
      }

      // Simulate API call for wallet registration
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setSuccess('Wallet registration complete! Redirecting...');

      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      setError(err.message || 'Wallet registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="mb-4 h-1 bg-gradient-to-r from-blue-600 to-teal-600 rounded mx-auto w-20 animate-fade-in"></div>
        <h2 className="mt-2 text-center text-4xl font-extrabold text-gray-900 animate-fade-in">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-600">
            Create Your Account
          </span>
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 animate-fade-in">
          Join our secure blockchain voting platform
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative">
        <div
          className={`bg-white bg-opacity-80 backdrop-blur-md py-8 px-4 shadow-lg sm:rounded-xl sm:px-10 border border-teal-100 transition-all duration-300 animate-slide-in ${
            showOtpCard ? 'blur-sm' : ''
          }`}
        >
          {/* Toggle between registration methods */}
          <div className="flex justify-center mb-8">
            <div className="relative flex items-center p-1 bg-teal-50 rounded-lg shadow-sm">
              <button
                type="button"
                className={`relative py-2 px-6 rounded-md text-sm font-medium transition-all duration-300 ${
                  !isWalletRegistration
                    ? 'bg-gradient-to-r from-blue-600 to-teal-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-teal-600'
                } focus:outline-none focus:ring-2 focus:ring-teal-500`}
                onClick={() => setIsWalletRegistration(false)}
                aria-label="Switch to email registration"
              >
                Email Registration
              </button>
              <button
                type="button"
                className={`relative py-2 px-6 rounded-md text-sm font-medium transition-all duration-300 ${
                  isWalletRegistration
                    ? 'bg-gradient-to-r from-blue-600 to-teal-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-teal-600'
                } focus:outline-none focus:ring-2 focus:ring-teal-500`}
                onClick={() => setIsWalletRegistration(true)}
                aria-label="Switch to wallet registration"
              >
                Wallet Registration
              </button>
            </div>
          </div>

          {!isWalletRegistration ? (
            // Email/Password Registration Form
            <form className="space-y-6" onSubmit={(e) => handleSubmit(e, formData)}>
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Full Name
                </label>
                <div className="relative mt-1">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white bg-opacity-80 backdrop-blur-md sm:text-sm transition-all duration-300"
                    placeholder="John Doe"
                    aria-label="Full name"
                  />
                  <svg
                    className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email Address
                </label>
                <div className="relative mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white bg-opacity-80 backdrop-blur-md sm:text-sm transition-all duration-300"
                    placeholder="you@example.com"
                    aria-label="Email address"
                  />
                  <svg
                    className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                    />
                  </svg>
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <div className="relative mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white bg-opacity-80 backdrop-blur-md sm:text-sm transition-all duration-300"
                    placeholder="••••••••"
                    aria-label="Password"
                  />
                  <svg
                    className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 11c0-1.1-.9-2-2-2s-2 .9-2 2c0 .74.4 1.38 1 1.73V15h2v-2.27c.6-.35 1-.99 1-1.73zm7-3h-1V6c0-2.76-2.24-5-5-5S8 3.24 8 6v2H7c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-7-5c1.66 0 3 1.34 3 3v2H9V6c0-1.66 1.34-3 3-3zm7 17H7V10h10v10z"
                    />
                  </svg>
                </div>
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirm Password
                </label>
                <div className="relative mt-1">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white bg-opacity-80 backdrop-blur-md sm:text-sm transition-all duration-300"
                    placeholder="••••••••"
                    aria-label="Confirm password"
                  />
                  <svg
                    className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 11c0-1.1-.9-2-2-2s-2 .9-2 2c0 .74.4 1.38 1 1.73V15h2v-2.27c.6-.35 1-.99 1-1.73zm7-3h-1V6c0-2.76-2.24-5-5-5S8 3.24 8 6v2H7c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-7-5c1.66 0 3 1.34 3 3v2H9V6c0-1.66 1.34-3 3-3zm7 17H7V10h10v10z"
                    />
                  </svg>
                </div>
              </div>

              {error && (
                <div className="rounded-md bg-red-50 p-4 border border-red-200 animate-slide-in">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              {success && !showOtpCard && (
                <div className="rounded-md bg-green-50 p-4 border border-green-200 animate-slide-in">
                  <p className="text-sm text-green-800">{success}</p>
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-300 transform hover:scale-105 ${
                    isLoading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                  aria-label="Create account with email"
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Sending OTP...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </div>
            </form>
          ) : (
            // Wallet Registration Section
            <form className="space-y-6" onSubmit={handleWalletRegistration}>
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 animate-fade-in">
                  Register with Your Wallet
                </h3>
                <p className="mt-2 text-sm text-gray-600 animate-fade-in">
                  Securely create an account using your Ethereum wallet
                </p>
              </div>

              {formData.isWalletConnected ? (
                <div className="rounded-md bg-green-50 p-4 border border-green-200 animate-slide-in">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-green-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-green-800">Wallet Connected</h3>
                      <div className="mt-2 text-sm text-green-700">
                        <p className="font-mono">{formData.walletAddress}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-md bg-teal-50 p-4 border border-teal-200 animate-slide-in">
                  <div className="flex">
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-teal-800">Connect Your Wallet</h3>
                      <div className="mt-2 text-sm text-teal-700">
                        <p>Click below to connect your Ethereum wallet</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="rounded-md bg-red-50 p-4 border border-red-200 animate-slide-in">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              {success && (
                <div className="rounded-md bg-green-50 p-4 border border-green-200 animate-slide-in">
                  <p className="text-sm text-green-800">{success}</p>
                </div>
              )}

              <div className="grid grid-cols-1 gap-3">
                {!formData.isWalletConnected ? (
                  <button
                    type="button"
                    onClick={connectWallet}
                    disabled={isLoading}
                    className={`w-full inline-flex justify-center py-3 px-4 border border-gray-200 rounded-md shadow-sm bg-white bg-opacity-80 backdrop-blur-md text-sm font-medium text-gray-700 hover:bg-teal-50 hover:text-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-300 transform hover:scale-105 ${
                      isLoading ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                    aria-label="Connect wallet with MetaMask"
                  >
                    {isLoading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-700"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Connecting...
                      </>
                    ) : (
                      <>
                        <img
                          src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg"
                          alt="MetaMask"
                          className="h-5 w-5 mr-2"
                        />
                        Connect Wallet
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-300 transform hover:scale-105 ${
                      isLoading ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                    aria-label="Complete wallet registration"
                  >
                    {isLoading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Completing Registration...
                      </>
                    ) : (
                      'Complete Registration'
                    )}
                  </button>
                )}
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white bg-opacity-80 text-gray-600">
                    Or register with
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsWalletRegistration(false)}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-300 transform hover:scale-105"
                aria-label="Switch to email registration"
              >
                Email Registration
              </button>
            </form>
          )}

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white bg-opacity-80 text-gray-600">
                  Already have an account?
                </span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link
                to="/login"
                className="font-medium text-teal-600 hover:text-teal-500 transition-colors duration-300"
                aria-label="Sign in to your account"
              >
                Sign in to your account
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* OTP Modal Card */}
      {showOtpCard && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300">
          <div className="bg-white bg-opacity-80 backdrop-blur-md rounded-xl shadow-2xl w-full max-w-md mx-4 sm:mx-auto p-8 transform transition-all duration-300 scale-100 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Verify OTP</h3>
              <button
                onClick={() => setShowOtpCard(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-300"
                aria-label="Close OTP modal"
              >
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <form
              className="space-y-6"
              onSubmit={(e) => handleOtpSubmit(e, otpData.otp, navigate)}
            >
              <div>
                <label
                  htmlFor="otp"
                  className="block text-sm font-medium text-gray-700"
                >
                  Enter OTP
                </label>
                <div className="relative mt-1">
                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    autoComplete="off"
                    required
                    value={otpData.otp}
                    onChange={handleOtpChange}
                    className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white bg-opacity-80 backdrop-blur-md sm:text-sm transition-all duration-300"
                    placeholder="123456"
                    aria-label="OTP code"
                  />
                  <svg
                    className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 11c0-1.1-.9-2-2-2s-2 .9-2 2c0 .74.4 1.38 1 1.73V15h2v-2.27c.6-.35 1-.99 1-1.73zm7-3h-1V6c0-2.76-2.24-5-5-5S8 3.24 8 6v2H7c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-7-5c1.66 0 3 1.34 3 3v2H9V6c0-1.66 1.34-3 3-3zm7 17H7V10h10v10z"
                    />
                  </svg>
                </div>
              </div>

              {error && (
                <div className="rounded-md bg-red-50 p-4 border border-red-200 animate-slide-in">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              {success && (
                <div className="rounded-md bg-green-50 p-4 border border-green-200 animate-slide-in">
                  <p className="text-sm text-green-800">{success}</p>
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-300 transform hover:scale-105 ${
                    isLoading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                  aria-label="Verify OTP"
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Verifying OTP...
                    </>
                  ) : (
                    'Verify OTP'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisterPage;


// import { useState } from 'react';
// import { ethers } from 'ethers';
// import { useNavigate, Link } from 'react-router-dom';
// import { UserData } from '../contexts/UserContext';

// const RegisterPage = () => {

//   const {isWalletRegistration,
//     setIsWalletRegistration,
//     handleSubmit,
//     isLoading,
//     error,
//     success,
//     showOtpCard,
//     setShowOtpCard,
//     handleOtpSubmit
//   } = UserData();

//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     password: '',
//     confirmPassword: ''
//     // walletAddress: '',
//     // isWalletConnected: false,
//   });
//   const [otpData, setOtpData] = useState({
//     otp: ''
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleOtpChange = (e) => {
//     const { name, value } = e.target;
//     setOtpData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   // Handle OTP verification
  

//   // Handle wallet connection
//   const connectWallet = async () => {
//     setIsLoading(true);
//     setError('');
    
//     try {
//       if (!window.ethereum) {
//         throw new Error('Please install MetaMask or another Ethereum wallet');
//       }
      
//       const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
//       const provider = new ethers.BrowserProvider(window.ethereum);
//       const signer = await provider.getSigner();
      
//       let ensName = null;
//       try {
//         ensName = await provider.lookupAddress(accounts[0]);
//       } catch (e) {
//         console.log("No ENS name found");
//       }

//       setFormData(prev => ({
//         ...prev,
//         walletAddress: accounts[0],
//         name: ensName || accounts[0].slice(0, 8) + '...' + accounts[0].slice(-4),
//         isWalletConnected: true
//       }));

//       setSuccess('Wallet connected successfully');
//     } catch (err) {
//       setError(err.message || 'Failed to connect wallet');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Handle wallet registration
//   const handleWalletRegistration = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError('');
//     setSuccess('');

//     try {
//       if (!formData.isWalletConnected) {
//         throw new Error('Please connect your wallet first');
//       }

//       // Simulate API call for wallet registration
//       await new Promise(resolve => setTimeout(resolve, 1500));
      
//       setSuccess('Wallet registration complete! Redirecting...');
      
//       setTimeout(() => navigate('/dashboard'), 2000);
//     } catch (err) {
//       setError(err.message || 'Wallet registration failed');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative">
//       <div className="sm:mx-auto sm:w-full sm:max-w-md">
//         <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
//           Create your account
//         </h2>
//         <p className="mt-2 text-center text-sm text-gray-600">
//           Join our secure blockchain voting platform
//         </p>
//       </div>

//       <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative">
//         <div className={`bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 transition-all duration-300 ${showOtpCard ? 'blur-sm' : ''}`}>
//           {/* Toggle between registration methods */}
//           <div className="flex justify-center mb-8">
//             <div className="relative flex items-center p-1 bg-gray-100 rounded-lg">
//               <button
//                 type="button"
//                 className={`relative py-2 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:z-10 ${!isWalletRegistration ? 'bg-white shadow-sm text-blue-600 font-medium' : 'text-gray-700'}`}
//                 onClick={() => setIsWalletRegistration(false)}
//               >
//                 Email <br /> Registration
//               </button>
//               <button
//                 type="button"
//                 className={`relative py-2 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:z-10 ${isWalletRegistration ? 'bg-white shadow-sm text-blue-600 font-medium' : 'text-gray-700'}`}
//                 onClick={() => setIsWalletRegistration(true)}
//               >
//                 Wallet <br /> Registration
//               </button>
//             </div>
//           </div>

//           {!isWalletRegistration ? (
//             // Email/Password Registration Form
//             <form className="space-y-6" onSubmit={(e) => handleSubmit(e,formData)}>
//               <div>
//                 <label htmlFor="name" className="block text-sm font-medium text-gray-700">
//                   Full Name
//                 </label>
//                 <div className="mt-1">
//                   <input
//                     id="name"
//                     name="name"
//                     type="text"
//                     autoComplete="name"
//                     required
//                     value={formData.name}
//                     onChange={handleChange}
//                     className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label htmlFor="email" className="block text-sm font-medium text-gray-700">
//                   Email address
//                 </label>
//                 <div className="mt-1">
//                   <input
//                     id="email"
//                     name="email"
//                     type="email"
//                     autoComplete="email"
//                     required
//                     value={formData.email}
//                     onChange={handleChange}
//                     className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label htmlFor="password" className="block text-sm font-medium text-gray-700">
//                   Password
//                 </label>
//                 <div className="mt-1">
//                   <input
//                     id="password"
//                     name="password"
//                     type="password"
//                     autoComplete="new-password"
//                     required
//                     value={formData.password}
//                     onChange={handleChange}
//                     className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
//                   Confirm Password
//                 </label>
//                 <div className="mt-1">
//                   <input
//                     id="confirmPassword"
//                     name="confirmPassword"
//                     type="password"
//                     autoComplete="new-password"
//                     required
//                     value={formData.confirmPassword}
//                     onChange={handleChange}
//                     className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                   />
//                 </div>
//               </div>

//               {error && (
//                 <div className="rounded-md bg-red-50 p-4">
//                   <div className="flex">
//                     <div className="ml-3">
//                       <h3 className="text-sm font-medium text-red-800">{error}</h3>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {success && !showOtpCard && (
//                 <div className="rounded-md bg-green-50 p-4">
//                   <div className="flex">
//                     <div className="ml-3">
//                       <h3 className="text-sm font-medium text-green-800">{success}</h3>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               <div>
//                 <button
//                   type="submit"
//                   disabled={isLoading}
//                   className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
//                 >
//                   {isLoading ? (<>
//                       <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                       </svg>
//                       Sending OTP...
//                     </>) : 'Create Account'}
//                 </button>
//               </div>
//             </form>
//           ) : (
//             // Wallet Registration Section
//             <form className="space-y-6" onSubmit={handleWalletRegistration}>
//               <div className="text-center">
//                 <h3 className="text-lg font-medium text-gray-900">Register with your wallet</h3>
//                 <p className="mt-2 text-sm text-gray-600">
//                   Securely create an account using your Ethereum wallet
//                 </p>
//               </div>

//               {formData.isWalletConnected ? (
//                 <div className="rounded-md bg-green-50 p-4">
//                   <div className="flex items-center">
//                     <div className="flex-shrink-0">
//                       <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
//                         <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                       </svg>
//                     </div>
//                     <div className="ml-3">
//                       <h3 className="text-sm font-medium text-green-800">Wallet Connected</h3>
//                       <div className="mt-2 text-sm text-green-700">
//                         <p>{formData.walletAddress}</p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ) : (
//                 <div className="rounded-md bg-blue-50 p-4">
//                   <div className="flex">
//                     <div className="ml-3">
//                       <h3 className="text-sm font-medium text-blue-800">Connect your wallet</h3>
//                       <div className="mt-2 text-sm text-blue-700">
//                         <p>Click the button below to connect your Ethereum wallet</p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {error && (
//                 <div className="rounded-md bg-red-50 p-4">
//                   <div className="flex">
//                     <div className="ml-3">
//                       <h3 className="text-sm font-medium text-red-800">{error}</h3>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {success && (
//                 <div className="rounded-md bg-green-50 p-4">
//                   <div className="flex">
//                     <div className="ml-3">
//                       <h3 className="text-sm font-medium text-green-800">{success}</h3>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               <div className="grid grid-cols-1 gap-3">
//                 {!formData.isWalletConnected ? (
//                   <button
//                     type="button"
//                     onClick={connectWallet}
//                     disabled={isLoading}
//                     className={`w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
//                   >
//                     {isLoading ? (
//                       <>
//                         <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                         </svg>
//                         Connecting...
//                       </>
//                     ) : (
//                       <>
//                         <img src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" alt="MetaMask" className="h-5 w-5 mr-2" />
//                         Connect Wallet
//                       </>
//                     )}
//                   </button>
//                 ) : (
//                   <button
//                     type="submit"
//                     disabled={isLoading}
//                     className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
//                   >
//                     {isLoading ? (
//                       <>
//                         <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                         </svg>
//                         Completing Registration...
//                       </>
//                     ) : 'Complete Registration'}
//                   </button>
//                 )}
//               </div>

//               <div className="relative">
//                 <div className="absolute inset-0 flex items-center">
//                   <div className="w-full border-t border-gray-300"></div>
//                 </div>
//                 <div className="relative flex justify-center text-sm">
//                   <span className="px-2 bg-white text-gray-500">Or register with</span>
//                 </div>
//               </div>

//               <button
//                 type="button"
//                 onClick={() => setIsWalletRegistration(false)}
//                 className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
//               >
//                 Email Registration
//               </button>
//             </form>
//           )}

//           <div className="mt-6">
//             <div className="relative">
//               <div className="absolute inset-0 flex items-center">
//                 <div className="w-full border-t border-gray-300"></div>
//               </div>
//               <div className="relative flex justify-center text-sm">
//                 <span className="px-2 bg-white text-gray-500">Already have an account?</span>
//               </div>
//             </div>

//             <div className="mt-6 text-center">
//               <Link 
//                 to="/login" 
//                 className="font-medium text-blue-600 hover:text-blue-500"
//               >
//                 Sign in to your account
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* OTP Modal Card */}
//       {showOtpCard && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 sm:mx-auto p-6 transform transition-all duration-300 scale-100">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-lg font-medium text-gray-900">Verify OTP</h3>
//               <button
//                 onClick={() => setShowOtpCard(false)}
//                 className="text-gray-400 hover:text-gray-500"
//               >
//                 <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               </button>
//             </div>
//             <form className="space-y-6" onSubmit={(e) => handleOtpSubmit(e,otpData.otp,navigate)}>
//               <div>
//                 <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
//                   Enter OTP
//                 </label>
//                 <div className="mt-1">
//                   <input
//                     id="otp"
//                     name="otp"
//                     type="text"
//                     autoComplete="off"
//                     required
//                     value={otpData.otp}
//                     onChange={handleOtpChange}
//                     className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                   />
//                 </div>
//               </div>

//               {error && (
//                 <div className="rounded-md bg-red-50 p-4">
//                   <div className="flex">
//                     <div className="ml-3">
//                       <h3 className="text-sm font-medium text-red-800">{error}</h3>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {success && (
//                 <div className="rounded-md bg-green-50 p-4">
//                   <div className="flex">
//                     <div className="ml-3">
//                       <h3 className="text-sm font-medium text-green-800">{success}</h3>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               <div>
//                 <button
//                   type="submit"
//                   disabled={isLoading}
//                   className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
//                 >
//                   {isLoading ? (
//                     <>
//                       <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                       </svg>
//                       Verifying OTP...
//                     </>
//                   ) : 'Verify OTP'}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default RegisterPage;
