"use client"

interface ConnectionLineProps {
  from: { x: number; y: number }
  to: { x: number; y: number }
}

export function ConnectionLine({ from, to }: ConnectionLineProps) {
  // Calculate control points for a smooth curve
  const midY = (from.y + to.y) / 2
  const controlPoint1 = { x: from.x, y: midY }
  const controlPoint2 = { x: to.x, y: midY }

  const pathData = `M ${from.x} ${from.y} C ${controlPoint1.x} ${controlPoint1.y}, ${controlPoint2.x} ${controlPoint2.y}, ${to.x} ${to.y}`

  return (
    <g>
      <path d={pathData} stroke="#6b7280" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)" />
      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#6b7280" />
        </marker>
      </defs>
    </g>
  )
}
