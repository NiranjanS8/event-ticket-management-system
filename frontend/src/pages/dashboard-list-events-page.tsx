import NavBar from "@/components/nav-bar";
import { SimplePagination } from "@/components/simple-pagination";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import {
  EventSummary,
  EventStatusEnum,
  SpringBootPagination,
} from "@/domain/domain";
import { deleteEvent, listEvents } from "@/lib/api";
import {
  AlertCircle,
  Calendar,
  Clock,
  Edit,
  MapPin,
  Tag,
  Trash,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { Link } from "react-router";
import Reveal from "@/components/reveal";

const DashboardListEventsPage: React.FC = () => {
  const { isLoading, user } = useAuth();
  const [events, setEvents] = useState<
    SpringBootPagination<EventSummary> | undefined
  >();
  const [error, setError] = useState<string | undefined>();
  const [deleteEventError, setDeleteEventError] = useState<string | undefined>();

  const [page, setPage] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<EventSummary | undefined>();

  useEffect(() => {
    if (isLoading || !user?.access_token) {
      return;
    }
    refreshEvents(user.access_token);
  }, [isLoading, user, page]);

  const refreshEvents = async (accessToken: string) => {
    try {
      setEvents(await listEvents(accessToken, page));
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

  const formatDate = (date?: Date) => {
    if (!date) {
      return "TBD";
    }
    return new Date(date).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (date?: Date) => {
    if (!date) {
      return "";
    }
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatStatusBadge = (status: EventStatusEnum) => {
    switch (status) {
      case EventStatusEnum.DRAFT:
        return "text-muted-foreground";
      case EventStatusEnum.PUBLISHED:
        return "text-accent";
      case EventStatusEnum.CANCELLED:
        return "text-destructive";
      case EventStatusEnum.COMPLETED:
        return "text-blue-400";
      default:
        return "text-muted-foreground";
    }
  };

  const handleOpenDeleteEventDialog = (eventToDelete: EventSummary) => {
    setEventToDelete(eventToDelete);
    setDialogOpen(true);
  };

  const handleCancelDeleteEventDialog = () => {
    setEventToDelete(undefined);
    setDialogOpen(false);
  };

  const handleDeleteEvent = async () => {
    if (!eventToDelete || isLoading || !user?.access_token) {
      return;
    }

    try {
      setDeleteEventError(undefined);
      await deleteEvent(user.access_token, eventToDelete.id);
      setEventToDelete(undefined);
      setDialogOpen(false);
      refreshEvents(user.access_token);
    } catch (err) {
      if (err instanceof Error) {
        setDeleteEventError(err.message);
      } else if (typeof err === "string") {
        setDeleteEventError(err);
      } else {
        setDeleteEventError("An unknown error has occurred");
      }
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <NavBar />
        <div className="container mx-auto px-4 py-24">
          <Alert variant="destructive" className="border-destructive/40 bg-card">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <NavBar />

      <div className="max-w-2xl mx-auto px-4">
        {/* Title */}
        <div className="py-8 px-4 flex justify-between items-end">
          <div>
            <h1 className="font-display text-2xl font-semibold tracking-tight">Your Events</h1>
            <p className="mt-1 text-sm text-muted-foreground">Events you have created</p>
          </div>
          <Link to="/dashboard/events/create">
            <Button className="cursor-pointer">Create Event</Button>
          </Link>
        </div>

        {/* Event Cards */}
        <div className="space-y-2">
          {events?.content.map((eventItem, index) => (
            <Reveal key={eventItem.id} delay={index * 50}>
              <Card className="border-border bg-card">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <h3 className="font-display text-lg font-semibold tracking-tight">{eventItem.name}</h3>
                    <span className={`text-xs font-mono ${formatStatusBadge(eventItem.status)}`}>
                      {eventItem.status}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-accent" />
                    <span>
                      {formatDate(eventItem.start)} – {formatDate(eventItem.end)}
                      {formatTime(eventItem.start) && (
                        <span className="ml-2 text-xs">
                          {formatTime(eventItem.start)} – {formatTime(eventItem.end)}
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4" />
                    <span>
                      Sales: {formatDate(eventItem.salesStart)} – {formatDate(eventItem.salesEnd)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4" />
                    <span>{eventItem.venue}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Tag className="h-4 w-4" />
                    <span>
                      {eventItem.ticketTypes.map((t) => t.name).join(", ") || "No ticket types"}
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2 border-t border-border pt-4">
                  <Link to={`/dashboard/events/update/${eventItem.id}`}>
                    <Button variant="outline" size="icon" className="cursor-pointer">
                      <Edit />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="cursor-pointer text-destructive hover:bg-destructive/10"
                    onClick={() => handleOpenDeleteEventDialog(eventItem)}
                  >
                    <Trash />
                  </Button>
                </CardFooter>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>

      <div className="flex justify-center py-12">
        {events && <SimplePagination pagination={events} onPageChange={setPage} />}
      </div>

      <AlertDialog open={dialogOpen}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display">Delete event?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete <strong>'{eventToDelete?.name}'</strong> and cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {deleteEventError && (
            <Alert variant="destructive" className="border-destructive/40">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{deleteEventError}</AlertDescription>
            </Alert>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelDeleteEventDialog}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => handleDeleteEvent()}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DashboardListEventsPage;
