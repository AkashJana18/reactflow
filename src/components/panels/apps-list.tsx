import { ChevronRight, RefreshCw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useGraphBuilderStore } from "@/store/use-graph-builder-store";
import type { AppSummary } from "@/types";
import { cn } from "@/lib/utils";

type AppsListProps = {
  apps?: AppSummary[];
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
  onRetry: () => void;
};

export function AppsList({
  apps,
  isLoading,
  isError,
  errorMessage,
  onRetry,
}: AppsListProps) {
  const selectedAppId = useGraphBuilderStore((state) => state.selectedAppId);
  const setSelectedAppId = useGraphBuilderStore(
    (state) => state.setSelectedAppId,
  );

  return (
    <section className="border-b border-border p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-foreground">
            Application
          </h2>
          <p className="text-xs text-muted-foreground">Choose a mock app graph</p>
        </div>
      </div>

      <div className="relative mb-3">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          className="pl-9"
          placeholder="Search apps"
          type="search"
          aria-label="Search apps"
          disabled
        />
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-12 w-full" />
          ))}
        </div>
      ) : null}

      {isError ? (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3">
          <p className="text-sm font-medium text-destructive">Apps failed</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {errorMessage ?? "The mock apps endpoint returned an error."}
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-3"
            onClick={onRetry}
          >
            <RefreshCw aria-hidden="true" />
            Retry
          </Button>
        </div>
      ) : null}

      {!isLoading && !isError && apps?.length === 0 ? (
        <div className="rounded-md border border-border bg-muted/40 p-3 text-sm text-muted-foreground">
          No apps found.
        </div>
      ) : null}

      {!isLoading && !isError && apps?.length ? (
        <div className="space-y-2">
          {apps.map((app) => {
            const isSelected = app.id === selectedAppId;

            return (
              <Button
                key={app.id}
                type="button"
                variant="ghost"
                className={cn(
                  "h-auto w-full justify-start gap-3 px-2 py-2 text-left",
                  isSelected && "bg-muted text-foreground",
                )}
                onClick={() => setSelectedAppId(app.id)}
              >
                <span
                  className={cn(
                    "flex size-10 shrink-0 items-center justify-center rounded-md text-white",
                    app.accent,
                  )}
                  aria-hidden="true"
                >
                  {app.name.slice(-1).toUpperCase()}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">
                    {app.name}
                  </span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {app.runtime} / {app.region}
                  </span>
                </span>
                <ChevronRight
                  className="size-4 shrink-0 text-muted-foreground"
                  aria-hidden="true"
                />
              </Button>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}
