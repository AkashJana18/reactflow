import { NodeInspector } from "@/components/panels/node-inspector";
import type { ServiceNode, ServiceNodeData } from "@/types";

type RightPanelProps = {
  selectedNode: ServiceNode | null;
  onUpdateNode: (patch: Partial<ServiceNodeData>) => void;
};

export function RightPanel({
  selectedNode,
  onUpdateNode,
}: RightPanelProps) {
  return (
    <div className="flex h-full min-h-0 flex-col bg-card text-card-foreground">
      <NodeInspector selectedNode={selectedNode} onUpdateNode={onUpdateNode} />
    </div>
  );
}
