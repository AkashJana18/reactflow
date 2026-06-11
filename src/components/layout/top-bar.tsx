import {
  Bug,
  GitBranch,
  Maximize2,
  PanelRightOpen,
  Plus,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AppSummary } from "@/types";

type TopBarProps = {
  selectedApp?: AppSummary;
  simulateApiError: boolean;
  onAddNode: () => void;
  onFitView: () => void;
  onOpenMobilePanel: () => void;
  onToggleApiError: () => void;
};

export function TopBar({
  selectedApp,
  simulateApiError,
  onAddNode,
  onFitView,
  onOpenMobilePanel,
  onToggleApiError,
}: TopBarProps) {
  return (
    <header className="relative z-30 flex h-16 w-full min-w-0 shrink-0 items-center justify-between border-b border-border bg-card/95 px-3 backdrop-blur md:px-4">
      <div className="flex w-0 flex-1 items-center gap-3 overflow-hidden pr-12 sm:pr-0">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-md border border-border bg-background">
          <GitBranch className="size-5 text-primary" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <h1 className="truncate text-sm font-semibold text-foreground md:text-base">
            App Graph Builder
          </h1>
          <p className="truncate text-xs text-muted-foreground">
            {selectedApp?.name ?? "Loading application"}
          </p>
        </div>
      </div>

      <div className="ml-2 flex shrink-0 items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="hidden sm:inline-flex"
          onClick={onFitView}
        >
          <Maximize2 aria-hidden="true" />
          Fit
        </Button>
        <Button
          type="button"
          variant="default"
          size="sm"
          className="hidden px-2 sm:inline-flex sm:px-3"
          onClick={onAddNode}
        >
          <Plus aria-hidden="true" />
          <span className="hidden sm:inline">Add Node</span>
        </Button>
        <Button
          type="button"
          variant={simulateApiError ? "destructive" : "outline"}
          size="icon"
          className="hidden sm:inline-flex"
          aria-label={
            simulateApiError ? "Disable mock API error" : "Enable mock API error"
          }
          aria-pressed={simulateApiError}
          onClick={onToggleApiError}
        >
          <Bug aria-hidden="true" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="hidden md:inline-flex"
          aria-label="Share graph"
        >
          <Share2 aria-hidden="true" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="absolute right-3 top-3 sm:static lg:hidden"
          aria-label="Open app panel"
          onClick={onOpenMobilePanel}
        >
          <PanelRightOpen aria-hidden="true" />
        </Button>
      </div>
    </header>
  );
}
