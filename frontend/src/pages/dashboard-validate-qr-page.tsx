import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import {
  TicketValidationMethod,
  TicketValidationStatus,
} from "@/domain/domain";
import { AlertCircle, Check, X } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { validateTicket } from "@/lib/api";
import { useAuth } from "react-oidc-context";

const DashboardValidateQrPage: React.FC = () => {
  const { isLoading, user } = useAuth();
  const [isManual, setIsManual] = useState(false);
  const [data, setData] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [validationStatus, setValidationStatus] = useState<
    TicketValidationStatus | undefined
  >();

  const handleReset = () => {
    setIsManual(false);
    setData(undefined);
    setError(undefined);
    setValidationStatus(undefined);
  };

  const handleError = (err: unknown) => {
    if (err instanceof Error) {
      setError(err.message);
    } else if (typeof err === "string") {
      setError(err);
    } else {
      setError("An unknown error has occurred");
    }
  };

  const handleValidate = async (id: string, method: TicketValidationMethod) => {
    if (!user?.access_token) {
      return;
    }
    try {
      const response = await validateTicket(user.access_token, {
        id,
        method,
      });
      setValidationStatus(response.status);
    } catch (err) {
      handleError(err);
    }
  };

  if (isLoading || !user?.access_token) {
    return <p>Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex justify-center items-center p-4">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-2xl font-semibold tracking-tight mb-8 text-center">
          Validate ticket
        </h1>

        {error && (
          <Alert variant="destructive" className="mb-6 border-destructive/40 bg-card">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Scanner Viewport */}
        <div className="rounded-xl overflow-hidden border border-border mb-6 relative">
          <Scanner
            key={`scanner-${data}-${validationStatus}`}
            onScan={(result) => {
              if (result) {
                const qrCodeId = result[0].rawValue;
                setData(qrCodeId);
                handleValidate(qrCodeId, TicketValidationMethod.QR_SCAN);
              }
            }}
            onError={handleError}
          />

          {validationStatus && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
              <div
                className={`flex h-20 w-20 items-center justify-center rounded-full animate-ping-once ${
                  validationStatus === TicketValidationStatus.VALID
                    ? "bg-accent text-accent-foreground"
                    : "bg-destructive text-white"
                }`}
              >
                {validationStatus === TicketValidationStatus.VALID ? (
                  <Check className="h-10 w-10" />
                ) : (
                  <X className="h-10 w-10" />
                )}
              </div>
            </div>
          )}
        </div>

        {isManual ? (
          <div className="space-y-3">
            <Input
              placeholder="Enter ticket ID"
              onChange={(e) => setData(e.target.value)}
            />
            <Button
              className="w-full cursor-pointer"
              onClick={() => handleValidate(data || "", TicketValidationMethod.MANUAL)}
            >
              Submit
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="rounded-lg border border-border bg-card p-4 text-center font-mono text-sm text-muted-foreground">
              {data || "Waiting for scan…"}
            </div>
            <Button
              variant="outline"
              className="w-full cursor-pointer"
              onClick={() => setIsManual(true)}
            >
              Manual entry
            </Button>
          </div>
        )}

        <Button
          variant="ghost"
          className="w-full cursor-pointer mt-3 text-muted-foreground"
          onClick={handleReset}
        >
          Reset
        </Button>
      </div>
    </div>
  );
};

export default DashboardValidateQrPage;
