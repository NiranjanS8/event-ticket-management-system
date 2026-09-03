import { useEffect } from "react";
import { useAuth } from "react-oidc-context";

const LoginPage: React.FC = () => {
  const { isLoading, isAuthenticated, signinRedirect } = useAuth();

  useEffect(() => {
    if (isLoading) {
      return;
    }
    if (!isAuthenticated) {
      signinRedirect();
    }
  }, [isLoading, isAuthenticated, signinRedirect]);

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
      <p className="font-display text-lg text-muted-foreground animate-pulse">Redirecting to login…</p>
    </div>
  );
};

export default LoginPage;
