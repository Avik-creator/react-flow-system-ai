"use client"

import { useState } from "react"
import type { DesignNode, DesignEdge } from "@/types/design"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Download, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface ExportPanelProps {
  nodes: DesignNode[]
  edges: DesignEdge[]
  onClose: () => void
}

export function ExportPanel({ nodes, edges, onClose }: ExportPanelProps) {
  const [format, setFormat] = useState<"png" | "jpeg" | "svg">("png")
  const [filename, setFilename] = useState("system-design")
  const [isExporting, setIsExporting] = useState(false)

  const downloadImage = async () => {
    if (nodes.length === 0) {
      toast.error("No content to export")
      return
    }

    setIsExporting(true)

    try {
      // Create SVG content
      const svgContent = generateSVG(nodes, edges)

      if (format === "svg") {
        const blob = new Blob([svgContent], { type: "image/svg+xml" })
        const link = document.createElement("a")
        link.download = `${filename}.svg`
        link.href = URL.createObjectURL(blob)
        link.click()
      } else {
        // Convert SVG to canvas for PNG/JPEG export
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")
        const img = new Image()

        img.onload = () => {
          canvas.width = img.width
          canvas.height = img.height
          ctx?.drawImage(img, 0, 0)

          const mimeType = format === "png" ? "image/png" : "image/jpeg"
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const link = document.createElement("a")
                link.download = `${filename}.${format}`
                link.href = URL.createObjectURL(blob)
                link.click()
              }
            },
            mimeType,
            0.95,
          )
        }

        const svgBlob = new Blob([svgContent], { type: "image/svg+xml" })
        img.src = URL.createObjectURL(svgBlob)
      }

      toast.success(`Your system design has been exported as ${filename}.${format}`)

      onClose()
    } catch (error) {
      console.error("Export failed:", error)
      toast.error("There was an error exporting your design. Please try again.")
    } finally {
      setIsExporting(false)
    }
  }

  const exportAsJSON = () => {
    const data = {
      nodes,
      edges,
      metadata: {
        exportedAt: new Date().toISOString(),
        version: "1.0",
      },
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    })

    const link = document.createElement("a")
    link.download = `${filename}.json`
    link.href = URL.createObjectURL(blob)
    link.click()

    toast.success(`Your system design data has been exported as ${filename}.json`)
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Export System Design</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="filename">Filename</Label>
            <Input
              id="filename"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              placeholder="system-design"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="format">Format</Label>
            <Select value={format} onValueChange={(value: "png" | "jpeg" | "svg") => setFormat(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="png">PNG Image</SelectItem>
                <SelectItem value="jpeg">JPEG Image</SelectItem>
                <SelectItem value="svg">SVG Vector</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={downloadImage} disabled={isExporting || nodes.length === 0} className="flex-1">
              {isExporting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Download className="w-4 h-4 mr-2" />}
              Export Image
            </Button>

            <Button variant="outline" onClick={exportAsJSON} disabled={nodes.length === 0}>
              Export JSON
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function generateSVG(nodes: DesignNode[], edges: DesignEdge[]): string {
  const width = 1200
  const height = 800

  let svgContent = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="white"/>
    <defs>
      <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
        <polygon points="0 0, 10 3.5, 0 7" fill="#6b7280"/>
      </marker>
    </defs>`

  // Add connections
  edges.forEach((edge) => {
    const sourceNode = nodes.find((n) => n.id === edge.source)
    const targetNode = nodes.find((n) => n.id === edge.target)

    if (sourceNode && targetNode) {
      const from = { x: sourceNode.position.x + 60, y: sourceNode.position.y + 80 }
      const to = { x: targetNode.position.x + 60, y: targetNode.position.y + 40 }
      const midY = (from.y + to.y) / 2

      svgContent += `<path d="M ${from.x} ${from.y} C ${from.x} ${midY}, ${to.x} ${midY}, ${to.x} ${to.y}"
        stroke="#6b7280" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)"/>`
    }
  })

  // Add nodes
  nodes.forEach((node) => {
    svgContent += `
      <g transform="translate(${node.position.x}, ${node.position.y})">
        <rect width="120" height="80" rx="8" fill="white" stroke="#e5e7eb" strokeWidth="2"/>
        <rect x="35" y="10" width="50" height="30" rx="6" fill="#3b82f6"/>
        <text x="60" y="55" textAnchor="middle" fontFamily="Arial" fontSize="12" fontWeight="bold">${node.data.label}</text>
        ${node.data.description ? `<text x="60" y="70" textAnchor="middle" fontFamily="Arial" fontSize="10" fill="#6b7280">${node.data.description}</text>` : ""}
      </g>`
  })

  svgContent += "</svg>"
  return svgContent
}
