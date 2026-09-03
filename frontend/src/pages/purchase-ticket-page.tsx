import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { purchaseTicket } from "@/lib/api";
import { CheckCircle, CreditCard } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { useNavigate, useParams } from "react-router";

const PurchaseTicketPage: React.FC = () => {
  const { eventId, ticketTypeId } = useParams();
  const { isLoading, user } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | undefined>();
  const [isPurchaseSuccess, setIsPurchaseASuccess] = useState(false);

  useEffect(() => {
    if (!isPurchaseSuccess) {
      return;
    }
    const timer = setTimeout(() => {
      navigate("/");
    }, 3000);

    return () => clearTimeout(timer);
  }, [isPurchaseSuccess]);

  const handlePurchase = async () => {
    if (isLoading || !user?.access_token || !eventId || !ticketTypeId) {
      return;
    }
    try {
      await purchaseTicket(user.access_token, eventId, ticketTypeId);
      setIsPurchaseASuccess(true);
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

  if (isPurchaseSuccess) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center">
        <div className="max-w-md mx-auto p-8 text-center animate-scale-in">
          <div className="rounded-xl border border-border bg-card p-10">
            <div className="flex justify-center mb-6">
              <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
                <CheckCircle className="h-8 w-8 text-accent animate-ping-once" />
              </span>
            </div>
            <h2 className="font-display text-2xl font-semibold tracking-tight">
              Ticket secured
            </h2>
            <p className="mt-2 text-muted-foreground">
              Your purchase was successful. Redirecting to home in a few seconds.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-md mx-auto py-20 px-4">
        <h1 className="animate-fade-up font-display text-3xl font-semibold tracking-tight">
          Purchase ticket
        </h1>
        <p
          className="animate-fade-up mt-2 text-muted-foreground"
          style={{ animationDelay: "80ms" }}
        >
          This is a mock checkout — no real payment will be processed.
        </p>

        <div
          className="animate-fade-up mt-8 rounded-xl border border-border bg-card p-6"
          style={{ animationDelay: "160ms" }}
        >
          {error && (
            <div className="mb-4 rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
              <strong>Error:</strong> {error}
            </div>
          )}

          <div className="space-y-4">
            {/* Credit Card Number */}
            <div className="space-y-2">
              <Label className="text-muted-foreground">Card number</Label>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  className="pl-10"
                />
                <CreditCard className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>

            {/* Cardholder Name */}
            <div className="space-y-2">
              <Label className="text-muted-foreground">Cardholder name</Label>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Jane Smith"
                  className="pl-10"
                />
                <CreditCard className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>

            <Button
              className="mt-2 w-full cursor-pointer"
              onClick={handlePurchase}
            >
              Purchase ticket
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseTicketPage;
