import { useEffect, useState } from "react";
import {
  Background,
  BackgroundVariant,
  ControlButton,
  Controls,
  MiniMap,
  ReactFlow,
  useReactFlow,
  type NodeTypes,
  type OnConnect,
  type OnEdgesDelete,
  type OnEdgesChange,
  type OnNodesChange,
  type OnReconnect,
  type ReactFlowInstance,
} from "@xyflow/react";
import { Map, RefreshCw } from "lucide-react";
import { ServiceNodeCard } from "@/components/canvas/service-node";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { ServiceEdge, ServiceNode } from "@/types";

const nodeTypes = {
  service: ServiceNodeCard,
} satisfies NodeTypes;

type GraphCanvasProps = {
  nodes: ServiceNode[];
  edges: ServiceEdge[];
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
  onNodesChange: OnNodesChange<ServiceNode>;
  onEdgesChange: OnEdgesChange<ServiceEdge>;
  onConnect: OnConnect;
  onReconnect: OnReconnect<ServiceEdge>;
  onInit: (instance: ReactFlowInstance<ServiceNode, ServiceEdge>) => void;
  onSelectionChange: (nodeId: string | null, edgeId: string | null) => void;
  onNodesDelete: (nodes: ServiceNode[]) => void;
  onEdgesDelete: OnEdgesDelete<ServiceEdge>;
  onRetry: () => void;
};

export function GraphCanvas({
  nodes,
  edges,
  isLoading,
  isError,
  errorMessage,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onReconnect,
  onInit,
  onSelectionChange,
  onNodesDelete,
  onEdgesDelete,
  onRetry,
}: GraphCanvasProps) {
  const reactFlow = useReactFlow<ServiceNode, ServiceEdge>();
  const [isMiniMapVisible, setMiniMapVisible] = useState(false);

  useEffect(() => {
    if (nodes.length > 0 && !isLoading && !isError) {
      window.requestAnimationFrame(() => {
        reactFlow.fitView({ padding: 0.2, duration: 180 });
      });
    }
  }, [isError, isLoading, nodes.length, reactFlow]);

  return (
    <div className="flow-grid relative h-full w-full">
      <ReactFlow<ServiceNode, ServiceEdge>
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onReconnect={onReconnect}
        onInit={onInit}
        onNodeClick={(_, node) => onSelectionChange(node.id, null)}
        onEdgeClick={(_, edge) => onSelectionChange(null, edge.id)}
        onPaneClick={() => onSelectionChange(null, null)}
        onSelectionChange={({ nodes: selectedNodes, edges: selectedEdges }) =>
          onSelectionChange(
            selectedNodes[0]?.id ?? null,
            selectedEdges[0]?.id ?? null,
          )
        }
        onNodesDelete={onNodesDelete}
        onEdgesDelete={onEdgesDelete}
        deleteKeyCode={["Backspace", "Delete"]}
        edgesReconnectable
        reconnectRadius={1}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.35}
        maxZoom={1.6}
        panOnScroll
        selectionOnDrag
        onlyRenderVisibleElements
      >
        {/* <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={2}
          color="hsl(var(--flow-grid-dot) / 0.55)"
        /> */}
        <Controls position="bottom-left" showInteractive={false}>
          <ControlButton
            type="button"
            aria-label={isMiniMapVisible ? "Hide minimap" : "Show minimap"}
            aria-pressed={isMiniMapVisible}
            title={isMiniMapVisible ? "Hide minimap" : "Show minimap"}
            onClick={() => setMiniMapVisible((isVisible) => !isVisible)}
          >
            <Map className="size-4" aria-hidden="true" />
          </ControlButton>
        </Controls>
        {isMiniMapVisible ? (
          <MiniMap
            className="overflow-hidden rounded-md border border-border"
            pannable
            zoomable
            nodeColor={() => "hsl(var(--primary))"}
            maskColor="hsl(var(--flow-minimap-mask) / 0.62)"
          />
        ) : null}
      </ReactFlow>

      {isLoading ? <GraphLoading /> : null}
      {isError ? (
        <GraphError
          message={errorMessage ?? "The mock graph endpoint returned an error."}
          onRetry={onRetry}
        />
      ) : null}
      {!isLoading && !isError && nodes.length === 0 ? <GraphEmpty /> : null}
    </div>
  );
}

function GraphLoading() {
  return (
    <div className="absolute inset-0 z-10 grid place-items-center bg-background/45 backdrop-blur-sm">
      <div className="w-[min(26rem,calc(100vw-7rem))] rounded-lg border border-border bg-card p-4 shadow-panel">
        <Skeleton className="h-5 w-36" />
        <Skeleton className="mt-3 h-4 w-full" />
        <Skeleton className="mt-2 h-4 w-3/4" />
        <div className="mt-5 grid grid-cols-2 gap-3">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
      </div>
    </div>
  );
}

type GraphErrorProps = {
  message: string;
  onRetry: () => void;
};

function GraphError({ message, onRetry }: GraphErrorProps) {
  return (
    <div className="absolute inset-0 z-10 grid place-items-center bg-background/55 px-4 backdrop-blur-sm">
      <div className="max-w-md rounded-lg border border-destructive/30 bg-card p-5 shadow-panel">
        <h2 className="text-base font-semibold text-destructive">
          Graph failed to load
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">{message}</p>
        <Button
          type="button"
          variant="outline"
          className="mt-4"
          onClick={onRetry}
        >
          <RefreshCw aria-hidden="true" />
          Retry
        </Button>
      </div>
    </div>
  );
}

function GraphEmpty() {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 grid place-items-center px-4">
      <div className="max-w-sm rounded-lg border border-border bg-card/90 p-5 text-center shadow-panel backdrop-blur">
        <h2 className="text-base font-semibold text-foreground">
          No nodes in this graph
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Use Add Node in the top bar to create a service.
        </p>
      </div>
    </div>
  );
}
