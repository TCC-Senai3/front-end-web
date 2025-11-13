import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', color: 'red' }}>
          <h2>Algo deu errado!</h2>
          <p>{this.state.error?.toString()}</p>
          <button onClick={() => window.location.reload()}>Recarregar a página</button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
