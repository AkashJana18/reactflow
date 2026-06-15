import { EdgeInspector } from "@/components/panels/edge-inspector";
import { NodeInspector } from "@/components/panels/node-inspector";
import type { ServiceEdge, ServiceNode, ServiceNodeData } from "@/types";

type RightPanelProps = {
  nodes: ServiceNode[];
  selectedNode: ServiceNode | null;
  selectedEdge: ServiceEdge | null;
  onUpdateNode: (patch: Partial<ServiceNodeData>) => void;
  onUpdateEdge: (patch: Partial<ServiceEdge>) => void;
  onDeleteEdge: () => void;
};

export function RightPanel({
  nodes,
  selectedNode,
  selectedEdge,
  onUpdateNode,
  onUpdateEdge,
  onDeleteEdge,
}: RightPanelProps) {
  return (
    <div className="flex h-full min-h-0 flex-col bg-card text-card-foreground">
      {selectedEdge ? (
        <EdgeInspector
          edge={selectedEdge}
          nodes={nodes}
          onUpdateEdge={onUpdateEdge}
          onDeleteEdge={onDeleteEdge}
        />
      ) : (
        <NodeInspector selectedNode={selectedNode} onUpdateNode={onUpdateNode} />
      )}
    </div>
  );
}
