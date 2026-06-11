import { create } from "zustand";
import type { InspectorTab } from "@/types";

type GraphBuilderState = {
  selectedAppId: string | null;
  selectedNodeId: string | null;
  isMobilePanelOpen: boolean;
  activeInspectorTab: InspectorTab;
  simulateApiError: boolean;
  setSelectedAppId: (appId: string) => void;
  setSelectedNodeId: (nodeId: string | null) => void;
  setMobilePanelOpen: (isOpen: boolean) => void;
  setActiveInspectorTab: (tab: InspectorTab) => void;
  toggleApiError: () => void;
};

export const useGraphBuilderStore = create<GraphBuilderState>((set) => ({
  selectedAppId: null,
  selectedNodeId: null,
  isMobilePanelOpen: false,
  activeInspectorTab: "config",
  simulateApiError: false,
  setSelectedAppId: (appId) =>
    set({
      selectedAppId: appId,
      selectedNodeId: null,
      activeInspectorTab: "config",
    }),
  setSelectedNodeId: (nodeId) => set({ selectedNodeId: nodeId }),
  setMobilePanelOpen: (isOpen) => set({ isMobilePanelOpen: isOpen }),
  setActiveInspectorTab: (tab) => set({ activeInspectorTab: tab }),
  toggleApiError: () =>
    set((state) => ({
      simulateApiError: !state.simulateApiError,
      selectedNodeId: null,
    })),
}));
