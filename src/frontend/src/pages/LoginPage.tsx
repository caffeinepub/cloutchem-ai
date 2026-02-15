import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function LoginPage() {
  const { login, loginStatus, identity, loginError } = useInternetIdentity();
  const navigate = useNavigate();

  const isLoggingIn = loginStatus === 'logging-in';
  const isLoginError = loginStatus === 'loginError';
  const isAuthenticated = !!identity;

  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: '/dashboard' });
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async () => {
    try {
      await login();
    } catch (error: any) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-yellow-600/20 mb-4">
            <Sparkles className="w-8 h-8 text-amber-400" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Welcome Back
            </span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Sign in to access your CloutChem AI dashboard
          </p>
        </div>

        <Card className="bg-card/50 backdrop-blur-sm border-accent/20">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl">Secure Login</CardTitle>
            <CardDescription className="text-base">
              We use Internet Identity for secure, passwordless authentication
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {isLoginError && loginError && (
              <Alert variant="destructive" className="bg-destructive/10 border-destructive/30">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{loginError.message}</AlertDescription>
              </Alert>
            )}

            <Button
              onClick={handleLogin}
              disabled={isLoggingIn}
              size="lg"
              className="w-full text-lg py-6 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-background font-semibold shadow-lg shadow-amber-500/20"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Sign In with Internet Identity
                </>
              )}
            </Button>

            <div className="text-center text-sm text-muted-foreground space-y-2">
              <p>Don't have an Internet Identity?</p>
              <p className="text-xs">
                You'll be guided to create one during the sign-in process
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-muted-foreground">
          <p>
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
