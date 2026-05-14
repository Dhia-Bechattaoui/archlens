import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

interface ScannedNode {
  id: string;
  title: string;
  type: "service" | "controller" | "model";
  x: number;
  y: number;
  complexity: number;
  inEdges: string[];
  filePath: string;
  imports: string[];
}

interface Edge {
  source: string;
  target: string;
}

// Recursively walks target directory searching for typescript/javascript module implementations
async function walkDirectory(dir: string, fileList: string[] = []): Promise<string[]> {
  const files = await fs.readdir(dir);

  for (const file of files) {
    // Avoid traversing compiled output, dependency packages, or local hidden cache metrics
    if (file === "node_modules" || file.startsWith(".") || file === "dist") continue;

    const filePath = path.join(dir, file);
    const stat = await fs.stat(filePath);

    if (stat.isDirectory()) {
      await walkDirectory(filePath, fileList);
    } else if (/\.(tsx|ts|jsx|js)$/.test(file)) {
      fileList.push(filePath);
    }
  }

  return fileList;
}

export async function GET() {
  try {
    // Target base resolution points to the live src workspace directory
    const srcDir = path.join(process.cwd(), "src");
    const sourceFiles = await walkDirectory(srcDir);

    const nodes: ScannedNode[] = [];
    const edges: Edge[] = [];

    // Counters to distribute localized vertical stacking per visual logical layer
    let controllerY = 80;
    let serviceY = 80;
    let modelY = 80;

    // 1. Process files into target structural AST nodes
    for (const filePath of sourceFiles) {
      const content = await fs.readFile(filePath, "utf-8");
      const baseName = path.basename(filePath, path.extname(filePath));
      const relPath = path.relative(srcDir, filePath);

      // Derive visual component type classification from semantics
      let type: "service" | "controller" | "model" = "service";
      let x = 450;
      let y = serviceY;

      if (relPath.includes("api/") || baseName.includes("Controller") || baseName.includes("route")) {
        type = "controller";
        x = 80;
        y = controllerY;
        controllerY += 160;
      } else if (relPath.includes("context/") || baseName.includes("Model") || baseName.includes("types")) {
        type = "model";
        x = 850;
        y = modelY;
        modelY += 160;
      } else {
        type = "service";
        // Distribute standard elements cleanly across central workspace arrays
        x = 420 + (nodes.length % 2) * 80;
        y = serviceY;
        serviceY += 160;
      }

      // Compute local AST complexity weights by evaluating logical program branches
      const lines = content.split("\n");
      const complexity = lines.filter(
        (l) => l.includes("if") || l.includes("for") || l.includes("map") || l.includes("return") || l.includes("=>")
      ).length || 5;

      // Extract import token vectors to resolve relative/absolute dependencies
      const imports: string[] = [];
      const importRegex = /import\s+.*?\s+from\s+['"]([^'"]+)['"]/g;
      let match;
      while ((match = importRegex.exec(content)) !== null) {
        imports.push(match[1]);
      }

      nodes.push({
        id: `node-${baseName.toLowerCase()}`,
        title: baseName,
        type,
        x,
        y,
        complexity,
        inEdges: [],
        filePath,
        imports,
      });
    }

    // 2. Resolve caller-callee routing edges by mapping import strings to target Node IDs
    for (const node of nodes) {
      for (const imp of node.imports) {
        // Evaluate if module specifier attempts to load an internal workspace target component
        for (const targetNode of nodes) {
          if (node.id === targetNode.id) continue;

          // Check if import resolves to the target module's title (e.g., "@/components/Header" -> "Header")
          if (imp.includes(targetNode.title)) {
            edges.push({
              source: node.id,
              target: targetNode.id,
            });
            if (!targetNode.inEdges.includes(node.id)) {
              targetNode.inEdges.push(node.id);
            }
          }
        }
      }
    }

    // Strip raw backend absolute/internal paths before sending cleanly optimized serializable graphs
    const sanitizedNodes = nodes.map(({ filePath, imports, ...safeNode }) => safeNode);

    return NextResponse.json({
      nodes: sanitizedNodes,
      edges,
    });
  } catch (error) {
    console.error("Local Codebase Scanner API Error:", error);
    return NextResponse.json(
      { error: "Failed to parse workspace file systems tree." },
      { status: 500 }
    );
  }
}
