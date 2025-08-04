"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"
import type { CustomBlock } from "@/types/design"

interface CustomBlockManagerProps {
  onClose: () => void
  onAddBlock: (block: CustomBlock) => void
}

const colorOptions = [
  { value: "bg-blue-500", label: "Blue" },
  { value: "bg-green-500", label: "Green" },
  { value: "bg-purple-500", label: "Purple" },
  { value: "bg-red-500", label: "Red" },
  { value: "bg-yellow-500", label: "Yellow" },
  { value: "bg-indigo-500", label: "Indigo" },
  { value: "bg-pink-500", label: "Pink" },
  { value: "bg-gray-500", label: "Gray" },
]

const iconOptions = [
  { value: "server", label: "Server" },
  { value: "database", label: "Database" },
  { value: "cloud", label: "Cloud" },
  { value: "api", label: "API" },
  { value: "security", label: "Security" },
  { value: "network", label: "Network" },
  { value: "storage", label: "Storage" },
  { value: "compute", label: "Compute" },
]

export function CustomBlockManager({ onClose, onAddBlock }: CustomBlockManagerProps) {
  const [customBlocks, setCustomBlocks] = useState<CustomBlock[]>([])
  const [newBlock, setNewBlock] = useState({
    name: "",
    description: "",
    icon: "server",
    color: "bg-blue-500",
  })

  const handleAddBlock = () => {
    if (!newBlock.name.trim()) {
      toast.error("Name required")
      return
    }

    const block: CustomBlock = {
      id: `custom-${Date.now()}`,
      ...newBlock,
    }

    setCustomBlocks([...customBlocks, block])
    onAddBlock(block)

    setNewBlock({
      name: "",
      description: "",
      icon: "server",
      color: "bg-blue-500",
    })

    toast.success(`${block.name} has been added to your custom blocks.`)
  }

  const handleDeleteBlock = (id: string) => {
    setCustomBlocks(customBlocks.filter((block) => block.id !== id))
    toast.success("Custom block has been removed.")
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Custom Block Manager</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-4 p-4 border rounded-lg">
            <h3 className="text-lg font-medium">Create New Block</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="block-name">Name</Label>
                <Input
                  id="block-name"
                  value={newBlock.name}
                  onChange={(e) => setNewBlock({ ...newBlock, name: e.target.value })}
                  placeholder="e.g., Message Queue"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="block-icon">Icon</Label>
                <Select value={newBlock.icon} onValueChange={(value) => setNewBlock({ ...newBlock, icon: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {iconOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="block-description">Description</Label>
              <Textarea
                id="block-description"
                value={newBlock.description}
                onChange={(e) => setNewBlock({ ...newBlock, description: e.target.value })}
                placeholder="Brief description of this component..."
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="block-color">Color</Label>
              <Select value={newBlock.color} onValueChange={(value) => setNewBlock({ ...newBlock, color: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {colorOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded ${option.value}`} />
                        {option.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleAddBlock} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add Custom Block
            </Button>
          </div>

          {customBlocks.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Your Custom Blocks</h3>

              <div className="grid gap-3">
                {customBlocks.map((block) => (
                  <div key={block.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded ${block.color} text-white`}>
                        <div className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-medium">{block.name}</div>
                        {block.description && <div className="text-sm text-gray-500">{block.description}</div>}
                      </div>
                    </div>

                    <Button variant="outline" size="sm" onClick={() => handleDeleteBlock(block.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
