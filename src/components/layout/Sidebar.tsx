
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { PartyPopper, Calendar, Users, Package, MessageCircle, BarChart2, Settings } from 'lucide-react';
import { useFestaContext } from '@/contexts/FestaContext';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { mensagens } = useFestaContext();
  
  // Contagem de mensagens não lidas
  const unreadCount = mensagens.filter(m => !m.lida).length;
  
  // Links da navegação
  const navItems = [
    { 
      path: '/', 
      name: 'Dashboard', 
      icon: <PartyPopper className="h-5 w-5" /> 
    },
    { 
      path: '/calendario', 
      name: 'Calendário', 
      icon: <Calendar className="h-5 w-5" /> 
    },
    { 
      path: '/clientes', 
      name: 'Clientes', 
      icon: <Users className="h-5 w-5" /> 
    },
    { 
      path: '/kits-temas', 
      name: 'Kits & Temas', 
      icon: <Package className="h-5 w-5" /> 
    },
    { 
      path: '/mensagens', 
      name: 'Mensagens', 
      icon: <MessageCircle className="h-5 w-5" />,
      badge: unreadCount > 0 ? unreadCount : undefined
    },
    { 
      path: '/estatisticas', 
      name: 'Estatísticas', 
      icon: <BarChart2 className="h-5 w-5" /> 
    },
    { 
      path: '/configuracoes', 
      name: 'Configurações', 
      icon: <Settings className="h-5 w-5" /> 
    }
  ];
  
  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-sidebar transition-width duration-300 ease-in-out",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="h-full overflow-y-auto px-3 py-4">
        {/* Logo */}
        <div className="mb-8 flex items-center justify-center">
          {collapsed ? (
            <PartyPopper 
              className="h-10 w-10 text-festa-primary animate-float" 
              onClick={() => setCollapsed(false)}
            />
          ) : (
            <div className="flex items-center space-x-2">
              <PartyPopper className="h-10 w-10 text-festa-primary animate-float" />
              <h1 className="text-2xl font-bold festa-gradient-text">Festa</h1>
            </div>
          )}
        </div>
        
        {/* Navigation */}
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={cn(
                  "flex items-center rounded-lg p-2 hover:bg-sidebar-accent",
                  location.pathname === item.path 
                    ? "bg-sidebar-accent font-medium text-festa-primary" 
                    : "text-sidebar-foreground"
                )}
              >
                <div className="relative">
                  {item.icon}
                  {item.badge && (
                    <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-festa-secondary text-xs text-white">
                      {item.badge}
                    </span>
                  )}
                </div>
                {!collapsed && <span className="ml-3">{item.name}</span>}
              </Link>
            </li>
          ))}
        </ul>
        
        {/* Toggle button */}
        <div 
          className="absolute bottom-4 right-4 cursor-pointer rounded-full bg-sidebar-accent p-2 hover:bg-sidebar-accent/80"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
