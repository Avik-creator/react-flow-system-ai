"use client"

import type React from "react"

import { useState, useCallback } from "react"
import type { DesignNode } from "@/types/design"
import { getNodeIcon, getNodeColor } from "@/lib/node-utils"

interface NodeComponentProps {
  node: DesignNode
  onPositionChange: (nodeId: string, position: { x: number; y: number }) => void
  zoom: number
}

export function NodeComponent({ node, onPositionChange, zoom }: NodeComponentProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, nodeX: 0, nodeY: 0 })

  const Icon = getNodeIcon(node.data.type)
  const bgColor = getNodeColor(node.data.type)

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      setIsDragging(true)
      setDragStart({
        x: e.clientX,
        y: e.clientY,
        nodeX: node.position.x,
        nodeY: node.position.y,
      })
    },
    [node.position],
  )

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isDragging) {
        const deltaX = (e.clientX - dragStart.x) / zoom
        const deltaY = (e.clientY - dragStart.y) / zoom

        onPositionChange(node.id, {
          x: dragStart.nodeX + deltaX,
          y: dragStart.nodeY + deltaY,
        })
      }
    },
    [isDragging, dragStart, zoom, node.id, onPositionChange],
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  return (
    <div
      className={`absolute cursor-move select-none transition-shadow hover:shadow-lg ${isDragging ? "shadow-xl" : ""}`}
      style={{
        left: node.position.x,
        top: node.position.y,
        transform: isDragging ? "scale(1.05)" : "scale(1)",
        transition: isDragging ? "none" : "transform 0.2s ease",
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className="px-4 py-3 shadow-lg rounded-lg border-2 border-gray-200 bg-white min-w-[120px] hover:border-blue-300">
        <div className="flex flex-col items-center text-center">
          <div className={`p-2 rounded-lg ${bgColor} text-white mb-2`}>
            <Icon className="w-6 h-6" />
          </div>
          <div className="text-sm font-medium text-gray-900">{node.data.label}</div>
          {node.data.description && (
            <div className="text-xs text-gray-500 mt-1 max-w-[100px] truncate">{node.data.description}</div>
          )}
        </div>
      </div>
    </div>
  )
}
