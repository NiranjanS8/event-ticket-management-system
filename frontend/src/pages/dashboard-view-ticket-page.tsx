import { TicketDetails, TicketStatus } from "@/domain/domain";
import { getTicket, getTicketQr } from "@/lib/api";
import { format } from "date-fns";
import { Calendar, DollarSign, MapPin, Tag, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { Link, useParams } from "react-router";

const DashboardViewTicketPage: React.FC = () => {
  const [ticket, setTicket] = useState<TicketDetails | undefined>();
  const [qrCodeUrl, setQrCodeUrl] = useState<string | undefined>();
  const [isQrLoading, setIsQrCodeLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();

  const { id } = useParams();
  const { isLoading, user } = useAuth();

  useEffect(() => {
    if (isLoading || !user?.access_token || !id) {
      return;
    }

    const doUseEffect = async (accessToken: string, id: string) => {
      try {
        setIsQrCodeLoading(true);
        setError(undefined);

        setTicket(await getTicket(accessToken, id));
        setQrCodeUrl(URL.createObjectURL(await getTicketQr(accessToken, id)));
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else if (typeof err === "string") {
          setError(err);
        } else {
          setError("An unknown error has occurred");
        }
      } finally {
        setIsQrCodeLoading(false);
      }
    };

    doUseEffect(user?.access_token, id);

    return () => {
      if (qrCodeUrl) {
        URL.revokeObjectURL(qrCodeUrl);
      }
    };
  }, [user?.access_token, isLoading, id]);

  const getStatusColor = (status: TicketStatus) => {
    switch (status) {
      case TicketStatus.PURCHASED:
        return "text-accent";
      case TicketStatus.CANCELLED:
        return "text-destructive";
      default:
        return "text-muted-foreground";
    }
  };

  if (!ticket) {
    return <p>Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-scale-in">
        <Link
          to="/dashboard/tickets"
          className="mb-6 flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to tickets
        </Link>

        <div className="rounded-2xl border border-border bg-card p-8">
          {/* Status */}
          <div className="flex items-center justify-between mb-8">
            <span className={`font-mono text-xs uppercase tracking-wider ${getStatusColor(ticket.status)}`}>
              {ticket.status}
            </span>
          </div>

          <div className="mb-6">
            <h1 className="font-display text-2xl font-semibold tracking-tight">{ticket.eventName}</h1>
            <div className="mt-2 flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{ticket.eventVenue}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-8">
            <Calendar className="h-4 w-4" />
            <span>
              {format(ticket.eventStart, "Pp")} – {format(ticket.eventEnd, "Pp")}
            </span>
          </div>

          {/* QR Code */}
          <div className="flex justify-center mb-8">
            <div className="bg-white p-4 rounded-xl">
              <div className="w-32 h-32 flex items-center justify-center">
                {isQrLoading && (
                  <div className="text-xs text-center text-gray-800">
                    <div className="h-8 w-8 rounded-full border-2 border-gray-200 border-t-gray-800 animate-spin mb-2 mx-auto" />
                    Loading QR…
                  </div>
                )}
                {error && (
                  <div className="text-red-500 text-sm text-center p-2">
                    <div className="mb-1">⚠️</div>
                    {error}
                  </div>
                )}
                {qrCodeUrl && !isQrLoading && !error && (
                  <img src={qrCodeUrl} alt="QR Code for event" className="w-full h-full object-contain" />
                )}
              </div>
            </div>
          </div>

          <p className="text-center text-xs text-muted-foreground mb-8">
            Present this QR code at the venue for entry
          </p>

          {/* Details */}
          <div className="space-y-3 border-t border-border pt-6 text-sm">
            <div className="flex items-center gap-3 text-muted-foreground">
              <Tag className="h-4 w-4" />
              <span className="font-medium text-foreground">{ticket.description}</span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <DollarSign className="h-4 w-4" />
              <span className="font-medium text-foreground">${ticket.price}</span>
            </div>
          </div>

          <div className="mt-8 text-center">
            <h4 className="font-mono text-xs text-muted-foreground mb-1">Ticket ID</h4>
            <p className="font-mono text-sm text-foreground/80 break-all">{ticket.id}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardViewTicketPage;
