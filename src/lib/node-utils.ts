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

export function getNodeIcon(type: string) {
  return iconMap[type as keyof typeof iconMap] || Server
}

export function getNodeColor(type: string): string {
  const colorMap: Record<string, string> = {
    server: "bg-blue-500",
    database: "bg-purple-500",
    api: "bg-green-500",
    frontend: "bg-orange-500",
    mobile: "bg-pink-500",
    cloud: "bg-sky-500",
    security: "bg-red-500",
    network: "bg-teal-500",
    storage: "bg-yellow-500",
    payment: "bg-emerald-500",
    notification: "bg-indigo-500",
    search: "bg-violet-500",
    analytics: "bg-rose-500",
    auth: "bg-red-600",
    users: "bg-blue-600",
    chat: "bg-green-600",
    ecommerce: "bg-purple-600",
    email: "bg-orange-600",
    compute: "bg-gray-600",
    web: "bg-cyan-500",
  }

  return colorMap[type] || "bg-gray-500"
}
