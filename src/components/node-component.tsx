"use client"

import type React from "react"

import { useState, useCallback, useEffect } from "react"
import type { DesignNode } from "@/types/design"
import { getNodeIcon, getNodeColor } from "@/lib/node-utils"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Edit2, Trash2 } from "lucide-react"

interface NodeComponentProps {
  node: DesignNode
  onPositionChange: (nodeId: string, position: { x: number; y: number }) => void
  onUpdate: (nodeId: string, nodeData: Partial<DesignNode['data']>) => void
  onDelete: (nodeId: string) => void
  zoom: number
}

export function NodeComponent({ node, onPositionChange, onUpdate, onDelete, zoom }: NodeComponentProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, nodeX: 0, nodeY: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)

  const Icon = getNodeIcon(node.data.type)
  const bgColor = getNodeColor(node.data.type)

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      // Don't start dragging if clicking on buttons
      const target = e.target as HTMLElement
      if (target.closest('button')) {
        return
      }
      
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

  const handleEdit = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    setShowEditDialog(true)
  }, [])

  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    onDelete(node.id)
  }, [node.id, onDelete])

  const [editData, setEditData] = useState({
    label: node.data.label,
    description: node.data.description || '',
  })

  // Update editData when node changes
  useEffect(() => {
    setEditData({
      label: node.data.label,
      description: node.data.description || '',
    })
  }, [node.data.label, node.data.description])

  const handleEditSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    onUpdate(node.id, {
      label: editData.label,
      description: editData.description || undefined,
    })
    setShowEditDialog(false)
  }, [editData, node.id, onUpdate])

  const handleEditClose = useCallback(() => {
    // Reset edit data to current node state when closing
    setEditData({
      label: node.data.label,
      description: node.data.description || '',
    })
    setShowEditDialog(false)
  }, [node.data.label, node.data.description])

  return (
    <>
      <Dialog open={showEditDialog} onOpenChange={handleEditClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Node</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-label">Name</Label>
              <Input
                id="edit-label"
                value={editData.label}
                onChange={(e) => setEditData({ ...editData, label: e.target.value })}
                placeholder="Node name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={editData.description}
                onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                placeholder="Node description..."
                rows={2}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" className="flex-1">
                Save Changes
              </Button>
              <Button type="button" variant="outline" onClick={handleEditClose}>
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

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
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false)
        handleMouseUp()
      }}
    >
      <div className="relative px-4 py-3 shadow-lg rounded-lg border-2 border-gray-200 bg-white min-w-[120px] hover:border-blue-300">
        {/* Action buttons - visible on hover */}
        {isHovered && !isDragging && (
          <div className="absolute -top-2 -right-2 flex gap-1 z-10">
            <Button
              size="sm"
              variant="outline"
              className="h-6 w-6 p-0 bg-white border border-gray-300 hover:bg-blue-50 shadow-md"
              onClick={handleEdit}
              onMouseDown={(e) => e.stopPropagation()}
            >
              <Edit2 className="w-3 h-3" />
            </Button>
            <Button  
              size="sm"
              variant="outline"
              className="h-6 w-6 p-0 bg-white border border-gray-300 hover:bg-red-50 shadow-md"
              onClick={handleDelete}
              onMouseDown={(e) => e.stopPropagation()}
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        )}
        
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
    </>
  )
}
