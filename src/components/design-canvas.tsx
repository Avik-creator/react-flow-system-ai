"use client"

import type React from "react"

import { useRef, useEffect, useState, useCallback } from "react"
import { NodeComponent } from "./node-component"
import { ConnectionLine } from "./connection-line"
import type { DesignNode, DesignEdge } from "@/types/design"
import { ZoomIn, ZoomOut, Maximize } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DesignCanvasProps {
  nodes: DesignNode[]
  edges: DesignEdge[]
  onNodePositionChange: (nodeId: string, position: { x: number; y: number }) => void
  isGenerating: boolean
}

export function DesignCanvas({ nodes, edges, onNodePositionChange, isGenerating }: DesignCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? 0.9 : 1.1
    setZoom((prev) => Math.max(0.1, Math.min(3, prev * delta)))
  }, [])

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === canvasRef.current) {
        setIsDragging(true)
        setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
      }
    },
    [pan],
  )

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isDragging) {
        setPan({
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y,
        })
      }
    },
    [isDragging, dragStart],
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const zoomIn = () => setZoom((prev) => Math.min(3, prev * 1.2))
  const zoomOut = () => setZoom((prev) => Math.max(0.1, prev / 1.2))
  const resetView = () => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) {
      canvas.addEventListener("wheel", handleWheel, { passive: false })
      return () => canvas.removeEventListener("wheel", handleWheel)
    }
  }, [handleWheel])

  return (
    <div className="relative w-full h-full overflow-hidden bg-gray-50 min-h-screen">
      {/* Canvas */}
      <div
        ref={canvasRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          className="relative w-full h-full"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: "0 0",
          }}
        >
          {/* Grid Background */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ width: "200%", height: "200%" }}>
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>

          {/* Connections */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ width: "200%", height: "200%" }}>
            {edges.map((edge) => {
              const sourceNode = nodes.find((n) => n.id === edge.source)
              const targetNode = nodes.find((n) => n.id === edge.target)

              if (!sourceNode || !targetNode) return null

              return (
                <ConnectionLine
                  key={edge.id}
                  from={{
                    x: sourceNode.position.x + 60,
                    y: sourceNode.position.y + 80,
                  }}
                  to={{
                    x: targetNode.position.x + 60,
                    y: targetNode.position.y + 40,
                  }}
                />
              )
            })}
          </svg>

          {/* Nodes */}
          {nodes.map((node) => (
            <NodeComponent key={node.id} node={node} onPositionChange={onNodePositionChange} zoom={zoom} />
          ))}

          {/* Loading indicator */}
          {isGenerating && (
            <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg">
              Generating system design...
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2">
        <Button variant="outline" size="sm" onClick={zoomIn}>
          <ZoomIn className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={zoomOut}>
          <ZoomOut className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={resetView}>
          <Maximize className="w-4 h-4" />
        </Button>
      </div>

      {/* Zoom indicator */}
      <div className="absolute bottom-4 left-4 bg-white px-3 py-1 rounded border text-sm">
        {Math.round(zoom * 100)}%
      </div>
    </div>
  )
}
