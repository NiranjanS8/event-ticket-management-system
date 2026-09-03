import { useAuth } from "react-oidc-context";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";
import { useRoles } from "@/hooks/use-roles";
import { Link } from "react-router";

const NavBar: React.FC = () => {
  const { user, signoutRedirect } = useAuth();
  const { isOrganizer } = useRoles();

  return (
    <div className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-14 items-center justify-between">
          <div className="flex gap-8 items-center">
            <Link to="/" className="font-display text-lg font-semibold tracking-tight">
              Night<span className="text-accent">/</span>Ticket
            </Link>
            <nav className="hidden text-sm text-muted-foreground md:flex gap-6">
              {isOrganizer && (
                <Link className="transition-colors hover:text-foreground" to="/dashboard/events">
                  Events
                </Link>
              )}
              <Link className="transition-colors hover:text-foreground" to="/dashboard/tickets">
                Tickets
              </Link>
            </nav>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar className="h-8 w-8 cursor-pointer">
                <AvatarFallback className="bg-secondary text-secondary-foreground font-mono text-xs">
                  {user?.profile?.preferred_username
                    ?.slice(0, 2)
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-56 bg-card border-border"
              align="end"
            >
              <DropdownMenuLabel className="font-normal">
                <p className="text-sm font-medium">{user?.profile?.preferred_username}</p>
                <p className="text-xs text-muted-foreground">{user?.profile?.email}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer focus:bg-foreground/5"
                onClick={() => signoutRedirect()}
              >
                <LogOut />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
