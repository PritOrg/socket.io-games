import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-paper">
          <h1 className="text-5xl font-hand-drawn text-red-600 mb-4">Oops! Something went wrong</h1>
          <p className="text-xl font-handwriting text-ink mb-8">
            We&apos;re sorry for the inconvenience. Please try refreshing the page.
          </p>
          <button onClick={this.handleReset} className="sketch-button px-8 py-3 text-lg">
            Try Again
          </button>
          {import.meta.env.DEV && (
            <div className="mt-8 text-left max-w-2xl">
              <h2 className="text-lg font-hand-drawn text-red-600 mb-2">Error Details:</h2>
              <pre className="whitespace-pre-wrap text-sm text-ink/70 bg-white/50 p-4 rounded-2xl border-2 border-dashed border-red-200">
                {this.state.error && this.state.error.toString()}
                {this.state.errorInfo && this.state.errorInfo.componentStack}
              </pre>
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
