import NavBar from "@/components/nav-bar";
import { SimplePagination } from "@/components/simple-pagination";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SpringBootPagination, TicketSummary } from "@/domain/domain";
import { listTickets } from "@/lib/api";
import { AlertCircle, DollarSign, Tag, Ticket } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { Link } from "react-router";
import Reveal from "@/components/reveal";

const DashboardListTickets: React.FC = () => {
  const { isLoading, user } = useAuth();

  const [tickets, setTickets] = useState<
    SpringBootPagination<TicketSummary> | undefined
  >();
  const [error, setError] = useState<string | undefined>();
  const [page, setPage] = useState(0);

  useEffect(() => {
    if (isLoading || !user?.access_token) {
      return;
    }

    const doUseEffect = async () => {
      try {
        setTickets(await listTickets(user.access_token, page));
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else if (typeof err === "string") {
          setError(err);
        } else {
          setError("An unknown error occurred");
        }
      }
    };

    doUseEffect();
  }, [isLoading, user?.access_token, page]);

  if (error) {
    return (
      <div className="bg-background min-h-screen text-foreground">
        <NavBar />
        <Alert variant="destructive" className="border-destructive/40 bg-card">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen text-foreground">
      <NavBar />

      {/* Title */}
      <div className="py-8 px-4 max-w-lg mx-auto">
        <h1 className="font-display text-2xl font-semibold tracking-tight">Your Tickets</h1>
        <p className="mt-1 text-sm text-muted-foreground">Tickets you have purchased</p>
      </div>

      <div className="max-w-lg mx-auto px-4 space-y-2">
        {tickets?.content.map((ticketItem, index) => (
          <Reveal key={ticketItem.id} delay={index * 50}>
            <Link to={`/dashboard/tickets/${ticketItem.id}`}>
              <Card className="border-border bg-card transition-colors duration-200 hover:border-foreground/20">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Ticket className="h-4 w-4 text-accent" />
                      <h3 className="font-display text-lg font-semibold tracking-tight">
                        {ticketItem.ticketType.name}
                      </h3>
                    </div>
                    <span className="font-mono text-xs text-muted-foreground">{ticketItem.status}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <DollarSign className="h-4 w-4" />
                    <span>${ticketItem.ticketType.price}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Tag className="h-4 w-4" />
                    <span className="font-mono text-xs break-all">{ticketItem.id}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </Reveal>
        ))}
      </div>

      <div className="flex justify-center py-12">
        {tickets && <SimplePagination pagination={tickets} onPageChange={setPage} />}
      </div>
    </div>
  );
};

export default DashboardListTickets;
