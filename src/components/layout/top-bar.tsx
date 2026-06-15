import {
  Bug,
  Maximize2,
  PanelRightOpen,
  Plus,
  Share2,
} from "lucide-react";
import { ApplicationMenu } from "@/components/layout/application-menu";
import { Button } from "@/components/ui/button";
import type { AppSummary } from "@/types";

type TopBarProps = {
  apps?: AppSummary[];
  selectedApp?: AppSummary;
  appsLoading: boolean;
  appsError: boolean;
  appsErrorMessage?: string;
  simulateApiError: boolean;
  onAddNode: () => void;
  onFitView: () => void;
  onOpenMobilePanel: () => void;
  onRetryApps: () => void;
  onSelectApp: (appId: string) => void;
  onToggleApiError: () => void;
};

export function TopBar({
  apps,
  selectedApp,
  appsLoading,
  appsError,
  appsErrorMessage,
  simulateApiError,
  onAddNode,
  onFitView,
  onOpenMobilePanel,
  onRetryApps,
  onSelectApp,
  onToggleApiError,
}: TopBarProps) {
  return (
    <header className="relative z-40 flex h-20 w-full min-w-0 shrink-0 items-center justify-between border-b border-border bg-background/95 px-3 backdrop-blur md:px-4">
      <ApplicationMenu
        apps={apps}
        selectedApp={selectedApp}
        isLoading={appsLoading}
        isError={appsError}
        errorMessage={appsErrorMessage}
        onRetry={onRetryApps}
        onSelectApp={onSelectApp}
        className="max-w-[38.5rem] flex-1"
      />

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
          className="absolute right-3 top-5 sm:static lg:hidden"
          aria-label="Open inspector"
          onClick={onOpenMobilePanel}
        >
          <PanelRightOpen aria-hidden="true" />
        </Button>
      </div>
    </header>
  );
}
