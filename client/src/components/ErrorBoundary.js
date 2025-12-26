import React from 'react';

/**
 * Error Boundary Component
 * Catches JavaScript errors anywhere in the child component tree
 * Logs errors and displays a fallback UI
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details for debugging
    console.error('Error Boundary caught an error:', error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // You can also log the error to an error reporting service here
    // Example: logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    this.setState({ 
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render() {
    if (this.state.hasError) {
      // Fallback UI
      return (
        <div className="min-h-screen bg-surface-50 flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg 
                className="w-10 h-10 text-red-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
                />
              </svg>
            </div>
            
            <h1 className="text-2xl font-display font-bold text-slate-800 mb-2">
              Oops! Something went wrong
            </h1>
            
            <p className="text-slate-600 mb-6">
              We're sorry for the inconvenience. The application encountered an unexpected error.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mb-6 text-left">
                <summary className="cursor-pointer text-sm font-semibold text-slate-700 mb-2">
                  Error Details (Development Only)
                </summary>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-xs font-mono text-red-800 overflow-auto max-h-40">
                  <p className="font-bold mb-2">{this.state.error.toString()}</p>
                  <pre className="whitespace-pre-wrap">
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </div>
              </details>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-slate-800 transition-colors"
              >
                Try Again
              </button>
              <a
                href="/"
                className="px-6 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors"
              >
                Go to Homepage
              </a>
            </div>

            <p className="text-xs text-slate-400 mt-6">
              If the problem persists, please contact support.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
