import { Component } from 'react';

/**
 * Top-level error boundary.
 *
 * Without this, a single render error (for example a QR payload that is too
 * long) unmounts the entire React tree and leaves a blank white page.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('[Wishora] Render error:', error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false });
    window.location.assign(import.meta.env.BASE_URL || '/');
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 p-6">
          <div className="bg-white rounded-3xl shadow-xl p-8 max-w-sm w-full text-center">
            <div className="text-5xl mb-4" aria-hidden="true">😕</div>
            <h1 className="text-xl font-bold text-gray-800 mb-2 font-display">
              Something went wrong
            </h1>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
              This page hit an unexpected error. Let&apos;s get you back to safety.
            </p>
            <button
              onClick={this.handleReset}
              className="w-full rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold py-3 hover:from-pink-600 hover:to-rose-600 transition-colors"
            >
              🎉 Back to Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
