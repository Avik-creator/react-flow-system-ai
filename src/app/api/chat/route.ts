import { google } from "@ai-sdk/google"
import { streamObject } from "ai"
import { systemDesignSchema } from "@/lib/schema"

export async function POST(req: Request) {
  const { prompt, systemContext, currentNodes, currentEdges } = await req.json()

  const systemPrompt = `You are an expert system architect and designer. Your job is to help users create system architecture diagrams by describing the components and their relationships.

Current system context: ${systemContext || "Starting with empty system"}

User request: ${prompt}

Based on the user's request, generate a complete system architecture with:
1. All necessary components with clear names and types
2. All connections between components
3. Use specific technical terms for component types (e.g., "load-balancer", "database", "api-server", "cache", "cdn", "message-broker", "web-client", "mobile-client")

Make sure to include all components mentioned in the user's description and their interconnections.`

  const result = streamObject({
    model: google("gemini-2.5-flash"),
    schema: systemDesignSchema,
    prompt: systemPrompt,
  })

  return result.toTextStreamResponse()
}