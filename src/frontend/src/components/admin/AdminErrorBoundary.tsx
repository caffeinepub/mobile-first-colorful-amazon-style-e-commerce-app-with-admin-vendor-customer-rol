import React, { Component, ReactNode } from 'react';
import { Link } from '@tanstack/react-router';
import { AlertTriangle, Home, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { extractErrorMessage } from '@/utils/errors';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  copied: boolean;
}

/**
 * Error boundary for admin pages that catches rendering exceptions
 * and displays a user-friendly fallback UI with diagnostics instead of a blank page.
 */
export default class AdminErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null, copied: false };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Enhanced logging with clear label and component stack
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error('🚨 [AdminErrorBoundary] Component Crash Detected');
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error('Error:', extractErrorMessage(error));
    console.error('Component Stack:', errorInfo.componentStack);
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    this.setState({ errorInfo });
  }

  handleCopyDiagnostics = () => {
    const { error, errorInfo } = this.state;
    const diagnostics = this.formatDiagnostics(error, errorInfo);
    
    navigator.clipboard.writeText(diagnostics).then(() => {
      this.setState({ copied: true });
      setTimeout(() => this.setState({ copied: false }), 2000);
    }).catch((err) => {
      console.error('Failed to copy diagnostics:', err);
    });
  };

  formatDiagnostics(error: Error | null, errorInfo: React.ErrorInfo | null): string {
    const lines: string[] = [];
    lines.push('Admin Page Error Diagnostics');
    lines.push('═══════════════════════════');
    lines.push('');
    
    if (error) {
      lines.push('Error Message:');
      lines.push(extractErrorMessage(error));
      lines.push('');
    }
    
    if (errorInfo?.componentStack) {
      lines.push('Component Stack:');
      lines.push(errorInfo.componentStack.trim());
      lines.push('');
    }
    
    lines.push('Timestamp: ' + new Date().toISOString());
    lines.push('User Agent: ' + navigator.userAgent);
    
    return lines.join('\n');
  }

  render() {
    if (this.state.hasError) {
      const { error, errorInfo, copied } = this.state;
      const errorMessage = error ? extractErrorMessage(error) : 'Unknown error occurred';

      return (
        <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[60vh]">
          <Card className="max-w-md w-full text-center">
            <CardHeader>
              <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="h-8 w-8 text-destructive" />
              </div>
              <CardTitle className="text-2xl">Something Went Wrong</CardTitle>
              <CardDescription className="text-base">
                The admin page encountered an unexpected error
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                We're sorry for the inconvenience. Please try refreshing the page or return to the home page.
              </p>

              {/* Diagnostics Section */}
              <div className="text-left space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Diagnostics</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={this.handleCopyDiagnostics}
                    className="h-7 text-xs"
                  >
                    {copied ? (
                      <>
                        <Check className="mr-1 h-3 w-3" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="mr-1 h-3 w-3" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
                
                <div className="p-3 bg-muted rounded-lg max-h-32 overflow-y-auto">
                  <p className="text-xs font-mono text-muted-foreground break-all whitespace-pre-wrap">
                    {errorMessage}
                  </p>
                  {errorInfo?.componentStack && (
                    <details className="mt-2">
                      <summary className="text-xs font-mono text-muted-foreground cursor-pointer hover:text-foreground">
                        Component Stack
                      </summary>
                      <pre className="text-xs font-mono text-muted-foreground mt-1 whitespace-pre-wrap">
                        {errorInfo.componentStack.trim()}
                      </pre>
                    </details>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Button
                  onClick={() => window.location.reload()}
                  className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                >
                  Refresh Page
                </Button>
                <Link to="/">
                  <Button variant="outline" className="w-full">
                    <Home className="mr-2 h-4 w-4" />
                    Go to Home
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
