import { z } from 'zod'

export const systemDesignSchema = z.object({
  components: z.array(
    z.object({
      name: z.string().describe('Name of the component (e.g., "Load Balancer", "Database")'),
      type: z.string().describe('Type of component (e.g., "load-balancer", "database", "api-server")'),
      description: z.string().describe('Brief description of what this component does'),
    })
  ).describe('List of system components'),
  connections: z.array(
    z.object({
      from: z.string().describe('Source component name'),
      to: z.string().describe('Target component name'),
      description: z.string().optional().describe('Optional description of the connection'),
    })
  ).describe('List of connections between components')
})