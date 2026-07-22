import React from 'react';

export default class CanvasErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.warn('Canvas 3D Error captured safely:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="relative w-full h-full min-h-[200px] flex items-center justify-center pointer-events-none">
          <div className="relative w-40 h-40 rounded-full bg-gradient-to-tr from-[#ff2751] via-[#e722ff] to-[#ff4268] opacity-60 blur-2xl animate-pulse" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 rounded-full border border-[#ff2751]/50 bg-black/40 backdrop-blur-md shadow-[0_0_30px_rgba(255,39,81,0.4)] flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#ff2751] to-[#e722ff] opacity-80 animate-ping" />
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
