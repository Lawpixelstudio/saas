import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  Plus, 
  User, 
  ShieldCheck, 
  RotateCcw, 
  DollarSign, 
  Building2, 
  Code2, 
  CheckCircle2, 
  AlertTriangle,
  ExternalLink,
  ChevronDown,
  Menu,
  Download,
  Smartphone
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Header: React.FC = () => {
  const { 
    setIsSearchOpen, 
    notifications, 
    markNotificationRead, 
    markAllNotificationsRead,
    setIsNewClientModalOpen,
    setIsNewProjectModalOpen,
    setIsRecordPaymentModalOpen,
    setIsNewReviewModalOpen,
    setCurrentModule,
    resetDemoData,
    setIsMobileSidebarOpen,
    isPwaInstallable,
    promptPwaInstall
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-3 sm:px-6 flex items-center justify-between sticky top-0 z-30 select-none shadow-xs">
      {/* Left: Mobile Menu Hamburger & Search */}
      <div className="flex items-center gap-2 flex-1 max-w-xl">
        {/* Mobile Hamburger Toggle Button */}
        <button
          type="button"
          onClick={() => setIsMobileSidebarOpen(true)}
          className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors shrink-0"
          title="Abrir menú principal"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Bar (Salesforce Lightning / Odoo style) */}
        <div className="flex-1 min-w-0">
          <button
            id="global-search-trigger-btn"
            type="button"
            onClick={() => setIsSearchOpen(true)}
            className="w-full flex items-center justify-between px-3 sm:px-3.5 py-2 text-xs text-slate-400 bg-slate-100/80 hover:bg-slate-100 rounded-xl border border-slate-200/80 transition-all group"
          >
            <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
              <Search className="w-4 h-4 text-slate-400 group-hover:text-[#38A5F8] transition-colors shrink-0" />
              <span className="text-slate-500 font-medium truncate text-left">
                <span className="hidden sm:inline">Buscar prospectos, repositorios, proyectos, IPs, RIFs...</span>
                <span className="sm:hidden">Buscar en ERP...</span>
              </span>
            </div>
            <kbd className="hidden md:inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-mono font-semibold text-slate-500 bg-white rounded border border-slate-200 shadow-2xs">
              ⌘K
            </kbd>
          </button>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-1.5 sm:gap-3 ml-2 sm:ml-4">
        {/* Optional PWA Install Quick Button */}
        {isPwaInstallable && (
          <button
            type="button"
            onClick={() => promptPwaInstall()}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold text-[#1d8fe6] bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition-all shadow-2xs"
            title="Instalar Goolo System como App en tu dispositivo"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Instalar App</span>
          </button>
        )}

        {/* Quick Action Button */}
        <div className="relative">
          <button
            id="header-quick-action-btn"
            type="button"
            onClick={() => setShowQuickActions(prev => !prev)}
            className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-2 text-xs font-bold rounded-xl bg-[#38A5F8] text-white hover:bg-[#1d8fe6] transition-all shadow-sm shadow-[#38A5F8]/20"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden md:inline">Acción Rápida</span>
            <ChevronDown className="w-3.5 h-3.5 opacity-80 hidden sm:inline" />
          </button>

          {showQuickActions && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setShowQuickActions(false)} 
              />
              <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl bg-white shadow-xl ring-1 ring-black/5 divide-y divide-slate-100 z-50 p-1.5 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-1.5 text-[10px] font-bold tracking-wider uppercase text-slate-400">
                  Crear Registro
                </div>
                <div className="py-1">
                  <button
                    onClick={() => {
                      setIsNewClientModalOpen(true);
                      setShowQuickActions(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-blue-50 hover:text-[#1d8fe6] rounded-lg transition-colors"
                  >
                    <Building2 className="w-4 h-4 text-[#38A5F8]" />
                    <span>+ Nuevo Cliente</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsNewProjectModalOpen(true);
                      setShowQuickActions(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-blue-50 hover:text-[#1d8fe6] rounded-lg transition-colors"
                  >
                    <Code2 className="w-4 h-4 text-[#38A5F8]" />
                    <span>+ Nuevo Proyecto & Infra</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsRecordPaymentModalOpen(true);
                      setShowQuickActions(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg transition-colors"
                  >
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                    <span>+ Registrar Pago / Cobro</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsNewReviewModalOpen(true);
                      setShowQuickActions(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-purple-50 hover:text-purple-700 rounded-lg transition-colors"
                  >
                    <ShieldCheck className="w-4 h-4 text-purple-600" />
                    <span>+ Programar Auditoría Técnica</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Notifications Dropdown (with Magenta badge) */}
        <div className="relative">
          <button
            id="header-notifications-btn"
            type="button"
            onClick={() => setShowNotifications(prev => !prev)}
            className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
            title="Centro de Alertas y Notificaciones"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#D81159] text-white text-[9px] font-black flex items-center justify-center shadow-xs animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setShowNotifications(false)} 
              />
              <div className="absolute right-0 mt-2 w-72 sm:w-96 origin-top-right rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 divide-y divide-slate-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                <div className="p-3.5 bg-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900">Alertas del Sistema</span>
                    {unreadCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-[#ffe4ee] text-[#D81159] text-[10px] font-bold">
                        {unreadCount} nuevas
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-[11px] font-semibold text-[#1d8fe6] hover:underline"
                    >
                      Marcar todo leído
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 p-1">
                  {notifications.length === 0 ? (
                    <div className="py-6 text-center text-xs text-slate-400">
                      No hay notificaciones activas.
                    </div>
                  ) : (
                    notifications.map(n => {
                      const isMora = n.type === 'mora';
                      const isWarning = n.type === 'ssl_warning' || n.type === 'review_pending';

                      return (
                        <div
                          key={n.id}
                          onClick={() => {
                            markNotificationRead(n.id);
                            if (n.linkModule) setCurrentModule(n.linkModule);
                            setShowNotifications(false);
                          }}
                          className={`p-3 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors ${
                            !n.read ? 'bg-slate-50/70 font-medium' : ''
                          }`}
                        >
                          <div className="flex items-start gap-2.5">
                            <div className="mt-0.5 shrink-0">
                              {isMora ? (
                                <span className="w-2.5 h-2.5 rounded-full bg-[#D81159] block shadow-xs ring-2 ring-[#ffe4ee]"></span>
                              ) : isWarning ? (
                                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 block"></span>
                              ) : (
                                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 block"></span>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-xs ${isMora ? 'text-[#D81159] font-bold' : 'text-slate-900 font-semibold'}`}>
                                {n.title}
                              </p>
                              <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">
                                {n.description}
                              </p>
                              <span className="text-[10px] text-slate-400 mt-1 inline-block">
                                {n.timestamp}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* User Profile / System Menu */}
        <div className="relative pl-1 sm:pl-2 border-l border-slate-200">
          <button
            id="header-user-menu-btn"
            type="button"
            onClick={() => setShowUserMenu(prev => !prev)}
            className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-slate-800 to-slate-700 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              GS
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-bold text-slate-800 leading-tight">Admin Goolo</p>
              <p className="text-[10px] text-slate-400 font-medium">Lead Developer</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden lg:block" />
          </button>

          {showUserMenu && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setShowUserMenu(false)} 
              />
              <div className="absolute right-0 mt-2 w-64 origin-top-right rounded-xl bg-white shadow-xl ring-1 ring-black/5 divide-y divide-slate-100 z-50 p-1.5 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-2">
                  <p className="text-xs font-bold text-slate-900">Goolo System Agency ERP</p>
                  <p className="text-[11px] text-slate-500">kskvzla1@gmail.com</p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-md">
                      Plan Enterprise
                    </span>
                    <span className="px-2 py-0.5 bg-blue-50 text-[#1d8fe6] text-[10px] font-bold rounded-md">
                      PWA Ready
                    </span>
                  </div>
                </div>

                <div className="py-1">
                  {isPwaInstallable && (
                    <button
                      onClick={() => {
                        promptPwaInstall();
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-[#1d8fe6] hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Download className="w-3.5 h-3.5 text-[#1d8fe6]" />
                      <span>Instalar PWA en Dispositivo</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      resetDemoData();
                      setShowUserMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                    <span>Restablecer Datos de Prueba</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
