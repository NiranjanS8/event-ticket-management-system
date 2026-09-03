import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { ArrowRight, BadgeCheck, QrCode, Ticket } from "lucide-react";
import SiteHeader from "@/components/site-header";

const OrganizersLandingPage: React.FC = () => {
  const navigate = useNavigate();

  const capabilities = [
    {
      icon: Ticket,
      title: "Create and sell",
      description:
        "Build events with multiple ticket types, prices, and availability in minutes.",
    },
    {
      icon: QrCode,
      title: "Validate at the door",
      description:
        "Scan QR codes on arrival and know instantly whether a ticket is valid.",
    },
    {
      icon: BadgeCheck,
      title: "Stay in control",
      description:
        "Draft, publish, and cancel events — with your sales window always in view.",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader dashboardHref="/dashboard/events" />

      <main className="container mx-auto px-4">
        {/* Hero */}
        <div className="border-b border-border py-20 md:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <h1 className="font-display text-4xl font-semibold leading-[1.04] tracking-[-0.03em] sm:text-5xl md:text-6xl">
                <span className="line-mask">
                  <span className="line-rise" style={{ animationDelay: "80ms" }}>
                    Create, manage, and
                  </span>
                </span>
                <span className="line-mask">
                  <span className="line-rise" style={{ animationDelay: "200ms" }}>
                    sell tickets
                  </span>
                </span>
                <span className="line-mask">
                  <span
                    className="line-rise text-muted-foreground"
                    style={{ animationDelay: "320ms" }}
                  >
                    with ease<span className="text-accent">.</span>
                  </span>
                </span>
              </h1>

              <p
                className="animate-fade-up mt-8 max-w-lg text-lg text-muted-foreground"
                style={{ animationDelay: "440ms" }}
              >
                A complete platform for event organizers: publish events, sell
                tickets, and validate attendees with QR codes.
              </p>

              <div
                className="animate-fade-up mt-10 flex flex-wrap gap-3"
                style={{ animationDelay: "560ms" }}
              >
                <Button
                  size="lg"
                  className="cursor-pointer"
                  onClick={() => navigate("/dashboard/events")}
                >
                  Create an event
                  <ArrowRight />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="cursor-pointer"
                  onClick={() => navigate("/")}
                >
                  Browse events
                </Button>
              </div>
            </div>

            <div
              className="animate-scale-in overflow-hidden rounded-xl border border-border"
              style={{ animationDelay: "300ms" }}
            >
              <img
                src="/organizers-landing-hero.png"
                alt="A busy concert"
                className="aspect-[4/5] w-full object-cover transition-transform duration-700 ease-out-expo hover:scale-105"
              />
            </div>
          </div>
        </div>

        {/* Capabilities */}
        <div className="grid gap-px overflow-hidden rounded-xl border border-border bg-border py-0 md:grid-cols-3">
          {capabilities.map((capability) => (
            <div
              key={capability.title}
              className="group bg-card p-8 transition-colors duration-300 hover:bg-card/60"
            >
              <capability.icon className="h-5 w-5 text-accent" />
              <h2 className="mt-5 font-display text-xl font-semibold tracking-tight">
                {capability.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {capability.description}
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default OrganizersLandingPage;
