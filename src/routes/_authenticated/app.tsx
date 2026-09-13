import { useState } from "react";
import { createFileRoute, useNavigate, useRouter } from "@tanstack/react-router";
import { BellRing, LogOut, Mail, MapPin, Plane } from "lucide-react";

import { BrandMark } from "@/components/brand-mark";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/app")({
  head: () => ({
    meta: [
      { title: "Dashboard | Flight Price Notifier" },
      {
        name: "description",
        content: "Manage your Flight Price Notifier route alerts and account.",
      },
      { property: "og:title", content: "Dashboard | Flight Price Notifier" },
      {
        property: "og:description",
        content: "Manage your Flight Price Notifier route alerts and account.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AppDashboard,
});

function AppDashboard() {
  const { user } = Route.useRouteContext();
  const navigate = useNavigate();
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function handleSignOut() {
    setIsSigningOut(true);
    await router.options.context.queryClient.cancelQueries();
    router.options.context.queryClient.clear();
    await supabase.auth.signOut();
    await navigate({ to: "/", replace: true });
  }

  return (
    <main className="app-grid min-h-screen bg-background text-foreground">
      <header className="border-b border-border/70 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 sm:px-8">
          <BrandMark />
          <Button variant="ghost" onClick={handleSignOut} disabled={isSigningOut}>
            <LogOut aria-hidden="true" />
            {isSigningOut ? "Signing out…" : "Sign Out"}
          </Button>
        </div>
      </header>

      <section className="mx-auto flex w-full max-w-7xl flex-col px-5 py-12 sm:px-8 sm:py-20">
        <div className="mb-14 flex items-center gap-3 text-xs font-semibold uppercase tracking-widest text-primary">
          <span className="status-dot" />
          Route monitor / 航線監控
        </div>

        <div className="max-w-3xl animate-rise">
          <p className="mb-4 font-mono text-sm text-muted-foreground">ACCOUNT ACTIVE</p>
          <h1 className="font-display text-4xl font-semibold leading-tight text-foreground sm:text-6xl">
            Hi {user.email}
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-muted-foreground">
            你的航線追蹤儀表板即將上線 — 下一個里程碑會加上訂閱航線的功能。
          </p>
          <p className="mt-3 text-base leading-7 text-muted-foreground/80">
            Your dashboard is coming soon. Route-subscription will be added in the next milestone.
          </p>
        </div>

        <div className="mt-14 grid gap-px overflow-hidden rounded-lg border border-border bg-border/70 md:grid-cols-3">
          {[
            { icon: MapPin, label: "Departure", value: "Taipei / TPE" },
            { icon: Plane, label: "Routes", value: "Coming next" },
            { icon: BellRing, label: "Email alerts", value: "Standing by" },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="bg-card p-6 sm:p-8">
              <Icon className="mb-10 size-5 text-primary" aria-hidden="true" />
              <p className="font-mono text-xs uppercase text-muted-foreground">{label}</p>
              <p className="mt-2 font-display text-xl font-medium text-card-foreground">{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex items-center gap-3 border-l-2 border-primary/70 py-2 pl-4 text-sm text-muted-foreground">
          <Mail className="size-4 text-primary" aria-hidden="true" />
          Alerts will be delivered to {user.email}
        </div>
      </section>
    </main>
  );
}