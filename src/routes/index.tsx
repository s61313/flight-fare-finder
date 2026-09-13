import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BellRing, CalendarX2, Eye, Plane, Radar } from "lucide-react";

import taipeiNightFlight from "@/assets/taipei-night-flight.jpg";
import { BrandMark } from "@/components/brand-mark";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Flight Price Notifier | 機票降價通知" },
      {
        name: "description",
        content: "設定航線與目標價，機票降價就寄信通知你。Track Taipei routes and get email alerts when fares meet your budget.",
      },
      { property: "og:title", content: "Flight Price Notifier | 機票降價通知" },
      {
        property: "og:description",
        content: "設定航線與目標價，機票降價就寄信通知你。",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    void supabase.auth.getUser().then(({ data }) => setIsSignedIn(Boolean(data.user)));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") {
        setIsSignedIn(Boolean(session?.user));
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <section className="relative isolate min-h-[88vh] border-b border-border">
        <img
          src={taipeiNightFlight}
          alt="Night flight departing over Taipei city lights"
          width={1600}
          height={1000}
          className="absolute inset-0 -z-20 h-full w-full object-cover object-[64%_center]"
        />
        <div className="hero-scrim absolute inset-0 -z-10" />
        <div className="route-grid absolute inset-0 -z-10 opacity-30" />

        <header className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
          <BrandMark />
          <Button asChild variant="outline" className="border-foreground/20 bg-background/20 backdrop-blur-lg hover:bg-background/40">
            <Link to={isSignedIn ? "/app" : "/auth"}>
              {isSignedIn ? "Dashboard / 儀表板" : "Sign in / 登入"}
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </header>

        <div className="mx-auto flex min-h-[calc(88vh-5rem)] max-w-7xl flex-col justify-center px-5 pb-16 pt-10 sm:px-8 sm:pb-24">
          <div className="max-w-4xl animate-rise">
            <div className="mb-7 flex items-center gap-3 font-mono text-xs uppercase text-primary">
              <Radar className="size-4" aria-hidden="true" />
              Fare watch active · TPE
            </div>
            <h1 className="max-w-4xl font-display text-5xl font-semibold leading-[1.03] text-foreground sm:text-7xl lg:text-8xl">
              Flight Price
              <span className="block text-primary">Notifier</span>
            </h1>
            <p className="mt-8 max-w-2xl text-xl font-medium leading-8 text-foreground sm:text-2xl">
              設定航線與目標價，機票降價就通知你
            </p>
            <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              Set a route and a target price — we email you when the fare drops.
            </p>
            <Button asChild size="lg" className="mt-9">
              <Link to={isSignedIn ? "/app" : "/auth"}>
                {isSignedIn ? "Open dashboard" : "Start watching fares"}
                <Plane aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="absolute bottom-0 right-0 hidden w-[42%] items-center justify-between border-l border-t border-border/60 bg-background/65 px-8 py-5 backdrop-blur-xl lg:flex">
          <span className="font-mono text-xs text-muted-foreground">TPE 25.0330° N</span>
          <span className="font-mono text-xs text-muted-foreground">WATCHING TOKYO · SEOUL</span>
        </div>
      </section>

      <section className="bg-background px-5 py-20 sm:px-8 sm:py-28" aria-labelledby="features-heading">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 grid gap-6 lg:grid-cols-[1fr_1.4fr] lg:items-end">
            <div>
              <p className="font-mono text-xs uppercase text-primary">HOW IT WORKS / 運作方式</p>
              <h2 id="features-heading" className="mt-4 font-display text-4xl font-semibold sm:text-5xl">
                Your budget sets the destination.
              </h2>
            </div>
            <p className="max-w-xl text-base leading-7 text-muted-foreground lg:justify-self-end">
              不用天天搜尋，不用猜哪天最便宜。把價格交給我們追蹤，你只需要準備出發。
            </p>
          </div>

          <div className="grid gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-3">
            {[
              {
                number: "01",
                icon: Eye,
                title: "盯緊熱門航線",
                subtitle: "Always-on route watching",
                body: "持續監控台北出發的熱門航線（東京、首爾），自動抓最低票價。",
              },
              {
                number: "02",
                icon: BellRing,
                title: "達標自動通知",
                subtitle: "Target-price email alerts",
                body: "低於你設定的目標價，就寄 email 提醒你，附上立即訂購連結。",
              },
              {
                number: "03",
                icon: CalendarX2,
                title: "隨時取消",
                subtitle: "Cancel anytime",
                body: "月訂閱制，不想用隨時停，沒有綁約。",
              },
            ].map(({ number, icon: Icon, title, subtitle, body }) => (
              <article key={number} className="feature-card group bg-card p-7 sm:p-9">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-muted-foreground">{number}</span>
                  <Icon className="size-5 text-primary transition-transform duration-300 group-hover:-translate-y-1" aria-hidden="true" />
                </div>
                <h3 className="mt-16 font-display text-2xl font-semibold">{title}</h3>
                <p className="mt-2 text-sm font-medium text-primary">{subtitle}</p>
                <p className="mt-6 text-base leading-7 text-muted-foreground">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-border bg-card px-5 py-8 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <BrandMark />
          <p>© 2026 Flight Price Notifier</p>
        </div>
      </footer>
    </main>
  );
}
