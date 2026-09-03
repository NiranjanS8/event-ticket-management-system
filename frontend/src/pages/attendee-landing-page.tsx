import { Button } from "../components/ui/button";
import { useNavigate } from "react-router";
import { Input } from "@/components/ui/input";
import { AlertCircle, Search, ArrowRight, CalendarDays } from "lucide-react";
import { useEffect, useState } from "react";
import { PublishedEventSummary, SpringBootPagination } from "@/domain/domain";
import { listPublishedEvents, searchPublishedEvents } from "@/lib/api";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import PublishedEventCard from "@/components/published-event-card";
import { SimplePagination } from "@/components/simple-pagination";
import SiteHeader from "@/components/site-header";
import Reveal from "@/components/reveal";

const AttendeeLandingPage: React.FC = () => {
  const navigate = useNavigate();

  const [page, setPage] = useState(0);
  const [publishedEvents, setPublishedEvents] = useState<
    SpringBootPagination<PublishedEventSummary> | undefined
  >();
  const [error, setError] = useState<string | undefined>();
  const [query, setQuery] = useState<string | undefined>();

  useEffect(() => {
    if (query && query.length > 0) {
      queryPublishedEvents();
    } else {
      refreshPublishedEvents();
    }
  }, [page]);

  const refreshPublishedEvents = async () => {
    try {
      setPublishedEvents(await listPublishedEvents(page));
      setError(undefined);
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

  const queryPublishedEvents = async () => {
    if (!query) {
      await refreshPublishedEvents();
      return;
    }

    try {
      setPublishedEvents(await searchPublishedEvents(query, page));
      setError(undefined);
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

  const handleSearch = () => {
    if (page === 0) {
      queryPublishedEvents();
    } else {
      setPage(0);
    }
  };

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

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      {/* Hero */}
      <section className="container mx-auto px-4">
        <div className="border-b border-border py-20 md:py-28">
          <h1 className="font-display text-5xl font-semibold leading-[1.02] tracking-[-0.03em] sm:text-6xl md:text-7xl lg:text-8xl">
            <span className="line-mask">
              <span className="line-rise" style={{ animationDelay: "80ms" }}>
                Find tickets to
              </span>
            </span>
            <span className="line-mask">
              <span
                className="line-rise text-muted-foreground"
                style={{ animationDelay: "200ms" }}
              >
                your next event<span className="text-accent">.</span>
              </span>
            </span>
          </h1>

          <div
            className="animate-fade-up mt-10 flex max-w-xl gap-2"
            style={{ animationDelay: "420ms" }}
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="h-12 rounded-lg border-border bg-card pl-9 text-base"
                placeholder="Search events or venues"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <Button size="lg" className="h-12 cursor-pointer" onClick={handleSearch}>
              Search
            </Button>
          </div>

          <p
            className="animate-fade-up mt-6 flex items-center gap-2 text-sm text-muted-foreground"
            style={{ animationDelay: "560ms" }}
          >
            <CalendarDays className="h-4 w-4 text-accent" />
            {publishedEvents
              ? `${publishedEvents.totalElements} events on sale now`
              : "Loading events…"}
          </p>
        </div>
      </section>

      {/* Published Event Cards */}
      <section className="container mx-auto px-4 pb-8 pt-12">
        {publishedEvents?.content?.length ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {publishedEvents.content.map((publishedEvent, index) => (
              <Reveal key={publishedEvent.id} delay={index * 70}>
                <PublishedEventCard publishedEvent={publishedEvent} />
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 py-24 text-center">
            <CalendarDays className="h-8 w-8 text-muted-foreground" />
            <p className="text-lg text-muted-foreground">
              No events match your search.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="cursor-pointer"
              onClick={() => {
                setQuery("");
                setPage(0);
                refreshPublishedEvents();
              }}
            >
              Clear search
            </Button>
          </div>
        )}

        {publishedEvents && publishedEvents.totalPages > 1 && (
          <div className="flex justify-center py-12">
            <SimplePagination pagination={publishedEvents} onPageChange={setPage} />
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="container mx-auto flex flex-col items-start justify-between gap-6 px-4 py-12 sm:flex-row sm:items-center">
          <p className="font-display text-lg font-semibold tracking-tight">
            Night<span className="text-accent">/</span>Ticket
          </p>
          <button
            onClick={() => navigate("/organizers")}
            className="group flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Run events? Organize with us
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>
      </footer>
    </div>
  );
};

export default AttendeeLandingPage;
