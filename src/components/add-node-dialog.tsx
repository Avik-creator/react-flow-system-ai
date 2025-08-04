"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "lucide-react"

interface AddNodeDialogProps {
  open: boolean
  onClose: () => void
  onAddNode: (nodeData: { label: string; type: string; description?: string }) => void
}

const nodeTypes = [
  { value: "load-balancer", label: "Load Balancer" },
  { value: "api-server", label: "API Server" },
  { value: "database", label: "Database" },
  { value: "cache", label: "Cache" },
  { value: "cdn", label: "CDN" },
  { value: "message-broker", label: "Message Broker" },
  { value: "web-client", label: "Web Client" },
  { value: "mobile-client", label: "Mobile Client" },
  { value: "microservice", label: "Microservice" },
  { value: "storage", label: "Storage" },
  { value: "queue", label: "Queue" },
  { value: "gateway", label: "Gateway" },
  { value: "auth-service", label: "Auth Service" },
  { value: "monitor", label: "Monitor" },
  { value: "analytics", label: "Analytics" },
  { value: "search", label: "Search Engine" },
  { value: "notification", label: "Notification Service" },
  { value: "file-storage", label: "File Storage" },
  { value: "proxy", label: "Proxy" },
  { value: "firewall", label: "Firewall" },
]

export function AddNodeDialog({ open, onClose, onAddNode }: AddNodeDialogProps) {
  const [nodeData, setNodeData] = useState({
    label: "",
    type: "api-server",
    description: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!nodeData.label.trim()) {
      return
    }

    onAddNode({
      label: nodeData.label,
      type: nodeData.type,
      description: nodeData.description || undefined,
    })

    // Reset form
    setNodeData({
      label: "",
      type: "api-server",
      description: "",
    })

    onClose()
  }

  const handleClose = () => {
    setNodeData({
      label: "",
      type: "api-server", 
      description: "",
    })
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Node</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="node-label">Name</Label>
            <Input
              id="node-label"
              value={nodeData.label}
              onChange={(e) => setNodeData({ ...nodeData, label: e.target.value })}
              placeholder="e.g., User API Server"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="node-type">Type</Label>
            <Select 
              value={nodeData.type} 
              onValueChange={(value) => setNodeData({ ...nodeData, type: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {nodeTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="node-description">Description (Optional)</Label>
            <Textarea
              id="node-description"
              value={nodeData.description}
              onChange={(e) => setNodeData({ ...nodeData, description: e.target.value })}
              placeholder="Brief description of this component..."
              rows={2}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1">
              <Plus className="w-4 h-4 mr-2" />
              Add Node
            </Button>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}