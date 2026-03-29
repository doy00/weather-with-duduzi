import React, { ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  declare props: Readonly<Props>;
  state: State = { hasError: false, error: null };

  constructor(props: Props) {
    super(props);
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: { componentStack: string }) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-screen text-white bg-gradient-to-b from-galaxy-blue-start to-galaxy-blue-end p-6 text-center">
          <AlertCircle size={64} className="mb-6 text-white/50" />
          <p className="font-bold text-2xl mb-2">예상치 못한 오류가 발생했습니다.</p>
          <p className="opacity-70 mb-8 leading-relaxed text-sm">
            {this.state.error?.message || '알 수 없는 오류'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3 font-bold flex items-center gap-2 active:scale-95 transition-all text-white bg-white/20 backdrop-blur-[10px] border border-white/30 rounded-3xl"
          >
            <RefreshCw size={20} /> 다시 로드
          </button>
        </div>
      );
    }

    const { children } = this.props;
    return children;
  }
}
