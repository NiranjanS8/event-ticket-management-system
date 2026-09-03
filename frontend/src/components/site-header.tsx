import { useAuth } from "react-oidc-context";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router";

const SiteHeader: React.FC<{ dashboardHref?: string }> = ({
  dashboardHref = "/dashboard",
}) => {
  const { isAuthenticated, isLoading, signinRedirect, signoutRedirect } =
    useAuth();
  const navigate = useNavigate();

  return (
    <header className="animate-fade-in">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between border-b border-border">
          <Link to="/" className="font-display text-lg font-semibold tracking-tight">
            Night<span className="text-accent">/</span>Ticket
          </Link>
          <nav className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link className="transition-colors hover:text-foreground" to="/">
              Events
            </Link>
            <Link
              className="hidden transition-colors hover:text-foreground sm:inline"
              to="/organizers"
            >
              For Organizers
            </Link>
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="cursor-pointer"
                  onClick={() => navigate(dashboardHref)}
                >
                  Dashboard
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="cursor-pointer"
                  onClick={() => signoutRedirect()}
                >
                  Log out
                </Button>
              </div>
            ) : (
              !isLoading && (
                <Button
                  size="sm"
                  className="cursor-pointer"
                  onClick={() => signinRedirect()}
                >
                  Log in
                </Button>
              )
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default SiteHeader;
