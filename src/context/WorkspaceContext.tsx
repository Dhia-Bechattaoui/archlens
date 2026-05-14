"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export interface ASTNode {
  id: string;
  title: string;
  type: "service" | "controller" | "model";
  x: number;
  y: number;
  complexity: number;
  inEdges: string[];
}

export interface Edge {
  source: string;
  target: string;
}

interface WorkspaceContextType {
  traversalDepth: number;
  setTraversalDepth: (depth: number) => void;
  activeFilters: string[];
  toggleFilter: (type: string) => void;
  nodes: ASTNode[];
  setNodes: React.Dispatch<React.SetStateAction<ASTNode[]>>;
  edges: Edge[];
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  isScanning: boolean;
  syncCodebaseAST: () => Promise<void>;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

// Initial baseline mock system representation mapping
const INITIAL_NODES: ASTNode[] = [
  { id: "node-api-gateway", title: "ApiGatewayController", type: "controller", x: 80, y: 100, complexity: 12, inEdges: [] },
  { id: "node-auth-service", title: "AuthenticationService", type: "service", x: 400, y: 180, complexity: 28, inEdges: ["node-api-gateway"] },
  { id: "node-user-model", title: "UserModelEntity", type: "model", x: 750, y: 120, complexity: 8, inEdges: ["node-auth-service"] },
  { id: "node-payment-service", title: "BillingEngineService", type: "service", x: 420, y: 380, complexity: 42, inEdges: ["node-api-gateway"] },
  { id: "node-ledger-model", title: "TransactionLedger", type: "model", x: 780, y: 400, complexity: 19, inEdges: ["node-payment-service"] },
];

const INITIAL_EDGES: Edge[] = [
  { source: "node-api-gateway", target: "node-auth-service" },
  { source: "node-auth-service", target: "node-user-model" },
  { source: "node-api-gateway", target: "node-payment-service" },
  { source: "node-payment-service", target: "node-ledger-model" },
];

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [traversalDepth, setTraversalDepth] = useState<number>(3);
  const [activeFilters, setActiveFilters] = useState<string[]>(["services", "controllers", "models"]);
  const [nodes, setNodes] = useState<ASTNode[]>(INITIAL_NODES);
  const [edges, setEdges] = useState<Edge[]>(INITIAL_EDGES);
  const [isScanning, setIsScanning] = useState<boolean>(false);

  const toggleFilter = (type: string) => {
    setActiveFilters((prev) =>
      prev.includes(type) ? prev.filter((f) => f !== type) : [...prev, type]
    );
  };

  const syncCodebaseAST = async () => {
    setIsScanning(true);
    try {
      // Phase 3 trigger implementation invoking actual server file scanning endpoints
      const res = await fetch("/api/scan");
      if (res.ok) {
        const data = await res.json();
        if (data.nodes && data.edges) {
          setNodes(data.nodes);
          setEdges(data.edges);
        }
      }
    } catch (err) {
      console.error("Failed to synchronize active workspace codebase AST:", err);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <WorkspaceContext.Provider
      value={{
        traversalDepth,
        setTraversalDepth,
        activeFilters,
        toggleFilter,
        nodes,
        setNodes,
        edges,
        setEdges,
        isScanning,
        syncCodebaseAST,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  }
  return context;
}
