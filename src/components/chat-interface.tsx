"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { experimental_useObject as useObject } from "@ai-sdk/react"
import type { DesignNode, DesignEdge } from "@/types/design"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Loader2, Trash2 } from "lucide-react"
import { systemDesignSchema } from "@/lib/schema"

interface ChatInterfaceProps {
  onUpdateFlow: (nodes: DesignNode[], edges: DesignEdge[]) => void
  onClearFlow: () => void
  currentNodes: DesignNode[]
  currentEdges: DesignEdge[]
  isGenerating: boolean
  setIsGenerating: (generating: boolean) => void
}

export function ChatInterface({
  onUpdateFlow,
  onClearFlow,
  currentNodes,
  currentEdges,
  isGenerating,
  setIsGenerating,
}: ChatInterfaceProps) {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Array<{ id: string; role: 'user' | 'assistant'; content: string }>>([])
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const { object, submit, isLoading, error } = useObject({
    api: "/api/chat",
    schema: systemDesignSchema,
    onFinish: ({ object }) => {
      setIsGenerating(false)
      if (object) {
        console.log("Generated object:", object)
        try {
          // Convert the structured object to nodes and edges
          const nodes: DesignNode[] = object.components.map((component, index) => ({
            id: `node-${Date.now()}-${index}`,
            position: {
              x: (index % 4) * 200 + 100,
              y: Math.floor(index / 4) * 150 + 100,
            },
            data: {
              label: component.name,
              type: component.type,
              description: component.description,
            },
          }))

          const edges: DesignEdge[] = object.connections
            .map((connection, index) => {
              const sourceNode = nodes.find(n => n.data.label.toLowerCase().includes(connection.from.toLowerCase()))
              const targetNode = nodes.find(n => n.data.label.toLowerCase().includes(connection.to.toLowerCase()))

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

          onUpdateFlow(nodes, edges)
          
          // Add success message with system description
          setMessages(prev => [...prev, {
            id: Date.now().toString(),
            role: 'assistant' as const,
            content: object.description || 'Design generated successfully!'
          }])
        } catch (error) {
          console.error("Error processing system design:", error)
          setMessages(prev => [...prev, {
            id: Date.now().toString(),
            role: 'assistant' as const,
            content: `Error generating design: ${error instanceof Error ? error.message : 'Unknown error'}`
          }])
        }
      }
    },
    onError: (error) => {
      setIsGenerating(false)
      console.error("API Error:", error)
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant' as const,
        content: 'An error occurred while generating the design.'
      }])
    }
  })

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const systemContext =
      currentNodes.length > 0
        ? `Current system has ${currentNodes.length} components: ${currentNodes.map((n) => n.data.label).join(", ")}`
        : "Starting with empty system"

    // Add user message to chat
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: 'user' as const,
      content: input
    }])

    setIsGenerating(true)
    
    // Submit to useObject
    submit({
      prompt: input,
      systemContext,
      currentNodes: JSON.stringify(currentNodes),
      currentEdges: JSON.stringify(currentEdges),
    })
    
    setInput("")
  }

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              <p className="mb-4">👋 Hi! I'm your AI system design assistant.</p>
              <p className="text-sm">
                Describe the system you want to build and I'll create a visual architecture diagram for you.
              </p>
              <div className="mt-4 text-xs space-y-1">
                <p>Try: "Design a microservices e-commerce system"</p>
                <p>Or: "Create a real-time chat application architecture"</p>
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                  message.role === "user" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-900"
                }`}
              >
                {message.role === "user" ? (
                  message.content
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm">{message.content}</span>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isGenerating && (
            <div className="flex justify-start">
              <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 text-sm flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                <span className="text-blue-800">Generating your system design...</span>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t">
        <form onSubmit={handleFormSubmit} className="space-y-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe your system architecture..."
            className="min-h-[80px] resize-none"
            disabled={isLoading}
          />
          <div className="flex gap-2">
            <Button type="submit" disabled={!input.trim() || isLoading} className="flex-1">
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
              Send
            </Button>
            <Button type="button" variant="outline" onClick={onClearFlow} disabled={currentNodes.length === 0}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
