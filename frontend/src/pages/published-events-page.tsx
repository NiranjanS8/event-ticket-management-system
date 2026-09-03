import RandomEventImage from "@/components/random-event-image";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  PublishedEventDetails,
  PublishedEventTicketTypeDetails,
} from "@/domain/domain";
import { getPublishedEvent } from "@/lib/api";
import { AlertCircle, Check, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { Link, useParams } from "react-router";
import SiteHeader from "@/components/site-header";
import { format } from "date-fns";

const PublishedEventsPage: React.FC = () => {
  const { isAuthenticated, isLoading, signinRedirect } = useAuth();
  const { id } = useParams();
  const [error, setError] = useState<string | undefined>();
  const [publishedEvent, setPublishedEvent] = useState<
    PublishedEventDetails | undefined
  >();
  const [selectedTicketType, setSelectedTicketType] = useState<
    PublishedEventTicketTypeDetails | undefined
  >();

  useEffect(() => {
    if (!id) {
      setError("ID must be provided!");
      return;
    }

    const doUseEffect = async () => {
      try {
        const eventData = await getPublishedEvent(id);
        setPublishedEvent(eventData);
        if (eventData.ticketTypes.length > 0) {
          setSelectedTicketType(eventData.ticketTypes[0]);
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else if (typeof err === "string") {
          setError(err);
        } else {
          setError("An unknown error has occurred");
        }
      }
    };
    doUseEffect();
  }, [id]);

  if (error) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <SiteHeader />
        <div className="container mx-auto px-4 py-24">
          <Alert
            variant="destructive"
            className="mx-auto max-w-lg border-destructive/40 bg-card"
          >
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Something went wrong</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader dashboardHref="/dashboard/events" />

      <main className="container mx-auto px-4 pb-24">
        {/* Header */}
        <div className="animate-fade-up grid items-end gap-10 border-b border-border py-14 md:grid-cols-[1.3fr_1fr]">
          <div>
            <h1 className="font-display text-4xl font-semibold leading-[1.04] tracking-[-0.03em] sm:text-5xl md:text-6xl">
              {publishedEvent?.name}
            </h1>
            <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-2 text-muted-foreground">
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-accent" />
                {publishedEvent?.venue}
              </p>
              {publishedEvent?.start && publishedEvent?.end && (
                <p>
                  {format(publishedEvent.start, "PP")} –{" "}
                  {format(publishedEvent.end, "PP")}
                </p>
              )}
            </div>
          </div>
          <div className="animate-scale-in max-h-72 overflow-hidden rounded-xl border border-border">
            <RandomEventImage />
          </div>
        </div>

        {/* Ticket Selection */}
        <div className="grid gap-12 pt-12 lg:grid-cols-[1.4fr_1fr]">
          {/* Left — ticket types */}
          <div>
            <h2 className="font-display text-2xl font-semibold tracking-tight">
              Available tickets
            </h2>
            <div className="mt-6 divide-y divide-border border-y border-border">
              {publishedEvent?.ticketTypes?.map((ticketType) => {
                const isSelected = selectedTicketType?.id === ticketType.id;
                return (
                  <button
                    key={ticketType.id}
                    onClick={() => setSelectedTicketType(ticketType)}
                    className={`group flex w-full cursor-pointer items-center justify-between gap-4 px-2 py-5 text-left transition-colors duration-200 ${
                      isSelected ? "bg-foreground/[0.04]" : "hover:bg-foreground/[0.04]"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all duration-200 ${
                          isSelected
                            ? "border-accent bg-accent text-accent-foreground"
                            : "border-muted-foreground/50 group-hover:border-foreground"
                        }`}
                      >
                        {isSelected && <Check className="h-3 w-3" />}
                      </span>
                      <div>
                        <h3 className="font-medium">{ticketType.name}</h3>
                        <p className="mt-0.5 text-sm text-muted-foreground">
                          {ticketType.description}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`font-mono text-lg transition-colors duration-200 ${
                        isSelected ? "text-accent" : ""
                      }`}
                    >
                      ${ticketType.price}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right — purchase panel */}
          <div className="animate-fade-up h-fit rounded-xl border border-border bg-card p-6 lg:sticky lg:top-8">
            <h2 className="font-display text-xl font-semibold tracking-tight">
              {selectedTicketType?.name}
            </h2>
            <p className="mt-4 font-display text-4xl font-semibold tracking-tight">
              ${selectedTicketType?.price}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {selectedTicketType?.description}
            </p>
            <div className="mt-6 border-t border-border pt-6">
              {isAuthenticated ? (
                <Link
                  to={`/events/${publishedEvent?.id}/purchase/${selectedTicketType?.id}`}
                >
                  <Button size="lg" className="w-full cursor-pointer">
                    Purchase ticket
                  </Button>
                </Link>
              ) : (
                <Button
                  size="lg"
                  className="w-full cursor-pointer"
                  onClick={() => signinRedirect()}
                >
                  Log in to purchase
                </Button>
              )}
              <p className="mt-3 text-center text-xs text-muted-foreground">
                Secure checkout · Instant QR delivery
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PublishedEventsPage;
