import { Plane } from "lucide-react";

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3" aria-label="Flight Price Notifier">
      <span className="flex size-9 items-center justify-center rounded-md border border-primary/30 bg-primary/10 text-primary">
        <Plane className="size-4 -rotate-12" aria-hidden="true" />
      </span>
      {!compact && (
        <span className="font-display text-sm font-semibold text-foreground">
          Flight Price Notifier
        </span>
      )}
    </div>
  );
}