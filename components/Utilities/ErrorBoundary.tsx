import React, { ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode; // Optional fallback UI to display on error
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    // Update state to display the fallback UI on error
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // You can log the error to an error reporting service
    console.error('Error caught in boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Render fallback UI if provided, otherwise default to a message
      return this.props?.fallback || <></>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
