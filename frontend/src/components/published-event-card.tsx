import { PublishedEventSummary } from "@/domain/domain";
import { Calendar, MapPin, ArrowUpRight } from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router";
import RandomEventImage from "./random-event-image";

interface PublishedEventCardProperties {
  publishedEvent: PublishedEventSummary;
}

const PublishedEventCard: React.FC<PublishedEventCardProperties> = ({
  publishedEvent,
}) => {
  return (
    <Link
      to={`/events/${publishedEvent.id}`}
      className="group block overflow-hidden rounded-xl border border-border bg-card transition-colors duration-300 hover:border-foreground/25"
    >
      {/* Card Image */}
      <div className="h-40 overflow-hidden sm:h-44">
        <RandomEventImage className="h-full w-full transition-transform duration-700 ease-out-expo group-hover:scale-105" />
      </div>

      <div className="space-y-3 p-4">
        <h3 className="font-display text-lg font-semibold leading-snug tracking-tight">
          {publishedEvent.name}
        </h3>

        <div className="space-y-1.5 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 shrink-0" />
            <span className="truncate">{publishedEvent.venue}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 shrink-0" />
            {publishedEvent.start && publishedEvent.end ? (
              <span>
                {format(publishedEvent.start, "PP")} –{" "}
                {format(publishedEvent.end, "PP")}
              </span>
            ) : (
              <span>Dates TBD</span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-border pt-3 text-sm">
          <span className="text-muted-foreground transition-colors group-hover:text-accent">
            Get tickets
          </span>
          <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground" />
        </div>
      </div>
    </Link>
  );
};

export default PublishedEventCard;
