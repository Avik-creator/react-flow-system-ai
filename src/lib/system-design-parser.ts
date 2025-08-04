import type { DesignNode, DesignEdge } from "@/types/design"

interface ParsedComponent {
  name: string
  type: string
  description?: string
  position?: { x: number; y: number }
  connections?: string[]
}

export function parseSystemDesign(
  aiResponse: string,
  currentNodes: DesignNode[],
  currentEdges: DesignEdge[],
): { nodes: DesignNode[]; edges: DesignEdge[] } {
  const lines = aiResponse.split("\n").filter((line) => line.trim())

  const components: ParsedComponent[] = []
  const connections: Array<{ from: string; to: string }> = []

  // Look for component definitions
  lines.forEach((line) => {
    const componentMatch = line.match(
      /(?:create|add|include)\s+(?:a\s+)?(\w+(?:\s+\w+)*?)(?:\s+(?:called|named)\s+(.+?))?(?:\s+that|\s+to|\s+for|$)/i,
    )
    if (componentMatch) {
      const type = componentMatch[1].toLowerCase()
      const name = componentMatch[2] || componentMatch[1]

      components.push({
        name: name.replace(/['"]/g, ""),
        type: mapToNodeType(type),
        description: extractDescription(line),
      })
    }

    // Look for connections
    const connectionMatch = line.match(
      /(\w+(?:\s+\w+)*?)\s+(?:connects?\s+to|talks?\s+to|sends?\s+to|communicates?\s+with)\s+(\w+(?:\s+\w+)*)/i,
    )
    if (connectionMatch) {
      connections.push({
        from: connectionMatch[1].trim(),
        to: connectionMatch[2].trim(),
      })
    }
  })

  // Generate nodes
  const nodes: DesignNode[] = components.map((component, index) => {
    const existingNode = currentNodes.find((n) => n.data.label.toLowerCase() === component.name.toLowerCase())

    return {
      id: existingNode?.id || `node-${Date.now()}-${index}`,
      position: existingNode?.position || {
        x: (index % 4) * 200 + 100,
        y: Math.floor(index / 4) * 150 + 100,
      },
      data: {
        label: component.name,
        type: component.type,
        description: component.description,
      },
    }
  })

  // Generate edges
  const edges: DesignEdge[] = connections
    .map((connection, index) => {
      const sourceNode = nodes.find((n) => n.data.label.toLowerCase().includes(connection.from.toLowerCase()))
      const targetNode = nodes.find((n) => n.data.label.toLowerCase().includes(connection.to.toLowerCase()))

      if (sourceNode && targetNode) {
        return {
          id: `edge-${Date.now()}-${index}`,
          source: sourceNode.id,
          target: targetNode.id,
        }
      }
      return null
    })
    .filter(Boolean) as DesignEdge[]

  // Merge with existing nodes/edges if this is an update
  const mergedNodes = [...currentNodes]
  const mergedEdges = [...currentEdges]

  nodes.forEach((newNode) => {
    const existingIndex = mergedNodes.findIndex((n) => n.id === newNode.id)
    if (existingIndex >= 0) {
      mergedNodes[existingIndex] = newNode
    } else {
      mergedNodes.push(newNode)
    }
  })

  edges.forEach((newEdge) => {
    const exists = mergedEdges.some((e) => e.source === newEdge.source && e.target === newEdge.target)
    if (!exists) {
      mergedEdges.push(newEdge)
    }
  })

  return { nodes: mergedNodes, edges: mergedEdges }
}

function mapToNodeType(type: string): string {
  const typeMap: Record<string, string> = {
    "web server": "server",
    "api server": "api",
    database: "database",
    "load balancer": "network",
    cache: "storage",
    frontend: "frontend",
    "mobile app": "mobile",
    microservice: "api",
    service: "api",
    queue: "storage",
    cdn: "cloud",
    auth: "security",
    payment: "payment",
    notification: "notification",
    search: "search",
    analytics: "analytics",
  }

  for (const [key, value] of Object.entries(typeMap)) {
    if (type.includes(key)) {
      return value
    }
  }

  return "server" // default
}

function extractDescription(line: string): string | undefined {
  const descMatch = line.match(/(?:that|to|for)\s+(.+?)(?:\.|$)/i)
  return descMatch ? descMatch[1].trim() : undefined
}
