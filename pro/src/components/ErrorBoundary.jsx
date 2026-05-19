import React from 'react';
import { Box, Typography, Button } from '@mui/material';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    // You can also log the error to an error reporting service here
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            padding: 3,
            textAlign: 'center',
            background: 'linear-gradient(45deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%)'
          }}
        >
          <Typography variant="h2" gutterBottom sx={{ color: '#d32f2f' }}>
            Oops! Something went wrong
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, color: '#666' }}>
            We're sorry for the inconvenience. Please try refreshing the page.
          </Typography>
          <Button
            variant="contained"
            onClick={this.handleReset}
            sx={{
              background: 'linear-gradient(45deg, #d32f2f 30%, #f44336 90%)',
              color: 'white',
              '&:hover': {
                background: 'linear-gradient(45deg, #f44336 30%, #d32f2f 90%)'
              }
            }}
          >
            Try Again
          </Button>
          {process.env.NODE_ENV === 'development' && (
            <Box sx={{ mt: 4, textAlign: 'left', maxWidth: '800px' }}>
              <Typography variant="h6" gutterBottom sx={{ color: '#d32f2f' }}>
                Error Details:
              </Typography>
              <pre style={{ whiteSpace: 'pre-wrap', color: '#666' }}>
                {this.state.error && this.state.error.toString()}
                {this.state.errorInfo && this.state.errorInfo.componentStack}
              </pre>
            </Box>
          )}
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;