"use client"

import { Handle, Position, type NodeProps } from "reactflow"
import {
  Server,
  Database,
  Cloud,
  Smartphone,
  Globe,
  Shield,
  Zap,
  Users,
  MessageSquare,
  ShoppingCart,
  CreditCard,
  Mail,
  Bell,
  Search,
  BarChart3,
  Lock,
  Wifi,
  HardDrive,
  Cpu,
  Monitor,
} from "lucide-react"

const iconMap = {
  server: Server,
  database: Database,
  cloud: Cloud,
  mobile: Smartphone,
  web: Globe,
  security: Shield,
  api: Zap,
  users: Users,
  chat: MessageSquare,
  ecommerce: ShoppingCart,
  payment: CreditCard,
  email: Mail,
  notification: Bell,
  search: Search,
  analytics: BarChart3,
  auth: Lock,
  network: Wifi,
  storage: HardDrive,
  compute: Cpu,
  frontend: Monitor,
}

interface CustomNodeData {
  label: string
  type: keyof typeof iconMap
  description?: string
  color?: string
}

function CustomNode({ data, selected }: NodeProps<CustomNodeData>) {
  const Icon = iconMap[data.type] || Server
  const bgColor = data.color || "bg-blue-500"

  return (
    <div
      className={`px-4 py-3 shadow-lg rounded-lg border-2 ${selected ? "border-blue-500" : "border-gray-200"
        } bg-white min-w-[120px]`}
    >
      <Handle type="target" position={Position.Top} className="w-3 h-3" />

      <div className="flex flex-col items-center text-center">
        <div className={`p-2 rounded-lg ${bgColor} text-white mb-2`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="text-sm font-medium text-gray-900">{data.label}</div>
        {data.description && <div className="text-xs text-gray-500 mt-1">{data.description}</div>}
      </div>

      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  )
}

function LoadBalancerNode({ data, selected }: NodeProps<CustomNodeData>) {
  return (
    <div
      className={`px-4 py-3 shadow-lg rounded-lg border-2 ${selected ? "border-green-500" : "border-gray-200"
        } bg-white min-w-[140px]`}
    >
      <Handle type="target" position={Position.Top} className="w-3 h-3" />

      <div className="flex flex-col items-center text-center">
        <div className="p-2 rounded-lg bg-green-500 text-white mb-2">
          <Wifi className="w-6 h-6" />
        </div>
        <div className="text-sm font-medium text-gray-900">{data.label}</div>
        <div className="text-xs text-gray-500 mt-1">Load Balancer</div>
      </div>

      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
      <Handle type="source" position={Position.Left} className="w-3 h-3" />
      <Handle type="source" position={Position.Right} className="w-3 h-3" />
    </div>
  )
}

function DatabaseClusterNode({ data, selected }: NodeProps<CustomNodeData>) {
  return (
    <div
      className={`px-4 py-3 shadow-lg rounded-lg border-2 ${selected ? "border-purple-500" : "border-gray-200"
        } bg-white min-w-[140px]`}
    >
      <Handle type="target" position={Position.Top} className="w-3 h-3" />

      <div className="flex flex-col items-center text-center">
        <div className="flex gap-1 mb-2">
          <div className="p-1 rounded bg-purple-500 text-white">
            <Database className="w-4 h-4" />
          </div>
          <div className="p-1 rounded bg-purple-500 text-white">
            <Database className="w-4 h-4" />
          </div>
          <div className="p-1 rounded bg-purple-500 text-white">
            <Database className="w-4 h-4" />
          </div>
        </div>
        <div className="text-sm font-medium text-gray-900">{data.label}</div>
        <div className="text-xs text-gray-500 mt-1">Database Cluster</div>
      </div>

      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  )
}

export const CustomNodeTypes = {
  custom: CustomNode,
  loadBalancer: LoadBalancerNode,
  databaseCluster: DatabaseClusterNode,
}
