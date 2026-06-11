import { AppsList } from "@/components/panels/apps-list";
import { NodeInspector } from "@/components/panels/node-inspector";
import type { AppSummary, ServiceNode, ServiceNodeData } from "@/types";

type RightPanelProps = {
  apps?: AppSummary[];
  appsLoading: boolean;
  appsError: boolean;
  appsErrorMessage?: string;
  selectedNode: ServiceNode | null;
  onRetryApps: () => void;
  onUpdateNode: (patch: Partial<ServiceNodeData>) => void;
};

export function RightPanel({
  apps,
  appsLoading,
  appsError,
  appsErrorMessage,
  selectedNode,
  onRetryApps,
  onUpdateNode,
}: RightPanelProps) {
  return (
    <div className="flex h-full min-h-0 flex-col bg-card text-card-foreground">
      <AppsList
        apps={apps}
        isLoading={appsLoading}
        isError={appsError}
        errorMessage={appsErrorMessage}
        onRetry={onRetryApps}
      />
      <NodeInspector selectedNode={selectedNode} onUpdateNode={onUpdateNode} />
    </div>
  );
}
