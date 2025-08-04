"use client"

import { useState, useCallback } from "react"
import { ChatInterface } from "./chat-interface"
import { DesignCanvas } from "./design-canvas"
import { ExportPanel } from "./export-panel"
import { CustomBlockManager } from "./custom-block-manager"
import { AddNodeDialog } from "./add-node-dialog"
import { Button } from "@/components/ui/button"
import { Settings, Download, Plus, PlusCircle } from "lucide-react"
import type { DesignNode, DesignEdge } from "@/types/design"

export function SystemDesignBuilder() {
  const [nodes, setNodes] = useState<DesignNode[]>([])
  const [edges, setEdges] = useState<DesignEdge[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [showExportPanel, setShowExportPanel] = useState(false)
  const [showCustomBlocks, setShowCustomBlocks] = useState(false)
  const [showAddNode, setShowAddNode] = useState(false)

  const updateFlow = useCallback((newNodes: DesignNode[], newEdges: DesignEdge[]) => {
    setNodes(newNodes)
    setEdges(newEdges)
  }, [])

  const clearFlow = useCallback(() => {
    setNodes([])
    setEdges([])
  }, [])

  const updateNodePosition = useCallback((nodeId: string, position: { x: number; y: number }) => {
    setNodes((prev) => prev.map((node) => (node.id === nodeId ? { ...node, position } : node)))
  }, [])

  const addNode = useCallback((nodeData: { label: string; type: string; description?: string; color?: string }) => {
    const newNode: DesignNode = {
      id: `node-${Date.now()}`,
      position: { x: 200, y: 200 }, // Default position, user can drag to desired location
      data: nodeData,
    }
    setNodes((prev) => [...prev, newNode])
  }, [])

  const updateNode = useCallback((nodeId: string, nodeData: Partial<DesignNode['data']>) => {
    setNodes((prev) => prev.map((node) => 
      node.id === nodeId 
        ? { ...node, data: { ...node.data, ...nodeData } }
        : node
    ))
  }, [])

  const deleteNode = useCallback((nodeId: string) => {
    setNodes((prev) => prev.filter((node) => node.id !== nodeId))
    // Also remove any edges connected to this node
    setEdges((prev) => prev.filter((edge) => edge.source !== nodeId && edge.target !== nodeId))
  }, [])

  return (
    <div className="flex h-full">
      {/* Chat Interface */}
      <div className="w-96 border-r bg-white flex flex-col">
        <div className="p-4 border-b">
          <h1 className="text-xl font-semibold">AI System Design Builder</h1>
          <p className="text-sm text-gray-600 mt-1">Describe your system architecture and I&apos;ll build it for you</p>
        </div>
        <ChatInterface
          onUpdateFlow={updateFlow}
          onClearFlow={clearFlow}
          currentNodes={nodes}
          currentEdges={edges}
          isGenerating={isGenerating}
          setIsGenerating={setIsGenerating}
        />
      </div>

      {/* Design Canvas */}
      <div className="flex-1 relative h-full">
        <DesignCanvas
          nodes={nodes}
          edges={edges}
          onNodePositionChange={updateNodePosition}
          onNodeUpdate={updateNode}
          onNodeDelete={deleteNode}
          isGenerating={isGenerating}
        />

        {/* Top Panel */}
        <div className="absolute top-4 right-4 flex gap-2 z-10">
          <Button variant="outline" size="sm" onClick={() => setShowAddNode(true)}>
            <PlusCircle className="w-4 h-4 mr-2" />
            Add Node
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowCustomBlocks(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Custom Blocks
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowExportPanel(true)}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>

        {/* Empty State */}
        {nodes.length === 0 && !isGenerating && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center p-8 bg-white rounded-lg shadow-sm border">
              <Settings className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Start Building Your System</h3>
              <p className="text-gray-600 max-w-sm">
                Describe your system architecture in the chat and I&apos;ll create a visual diagram for you.
              </p>
            </div>
          </div>
        )}

        {/* Export Panel */}
        {showExportPanel && <ExportPanel nodes={nodes} edges={edges} onClose={() => setShowExportPanel(false)} />}

        {/* Add Node Dialog */}
        <AddNodeDialog
          open={showAddNode}
          onClose={() => setShowAddNode(false)}
          onAddNode={addNode}
        />

        {/* Custom Block Manager */}
        {showCustomBlocks && (
          <CustomBlockManager
            onClose={() => setShowCustomBlocks(false)}
            onAddBlock={(block) => {
              addNode({
                label: block.name,
                type: block.id,
                description: block.description,
                color: block.color,
              })
            }}
          />
        )}
      </div>
    </div>
  )
}
