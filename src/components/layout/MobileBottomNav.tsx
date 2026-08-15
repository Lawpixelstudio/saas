import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Building2, 
  Code2, 
  DollarSign, 
  Menu,
  Plus,
  Wrench,
  FileText,
  X,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Download
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { NavigationModule } from '../../types';

export const MobileBottomNav: React.FC = () => {
  const { 
    currentModule, 
    setCurrentModule, 
    setSelectedClientId, 
    setSelectedProjectId,
    inMoraCount,
    pendingReviewsCount,
    clients,
    projects,
    setIsMobileSidebarOpen,
    setIsNewClientModalOpen,
    setIsNewProjectModalOpen,
    setIsRecordPaymentModalOpen,
    setIsNewReviewModalOpen,
    isPwaInstallable,
    promptPwaInstall
  } = useApp();

  const [isQuickMenuOpen, setIsQuickMenuOpen] = useState(false);

  const handleNavClick = (mod: NavigationModule) => {
    setCurrentModule(mod);
    if (mod === 'clients') setSelectedClientId(null);
    if (mod === 'projects') setSelectedProjectId(null);
    setIsQuickMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Quick Action Overlay / Bottom Sheet */}
      {isQuickMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div 
            className="fixed inset-0" 
            onClick={() => setIsQuickMenuOpen(false)} 
          />
          <div className="relative bg-white rounded-t-3xl p-5 shadow-2xl z-10 border-t border-slate-200 animate-in slide-in-from-bottom duration-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#38A5F8] animate-pulse" />
                <h3 className="font-extrabold text-sm text-slate-900">Acciones Rápidas ERP</h3>
              </div>
              <button 
                type="button"
                onClick={() => setIsQuickMenuOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setIsNewClientModalOpen(true);
                  setIsQuickMenuOpen(false);
                }}
                className="p-3 bg-blue-50/70 hover:bg-blue-100/70 text-slate-800 rounded-2xl border border-blue-100 flex flex-col items-start gap-2 text-left transition-colors"
              >
                <div className="w-8 h-8 rounded-xl bg-[#38A5F8] text-white flex items-center justify-center shadow-xs">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-xs text-slate-900">+ Nuevo Cliente</p>
                  <p className="text-[10px] text-slate-500">Ficha y credenciales</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsNewProjectModalOpen(true);
                  setIsQuickMenuOpen(false);
                }}
                className="p-3 bg-blue-50/70 hover:bg-blue-100/70 text-slate-800 rounded-2xl border border-blue-100 flex flex-col items-start gap-2 text-left transition-colors"
              >
                <div className="w-8 h-8 rounded-xl bg-[#1d8fe6] text-white flex items-center justify-center shadow-xs">
                  <Code2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-xs text-slate-900">+ Nuevo Proyecto</p>
                  <p className="text-[10px] text-slate-500">Repo, DNS y backend</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsRecordPaymentModalOpen(true);
                  setIsQuickMenuOpen(false);
                }}
                className="p-3 bg-emerald-50/70 hover:bg-emerald-100/70 text-slate-800 rounded-2xl border border-emerald-100 flex flex-col items-start gap-2 text-left transition-colors"
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                  <DollarSign className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-xs text-slate-900">+ Registrar Cobro</p>
                  <p className="text-[10px] text-slate-500">Conciliar pago</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsNewReviewModalOpen(true);
                  setIsQuickMenuOpen(false);
                }}
                className="p-3 bg-purple-50/70 hover:bg-purple-100/70 text-slate-800 rounded-2xl border border-purple-100 flex flex-col items-start gap-2 text-left transition-colors"
              >
                <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-xs">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-xs text-slate-900">+ Auditoría Técnica</p>
                  <p className="text-[10px] text-slate-500">Mantenimiento</p>
                </div>
              </button>
            </div>

            {isPwaInstallable && (
              <button
                type="button"
                onClick={() => {
                  promptPwaInstall();
                  setIsQuickMenuOpen(false);
                }}
                className="w-full p-3 bg-gradient-to-r from-[#1d8fe6] to-[#38A5F8] text-white rounded-2xl flex items-center justify-center gap-2 font-bold text-xs shadow-md shadow-[#38A5F8]/20"
              >
                <Download className="w-4 h-4" />
                <span>Instalar Aplicación Goolo PWA</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main Bottom Bar */}
      <nav 
        id="mobile-bottom-nav"
        className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-2 py-1.5 flex items-center justify-around lg:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.06)] select-none safe-area-pb"
      >
        {/* Tab 1: Dashboard */}
        <button
          type="button"
          onClick={() => handleNavClick('dashboard')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all relative min-w-[56px] ${
            currentModule === 'dashboard'
              ? 'text-[#1d8fe6] font-extrabold'
              : 'text-slate-500 hover:text-slate-800 font-medium'
          }`}
        >
          <div className={`p-1 rounded-lg ${currentModule === 'dashboard' ? 'bg-blue-50' : ''}`}>
            <LayoutDashboard className="w-5 h-5" />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Dashboard</span>
        </button>

        {/* Tab 2: Clientes */}
        <button
          type="button"
          onClick={() => handleNavClick('clients')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all relative min-w-[56px] ${
            currentModule === 'clients'
              ? 'text-[#1d8fe6] font-extrabold'
              : 'text-slate-500 hover:text-slate-800 font-medium'
          }`}
        >
          <div className={`p-1 rounded-lg relative ${currentModule === 'clients' ? 'bg-blue-50' : ''}`}>
            <Building2 className="w-5 h-5" />
            {clients.length > 0 && (
              <span className="absolute -top-0.5 -right-1 px-1 py-0.2 bg-slate-200 text-slate-700 text-[8px] font-bold rounded-full">
                {clients.length}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Clientes</span>
        </button>

        {/* Center: Quick Action + Button */}
        <button
          type="button"
          onClick={() => setIsQuickMenuOpen(prev => !prev)}
          className="flex flex-col items-center justify-center -mt-4 group"
          title="Crear registro rápido"
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#1d8fe6] to-[#38A5F8] text-white flex items-center justify-center shadow-lg shadow-[#38A5F8]/35 ring-4 ring-white active:scale-95 transition-transform">
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </div>
          <span className="text-[9px] font-bold text-slate-600 mt-0.5">Crear</span>
        </button>

        {/* Tab 3: Proyectos */}
        <button
          type="button"
          onClick={() => handleNavClick('projects')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all relative min-w-[56px] ${
            currentModule === 'projects'
              ? 'text-[#1d8fe6] font-extrabold'
              : 'text-slate-500 hover:text-slate-800 font-medium'
          }`}
        >
          <div className={`p-1 rounded-lg relative ${currentModule === 'projects' ? 'bg-blue-50' : ''}`}>
            <Code2 className="w-5 h-5" />
            {projects.length > 0 && (
              <span className="absolute -top-0.5 -right-1 px-1 py-0.2 bg-blue-100 text-[#1d8fe6] text-[8px] font-bold rounded-full">
                {projects.length}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Proyectos</span>
        </button>

        {/* Tab 4: Finanzas */}
        <button
          type="button"
          onClick={() => handleNavClick('finance')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all relative min-w-[56px] ${
            currentModule === 'finance'
              ? 'text-[#1d8fe6] font-extrabold'
              : 'text-slate-500 hover:text-slate-800 font-medium'
          }`}
        >
          <div className={`p-1 rounded-lg relative ${currentModule === 'finance' ? 'bg-blue-50' : ''}`}>
            <DollarSign className="w-5 h-5" />
            {inMoraCount > 0 && (
              <span className="absolute -top-0.5 -right-1 w-3.5 h-3.5 bg-[#D81159] text-white text-[8px] font-black rounded-full flex items-center justify-center animate-pulse">
                {inMoraCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Finanzas</span>
        </button>

        {/* Tab 5: Más / Drawer Menu */}
        <button
          type="button"
          onClick={() => setIsMobileSidebarOpen(true)}
          className="flex flex-col items-center justify-center py-1 px-2 rounded-xl text-slate-500 hover:text-slate-800 font-medium transition-all min-w-[48px]"
          title="Abrir menú completo y documentación"
        >
          <div className="p-1 rounded-lg relative">
            <Menu className="w-5 h-5" />
            {pendingReviewsCount > 0 && (
              <span className="absolute -top-0.5 -right-1 w-2.5 h-2.5 bg-[#D81159] rounded-full" />
            )}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Más</span>
        </button>
      </nav>
    </>
  );
};
