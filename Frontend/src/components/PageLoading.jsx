const PageLoader = ({ message = 'Loading...', size = 'md', fullPage = true }) => {
    // Size variants for the spinner
    const sizeClasses = {
      sm: 'h-8 w-8',
      md: 'h-12 w-12',
      lg: 'h-16 w-16',
    };
  
    // Text size variants
    const textSizeClasses = {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
    };
  
    return (
      <div
        className={`flex flex-col items-center justify-center ${
          fullPage ? 'fixed inset-0 bg-gray-50 bg-opacity-80 backdrop-blur-sm z-50' : 'min-h-[100px]'
        }`}
      >
        <div className="flex flex-col items-center space-y-4 animate-pulse">
          <div className="relative">
            <svg
              className={`text-teal-600 ${sizeClasses[size]} animate-spin`}
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                className="opacity-25"
              />
              <path
                d="M12 2a10 10 0 0110 10h-4a6 6 0 00-6-6V2z"
                fill="currentColor"
                className="opacity-75"
              />
            </svg>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-teal-500 opacity-20 rounded-full animate-ping"></div>
          </div>
          <p className={`text-gray-700 font-medium ${textSizeClasses[size]}`}>
            {message}
          </p>
        </div>
      </div>
    );
  };
  
  export default PageLoader;