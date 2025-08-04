export interface DesignNode {
  id: string
  position: { x: number; y: number }
  data: {
    label: string
    type: string
    description?: string
    color?: string
  }
}

export interface DesignEdge {
  id: string
  source: string
  target: string
}

export interface CustomBlock {
  id: string
  name: string
  description: string
  icon: string
  color: string
}
