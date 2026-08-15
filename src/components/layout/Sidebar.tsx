import React from 'react';
import { 
  LayoutDashboard, 
  Building2, 
  Code2, 
  DollarSign, 
  Wrench, 
  FileText, 
  ChevronRight,
  Layers,
  Sparkles,
  ExternalLink,
  X,
  Download,
  Smartphone
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { NavigationModule } from '../../types';

export const Sidebar: React.FC = () => {
  const { 
    currentModule, 
    setCurrentModule, 
    inMoraCount, 
    pendingReviewsCount,
    clients,
    projects,
    setSelectedClientId,
    setSelectedProjectId,
    isMobileSidebarOpen,
    setIsMobileSidebarOpen,
    isPwaInstallable,
    promptPwaInstall
  } = useApp();

  const navItems: Array<{
    id: NavigationModule;
    label: string;
    icon: React.ReactNode;
    badgeCount?: number;
    badgeVariant?: 'magenta' | 'blue' | 'slate';
  }> = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      id: 'clients',
      label: 'Clientes',
      icon: <Building2 className="w-4 h-4" />,
      badgeCount: clients.length,
      badgeVariant: 'slate'
    },
    {
      id: 'projects',
      label: 'Proyectos e Infra',
      icon: <Code2 className="w-4 h-4" />,
      badgeCount: projects.length,
      badgeVariant: 'blue'
    },
    {
      id: 'finance',
      label: 'Finanzas y Cobros',
      icon: <DollarSign className="w-4 h-4" />,
      badgeCount: inMoraCount > 0 ? inMoraCount : undefined,
      badgeVariant: 'magenta' // Magenta for Mora alert
    },
    {
      id: 'maintenance',
      label: 'Mantenimiento & Rev.',
      icon: <Wrench className="w-4 h-4" />,
      badgeCount: pendingReviewsCount > 0 ? pendingReviewsCount : undefined,
      badgeVariant: 'magenta' // Magenta for pending technical audits
    },
    {
      id: 'documentation',
      label: 'Notas & Documentación',
      icon: <FileText className="w-4 h-4" />,
    },
  ];

  const handleNavClick = (moduleId: NavigationModule) => {
    setCurrentModule(moduleId);
    if (moduleId === 'clients') setSelectedClientId(null);
    if (moduleId === 'projects') setSelectedProjectId(null);
    setIsMobileSidebarOpen(false);
  };

  const sidebarContent = (
    <div className="w-64 sm:w-72 lg:w-64 bg-white border-r border-slate-200 flex flex-col h-full select-none">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#1d8fe6] to-[#38A5F8] flex items-center justify-center text-white shadow-md shadow-[#38A5F8]/20 ring-2 ring-[#38A5F8]/20">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight text-slate-900">GOOLO</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 bg-[#38A5F8]/10 text-[#1d8fe6] rounded-md uppercase tracking-wider">
                SYSTEM
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium leading-none mt-0.5">
              Web Agency ERP & Infra
            </p>
          </div>
        </div>

        {/* Close Button on Mobile */}
        <button
          type="button"
          onClick={() => setIsMobileSidebarOpen(false)}
          className="lg:hidden p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          title="Cerrar menú"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Navigation (Odoo style vertical items) */}
      <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold tracking-wider uppercase text-slate-400">
          Módulos Principales
        </div>

        {navItems.map(item => {
          const isActive = currentModule === item.id;
          return (
            <button
              key={item.id}
              id={`nav-item-${item.id}`}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 group ${
                isActive
                  ? 'bg-[#38A5F8] text-white shadow-md shadow-[#38A5F8]/25'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`shrink-0 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-[#38A5F8] transition-colors'}`}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>

              <div className="flex items-center gap-1.5">
                {item.badgeCount !== undefined && item.badgeCount > 0 && (
                  <span
                    className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full transition-colors ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : item.badgeVariant === 'magenta'
                        ? 'bg-[#ffe4ee] text-[#D81159] font-black'
                        : item.badgeVariant === 'blue'
                        ? 'bg-blue-50 text-[#1d8fe6]'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {item.badgeCount}
                  </span>
                )}
                <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isActive ? 'text-white opacity-80' : 'text-slate-300 group-hover:translate-x-0.5 group-hover:text-slate-500'}`} />
              </div>
            </button>
          );
        })}

        {/* PWA Direct Installation Prompt Banner */}
        {isPwaInstallable && (
          <div className="pt-3">
            <button
              type="button"
              onClick={() => promptPwaInstall()}
              className="w-full p-3 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border border-blue-200/80 rounded-2xl flex items-center gap-2.5 text-left transition-all group"
            >
              <div className="w-8 h-8 rounded-xl bg-[#1d8fe6] text-white flex items-center justify-center shrink-0 shadow-xs">
                <Download className="w-4 h-4 group-hover:scale-110 transition-transform" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-bold text-slate-900 flex items-center gap-1">
                  <span>Instalar PWA</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                </p>
                <p className="text-[10px] text-slate-500 line-clamp-1">App nativa en tu móvil o PC</p>
              </div>
            </button>
          </div>
        )}
      </div>

      {/* Agency Status Card (Odoo / Salesforce hybrid) */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/50">
        <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Infraestructura Activa
            </span>
            <span className="text-[10px] font-semibold text-[#1d8fe6] bg-blue-50 px-1.5 py-0.5 rounded">
              v2.6 Prod
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1.5 mt-2.5 pt-2.5 border-t border-slate-100 text-center">
            <div>
              <p className="text-[10px] text-slate-400">GitHub</p>
              <p className="text-xs font-bold text-slate-800">100%</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-400">Cloudflare</p>
              <p className="text-xs font-bold text-slate-800">SSL OK</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-400">Supabase</p>
              <p className="text-xs font-bold text-emerald-600">Healthy</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 h-screen sticky top-0 z-20">
        {sidebarContent}
      </aside>

      {/* Mobile Slide-Over Drawer with Backdrop */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop overlay */}
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200" 
            onClick={() => setIsMobileSidebarOpen(false)}
          />
          {/* Drawer Panel */}
          <div className="relative z-10 h-full max-w-[85vw] shadow-2xl animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};

