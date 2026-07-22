import Link from "next/link";
import { 
  LayoutDashboard, 
  Search, 
  Database, 
  Activity, 
  FileText, 
  Mail, 
  MessageCircle, 
  KanbanSquare, 
  Calendar,
  BarChart3
} from "lucide-react";

export function Sidebar() {
  const navItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Leads", href: "/leads", icon: Search },
    { name: "Enrichment", href: "/enrichment", icon: Database },
    { name: "Audits", href: "/audit", icon: Activity },
    { name: "Propuestas", href: "/proposals", icon: FileText },
    { name: "Email", href: "/outreach/email", icon: Mail },
    { name: "WhatsApp", href: "/outreach/whatsapp", icon: MessageCircle },
    { name: "CRM", href: "/crm", icon: KanbanSquare },
    { name: "Agenda", href: "/calendar", icon: Calendar },
    { name: "Analytics", href: "/analytics", icon: BarChart3 },
  ];

  return (
    <div className="w-64 h-screen border-r border-border/50 bg-sidebar flex flex-col transition-all duration-300">
      <div className="h-16 flex items-center px-6 border-b border-border/50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-[0_0_15px_rgba(124,58,237,0.5)]">
            <span className="text-white font-bold text-lg">A</span>
          </div>
          <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            ADNQN
          </span>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
        <div className="text-xs font-semibold text-muted-foreground mb-4 px-2 uppercase tracking-wider">
          Platform
        </div>
        {navItems.map((item) => (
          <Link 
            key={item.name} 
            href={item.href}
            className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-secondary/80 transition-colors group"
          >
            <item.icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            {item.name}
          </Link>
        ))}
      </div>
      
      <div className="p-4 border-t border-border/50">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
            <span className="text-xs font-medium">GU</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium">Gustavo</span>
            <span className="text-xs text-muted-foreground">Admin</span>
          </div>
        </div>
      </div>
    </div>
  );
}
