import { Component } from 'react';
import { NativeModules } from 'react-native';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ hasError: true });
    this.sendCrashReport(error, errorInfo);
  }

  sendCrashReport(error, errorInfo) {
    // Where every we need to receive the report
    fetch('http://128.233.10.188:8080/crash-report', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: error.toString(),
        errorInfo: errorInfo.componentStack,
        // Include any other relevant info
      }),
    });
  }

  render() {
    if (this.state.hasError) {
      // Render fallback UI
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children; 
  }
}
