import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  addEdge,
  reconnectEdge,
  useEdgesState,
  useNodesState,
  type Connection,
  type ReactFlowInstance,
} from "@xyflow/react";
import { GraphCanvas } from "@/components/canvas/graph-canvas";
import { LeftRail } from "@/components/layout/left-rail";
import { TopBar } from "@/components/layout/top-bar";
import { AddNodeDialog } from "@/components/panels/add-node-dialog";
import { RightPanel } from "@/components/panels/right-panel";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useAppGraph } from "@/hooks/use-app-graph";
import { useApps } from "@/hooks/use-apps";
import { useTheme } from "@/hooks/use-theme";
import { useGraphBuilderStore } from "@/store/use-graph-builder-store";
import type { ServiceEdge, ServiceNode, ServiceNodeData } from "@/types";

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
  const [isAddNodeDialogOpen, setAddNodeDialogOpen] = useState(false);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
  const loadedAppId = useRef<string | null>(null);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    if (!selectedAppId && appsQuery.data?.[0]) {
      setSelectedAppId(appsQuery.data[0].id);
    }
  }, [appsQuery.data, selectedAppId, setSelectedAppId]);

  useEffect(() => {
    if (selectedAppId !== loadedAppId.current) {
      setNodes([]);
      setEdges([]);
      setSelectedEdgeId(null);
    }
  }, [selectedAppId, setEdges, setNodes]);

  useEffect(() => {
    if (graphQuery.data && selectedAppId) {
      setNodes(graphQuery.data.nodes);
      setEdges(graphQuery.data.edges);
      setSelectedNodeId(null);
      setSelectedEdgeId(null);
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

  useEffect(() => {
    if (selectedNodeId) {
      setSelectedEdgeId(null);
    }
  }, [selectedNodeId]);

  useEffect(() => {
    if (selectedEdgeId && !edges.some((edge) => edge.id === selectedEdgeId)) {
      setSelectedEdgeId(null);
    }
  }, [edges, selectedEdgeId]);

  const selectedApp = useMemo(
    () => appsQuery.data?.find((app) => app.id === selectedAppId),
    [appsQuery.data, selectedAppId],
  );

  const selectedNode = useMemo(
    () => nodes.find((node) => node.id === selectedNodeId) ?? null,
    [nodes, selectedNodeId],
  );

  const selectedEdge = useMemo(
    () => edges.find((edge) => edge.id === selectedEdgeId) ?? null,
    [edges, selectedEdgeId],
  );

  const handleSelectionChange = useCallback(
    (
      nodeId: string | null,
      edgeId: string | null,
      openMobilePanel = false,
    ) => {
      setSelectedNodeId(nodeId);
      setSelectedEdgeId(nodeId ? null : edgeId);
      if (openMobilePanel && (nodeId || edgeId) && isMobileViewport()) {
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

  const handleUpdateSelectedEdge = useCallback(
    (patch: Partial<ServiceEdge>) => {
      if (!selectedEdgeId) {
        return;
      }

      setEdges((currentEdges) =>
        currentEdges.map((edge) =>
          edge.id === selectedEdgeId
            ? {
                ...edge,
                ...patch,
                data: patch.data ? { ...edge.data, ...patch.data } : edge.data,
              }
            : edge,
        ),
      );
    },
    [selectedEdgeId, setEdges],
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

  const handleReconnect = useCallback(
    (oldEdge: ServiceEdge, newConnection: Connection) => {
      setEdges((currentEdges) =>
        reconnectEdge(oldEdge, newConnection, currentEdges, {
          shouldReplaceId: false,
        }),
      );
      setSelectedEdgeId(oldEdge.id);
      setSelectedNodeId(null);
    },
    [setEdges, setSelectedNodeId],
  );

  const handleNodesDelete = useCallback(
    (deletedNodes: ServiceNode[]) => {
      if (deletedNodes.some((node) => node.id === selectedNodeId)) {
        setSelectedNodeId(null);
      }
    },
    [selectedNodeId, setSelectedNodeId],
  );

  const handleEdgesDelete = useCallback(
    (deletedEdges: ServiceEdge[]) => {
      if (deletedEdges.some((edge) => edge.id === selectedEdgeId)) {
        setSelectedEdgeId(null);
      }
    },
    [selectedEdgeId],
  );

  const handleDeleteSelectedEdge = useCallback(() => {
    if (!selectedEdgeId) {
      return;
    }

    setEdges((currentEdges) =>
      currentEdges.filter((edge) => edge.id !== selectedEdgeId),
    );
    setSelectedEdgeId(null);
  }, [selectedEdgeId, setEdges]);

  const handleAddNode = useCallback((data: ServiceNodeData) => {
    const id = `service-${Date.now()}`;
    const newNode: ServiceNode = {
      id,
      type: "service",
      position: {
        x: 160 + nodes.length * 52,
        y: 140 + (nodes.length % 3) * 112,
      },
      data,
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
      nodes={nodes}
      selectedNode={selectedNode}
      selectedEdge={selectedEdge}
      onUpdateNode={handleUpdateSelectedNode}
      onUpdateEdge={handleUpdateSelectedEdge}
      onDeleteEdge={handleDeleteSelectedEdge}
    />
  );

  return (
    <div className="flex h-screen w-screen min-w-0 flex-col overflow-hidden bg-background text-foreground">
      <TopBar
        apps={appsQuery.data}
        selectedApp={selectedApp}
        appsLoading={appsQuery.isLoading}
        appsError={appsQuery.isError}
        appsErrorMessage={appsErrorMessage}
        simulateApiError={simulateApiError}
        theme={theme}
        onAddNode={() => setAddNodeDialogOpen(true)}
        onFitView={handleFitView}
        onOpenMobilePanel={() => setMobilePanelOpen(true)}
        onRetryApps={() => void appsQuery.refetch()}
        onSelectApp={setSelectedAppId}
        onToggleApiError={toggleApiError}
        onToggleTheme={toggleTheme}
      />

      <div className="flex min-h-0 flex-1">
        <main className="relative min-w-0 flex-1">
          <LeftRail />
          <GraphCanvas
            nodes={nodes}
            edges={edges}
            isLoading={graphQuery.isLoading || appsQuery.isLoading}
            isError={graphQuery.isError}
            errorMessage={graphErrorMessage}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={handleConnect}
            onReconnect={handleReconnect}
            onInit={setReactFlowInstance}
            onSelectionChange={handleSelectionChange}
            onNodesDelete={handleNodesDelete}
            onEdgesDelete={handleEdgesDelete}
            onRetry={() => void graphQuery.refetch()}
          />
        </main>
        <aside className="hidden w-96 shrink-0 border-l border-border lg:block">
          {panel}
        </aside>
      </div>

      <AddNodeDialog
        open={isAddNodeDialogOpen}
        defaultName={`Service ${nodes.length + 1}`}
        onOpenChange={setAddNodeDialogOpen}
        onCreateNode={handleAddNode}
      />

      <Sheet open={isMobilePanelOpen} onOpenChange={setMobilePanelOpen}>
        <SheetContent className="w-[min(92vw,24rem)] p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>Node inspector</SheetTitle>
          </SheetHeader>
          {panel}
        </SheetContent>
      </Sheet>
    </div>
  );
}
