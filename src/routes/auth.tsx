import { FormEvent, useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, CheckCircle2, LoaderCircle, LockKeyhole, Mail } from "lucide-react";

import { BrandMark } from "@/components/brand-mark";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in | Flight Price Notifier" },
      {
        name: "description",
        content: "Sign in or create your Flight Price Notifier account.",
      },
      { property: "og:title", content: "Sign in | Flight Price Notifier" },
      {
        property: "og:description",
        content: "Sign in or create your Flight Price Notifier account.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

type AuthMode = "signin" | "signup";

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    void supabase.auth.getUser().then(({ data }) => {
      if (data.user) void navigate({ to: "/app", replace: true });
    });
  }, [navigate]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    const result =
      mode === "signup"
        ? await supabase.auth.signUp({ email, password })
        : await supabase.auth.signInWithPassword({ email, password });

    if (result.error) {
      setError(result.error.message);
      setIsLoading(false);
      return;
    }

    await navigate({ to: "/app", replace: true });
  }

  function changeMode(nextMode: AuthMode) {
    setMode(nextMode);
    setError("");
  }

  return (
    <main className="auth-grid min-h-screen bg-background text-foreground">
      <header className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-5 sm:px-8">
        <BrandMark />
        <Button asChild variant="ghost" size="sm">
          <Link to="/">
            <ArrowLeft aria-hidden="true" />
            Back home
          </Link>
        </Button>
      </header>

      <section className="mx-auto grid min-h-[calc(100vh-5rem)] w-full max-w-7xl items-center gap-14 px-5 py-10 sm:px-8 lg:grid-cols-[1fr_28rem] lg:py-16">
        <div className="hidden max-w-xl lg:block">
          <p className="mb-6 font-mono text-xs uppercase text-primary">TPE → YOUR NEXT TRIP</p>
          <h1 className="font-display text-6xl font-semibold leading-[1.08]">
            Let the fare come down to you.
          </h1>
          <p className="mt-7 max-w-md text-lg leading-8 text-muted-foreground">
            設定預算，剩下的交給我們。當機票落入你的目標價格，通知就會準時抵達。
          </p>
          <div className="mt-12 flex items-center gap-3 text-sm text-muted-foreground">
            <CheckCircle2 className="size-5 text-primary" aria-hidden="true" />
            No booking commitment. Cancel anytime.
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card/90 p-6 shadow-2xl shadow-primary/5 backdrop-blur sm:p-9">
          <div className="mb-8 grid grid-cols-2 rounded-md bg-secondary p-1" aria-label="Account mode">
            <Button
              type="button"
              variant={mode === "signin" ? "default" : "ghost"}
              onClick={() => changeMode("signin")}
            >
              Sign In
            </Button>
            <Button
              type="button"
              variant={mode === "signup" ? "default" : "ghost"}
              onClick={() => changeMode("signup")}
            >
              Sign Up
            </Button>
          </div>

          <div className="mb-8">
            <p className="font-mono text-xs uppercase text-primary">{mode === "signin" ? "Welcome back" : "Create account"}</p>
            <h2 className="mt-3 font-display text-3xl font-semibold">
              {mode === "signin" ? "Sign in / 登入" : "Sign up / 註冊"}
            </h2>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="h-11 pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                <Input
                  id="password"
                  type="password"
                  autoComplete={mode === "signin" ? "current-password" : "new-password"}
                  required
                  minLength={6}
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="h-11 pl-10"
                />
              </div>
            </div>

            {error && (
              <p role="alert" className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </p>
            )}

            <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
              {isLoading ? <LoaderCircle className="animate-spin" aria-hidden="true" /> : <ArrowRight aria-hidden="true" />}
              {isLoading ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {mode === "signin" ? "New here?" : "Already have an account?"}{" "}
            <Button
              type="button"
              variant="link"
              className="h-auto p-0"
              onClick={() => changeMode(mode === "signin" ? "signup" : "signin")}
            >
              {mode === "signin" ? "Create an account" : "Sign in instead"}
            </Button>
          </p>
        </div>
      </section>
    </main>
  );
}