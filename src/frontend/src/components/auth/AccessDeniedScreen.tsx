import { Link } from '@tanstack/react-router';
import { ShieldAlert, ShieldCheck, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAssignAdminRole } from '../../hooks/useQueries';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { hasParameter } from '../../utils/urlParams';
import { extractErrorMessage, formatErrorForDiagnostics } from '../../utils/errors';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

interface AccessDeniedScreenProps {
  message?: string;
  showAdminButton?: boolean;
  actorError?: unknown;
  actorStatus?: string;
}

export default function AccessDeniedScreen({ 
  message = 'Access Denied', 
  showAdminButton = false,
  actorError,
  actorStatus,
}: AccessDeniedScreenProps) {
  const assignAdminRole = useAssignAdminRole();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const hasAdminToken = hasParameter('caffeineAdminToken');
  const principalId = identity?.getPrincipal().toString() || 'Not authenticated';

  const handleRefreshAccess = async () => {
    setIsRefreshing(true);
    try {
      // Refetch admin status without clearing actor
      await queryClient.invalidateQueries({ queryKey: ['isAdmin'] });
      await queryClient.invalidateQueries({ queryKey: ['callerRole'] });
      await queryClient.refetchQueries({ queryKey: ['isAdmin'] });
      await queryClient.refetchQueries({ queryKey: ['callerRole'] });
      
      toast.success('Access refreshed', {
        description: 'Checking admin status...',
      });
    } catch (error: any) {
      console.error('Failed to refresh access:', error);
      const errorMessage = extractErrorMessage(error);
      toast.error('Failed to refresh access', {
        description: errorMessage,
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleAssignAdmin = async () => {
    try {
      await assignAdminRole.mutateAsync();
      toast.success('Admin role check completed!', {
        description: 'If you are the first user, you now have admin access.',
      });
    } catch (error: any) {
      console.error('Failed to check admin role:', error);
      const errorMessage = extractErrorMessage(error);
      toast.error('Failed to check admin role', {
        description: errorMessage,
      });
    }
  };

  // Determine if we should show actor initialization error details
  const showActorError = actorError && actorStatus === 'error';
  const actorErrorMessage = showActorError ? formatErrorForDiagnostics(actorError) : null;

  return (
    <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-md w-full text-center">
        <CardHeader>
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
            <ShieldAlert className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle className="text-2xl">Access Denied</CardTitle>
          <CardDescription className="text-base">{message}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {showActorError ? (
            <Alert variant="destructive" className="text-left">
              <AlertDescription className="space-y-2">
                <div className="font-semibold text-sm mb-2">Backend Initialization Failed</div>
                <div className="text-xs space-y-1">
                  <p className="text-destructive-foreground">
                    The application could not connect to the backend. This usually means:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-destructive-foreground/90">
                    <li>The backend canister is not responding</li>
                    <li>There's a network connectivity issue</li>
                    <li>Your session may have expired</li>
                  </ul>
                </div>
                {actorErrorMessage && (
                  <div className="mt-2 p-2 bg-destructive/10 rounded text-xs font-mono break-all">
                    {actorErrorMessage}
                  </div>
                )}
              </AlertDescription>
            </Alert>
          ) : (
            <p className="text-sm text-muted-foreground">
              If you believe this is an error, please contact support or try logging in again.
            </p>
          )}

          {showAdminButton && (
            <Alert className="text-left">
              <AlertDescription className="space-y-2">
                <div className="font-semibold text-sm mb-2">Admin Access Information:</div>
                <div className="text-xs space-y-1 font-mono">
                  <div className="break-all">
                    <span className="text-muted-foreground">Principal:</span> {principalId}
                  </div>
                  {actorStatus && (
                    <div>
                      <span className="text-muted-foreground">Actor Status:</span>{' '}
                      <span className={actorStatus === 'error' ? 'text-red-600 font-semibold' : 'text-muted-foreground'}>
                        {actorStatus}
                      </span>
                    </div>
                  )}
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  The first registered user automatically becomes admin. Click "Check Admin Status" to verify your role.
                </div>
              </AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col gap-2">
            {showAdminButton && (
              <Button
                onClick={handleRefreshAccess}
                disabled={isRefreshing}
                className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90"
              >
                {isRefreshing ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Refreshing Access...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Refresh Access
                  </>
                )}
              </Button>
            )}
            {showAdminButton && !showActorError && (
              <Button
                onClick={handleAssignAdmin}
                disabled={assignAdminRole.isPending}
                variant="outline"
                className="w-full"
              >
                {assignAdminRole.isPending ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Checking Admin Status...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="mr-2 h-4 w-4" />
                    Check Admin Status
                  </>
                )}
              </Button>
            )}
            <Link to="/">
              <Button variant="outline" className="w-full">Go to Home</Button>
            </Link>
            <Link to="/contact">
              <Button variant="ghost" className="w-full">
                Contact Support
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
