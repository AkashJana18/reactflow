import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  addEdge,
  useEdgesState,
  useNodesState,
  type Connection,
  type ReactFlowInstance,
} from "@xyflow/react";
import { GraphCanvas } from "@/components/canvas/graph-canvas";
import { LeftRail } from "@/components/layout/left-rail";
import { TopBar } from "@/components/layout/top-bar";
import { RightPanel } from "@/components/panels/right-panel";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useAppGraph } from "@/hooks/use-app-graph";
import { useApps } from "@/hooks/use-apps";
import { useGraphBuilderStore } from "@/store/use-graph-builder-store";
import type { ServiceEdge, ServiceNode, ServiceNodeData } from "@/types";

const newNodeDefaults: ServiceNodeData = {
  name: "New Service",
  description: "New service node added from the graph builder.",
  status: "Healthy",
  cpu: 25,
  memoryGb: 0.5,
  diskGb: 10,
  replicas: 1,
  runtimeVersion: "Node 22",
  region: "us-east-1",
  provider: "AWS",
  kind: "api",
  costPerHour: 0.03,
};

function isMobileViewport() {
  return window.matchMedia("(max-width: 1023px)").matches;
}

export function GraphBuilder() {
  const selectedAppId = useGraphBuilderStore((state) => state.selectedAppId);
  const selectedNodeId = useGraphBuilderStore((state) => state.selectedNodeId);
  const isMobilePanelOpen = useGraphBuilderStore(
    (state) => state.isMobilePanelOpen,
  );
  const simulateApiError = useGraphBuilderStore(
    (state) => state.simulateApiError,
  );
  const setSelectedAppId = useGraphBuilderStore(
    (state) => state.setSelectedAppId,
  );
  const setSelectedNodeId = useGraphBuilderStore(
    (state) => state.setSelectedNodeId,
  );
  const setMobilePanelOpen = useGraphBuilderStore(
    (state) => state.setMobilePanelOpen,
  );
  const toggleApiError = useGraphBuilderStore((state) => state.toggleApiError);

  const appsQuery = useApps(simulateApiError);
  const graphQuery = useAppGraph(selectedAppId, simulateApiError);

  const [nodes, setNodes, onNodesChange] = useNodesState<ServiceNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<ServiceEdge>([]);
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance<ServiceNode, ServiceEdge> | null>(null);
  const loadedAppId = useRef<string | null>(null);

  useEffect(() => {
    if (!selectedAppId && appsQuery.data?.[0]) {
      setSelectedAppId(appsQuery.data[0].id);
    }
  }, [appsQuery.data, selectedAppId, setSelectedAppId]);

  useEffect(() => {
    if (selectedAppId !== loadedAppId.current) {
      setNodes([]);
      setEdges([]);
    }
  }, [selectedAppId, setEdges, setNodes]);

  useEffect(() => {
    if (graphQuery.data && selectedAppId) {
      setNodes(graphQuery.data.nodes);
      setEdges(graphQuery.data.edges);
      setSelectedNodeId(null);
      loadedAppId.current = selectedAppId;
    }
  }, [
    graphQuery.data,
    selectedAppId,
    setEdges,
    setNodes,
    setSelectedNodeId,
  ]);

  useEffect(() => {
    if (selectedNodeId && !nodes.some((node) => node.id === selectedNodeId)) {
      setSelectedNodeId(null);
    }
  }, [nodes, selectedNodeId, setSelectedNodeId]);

  const selectedApp = useMemo(
    () => appsQuery.data?.find((app) => app.id === selectedAppId),
    [appsQuery.data, selectedAppId],
  );

  const selectedNode = useMemo(
    () => nodes.find((node) => node.id === selectedNodeId) ?? null,
    [nodes, selectedNodeId],
  );

  const handleNodeSelect = useCallback(
    (nodeId: string | null) => {
      setSelectedNodeId(nodeId);
      if (nodeId && isMobileViewport()) {
        setMobilePanelOpen(true);
      }
    },
    [setMobilePanelOpen, setSelectedNodeId],
  );

  const handleUpdateSelectedNode = useCallback(
    (patch: Partial<ServiceNodeData>) => {
      if (!selectedNodeId) {
        return;
      }

      setNodes((currentNodes) =>
        currentNodes.map((node) =>
          node.id === selectedNodeId
            ? { ...node, data: { ...node.data, ...patch } }
            : node,
        ),
      );
    },
    [selectedNodeId, setNodes],
  );

  const handleConnect = useCallback(
    (connection: Connection) => {
      setEdges((currentEdges) =>
        addEdge(
          {
            ...connection,
            id: `${connection.source}-${connection.target}-${Date.now()}`,
            type: "smoothstep",
            animated: true,
          },
          currentEdges,
        ),
      );
    },
    [setEdges],
  );

  const handleNodesDelete = useCallback(
    (deletedNodes: ServiceNode[]) => {
      if (deletedNodes.some((node) => node.id === selectedNodeId)) {
        setSelectedNodeId(null);
      }
    },
    [selectedNodeId, setSelectedNodeId],
  );

  const handleAddNode = useCallback(() => {
    const id = `service-${Date.now()}`;
    const newNode: ServiceNode = {
      id,
      type: "service",
      position: {
        x: 160 + nodes.length * 52,
        y: 140 + (nodes.length % 3) * 112,
      },
      data: {
        ...newNodeDefaults,
        name: `Service ${nodes.length + 1}`,
      },
    };

    setNodes((currentNodes) => [...currentNodes, newNode]);

    if (selectedNodeId) {
      setEdges((currentEdges) =>
        addEdge(
          {
            id: `${selectedNodeId}-${id}`,
            source: selectedNodeId,
            target: id,
            type: "smoothstep",
            animated: true,
          },
          currentEdges,
        ),
      );
    }

    setSelectedNodeId(id);
    if (isMobileViewport()) {
      setMobilePanelOpen(true);
    }
  }, [
    nodes.length,
    selectedNodeId,
    setEdges,
    setMobilePanelOpen,
    setNodes,
    setSelectedNodeId,
  ]);

  const handleFitView = useCallback(() => {
    reactFlowInstance?.fitView({ padding: 0.2, duration: 220 });
  }, [reactFlowInstance]);

  const appsErrorMessage =
    appsQuery.error instanceof Error ? appsQuery.error.message : undefined;
  const graphErrorMessage =
    graphQuery.error instanceof Error ? graphQuery.error.message : undefined;

  const panel = (
    <RightPanel
      apps={appsQuery.data}
      appsLoading={appsQuery.isLoading}
      appsError={appsQuery.isError}
      appsErrorMessage={appsErrorMessage}
      selectedNode={selectedNode}
      onRetryApps={() => void appsQuery.refetch()}
      onUpdateNode={handleUpdateSelectedNode}
    />
  );

  return (
    <div className="flex h-screen w-screen min-w-0 flex-col overflow-hidden bg-background text-foreground">
      <TopBar
        selectedApp={selectedApp}
        simulateApiError={simulateApiError}
        onAddNode={handleAddNode}
        onFitView={handleFitView}
        onOpenMobilePanel={() => setMobilePanelOpen(true)}
        onToggleApiError={toggleApiError}
      />

      <div className="flex min-h-0 flex-1">
        <LeftRail />
        <main className="min-w-0 flex-1">
          <GraphCanvas
            nodes={nodes}
            edges={edges}
            isLoading={graphQuery.isLoading || appsQuery.isLoading}
            isError={graphQuery.isError}
            errorMessage={graphErrorMessage}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={handleConnect}
            onInit={setReactFlowInstance}
            onNodeSelect={handleNodeSelect}
            onNodesDelete={handleNodesDelete}
            onRetry={() => void graphQuery.refetch()}
          />
        </main>
        <aside className="hidden w-96 shrink-0 border-l border-border lg:block">
          {panel}
        </aside>
      </div>

      <Sheet open={isMobilePanelOpen} onOpenChange={setMobilePanelOpen}>
        <SheetContent className="w-[min(92vw,24rem)] p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>Application panel</SheetTitle>
          </SheetHeader>
          {panel}
        </SheetContent>
      </Sheet>
    </div>
  );
}
