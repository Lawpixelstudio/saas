import React from 'react';
import { 
  ChevronRight, 
  Home, 
  Building2, 
  Code2, 
  DollarSign, 
  Wrench, 
  FileText,
  Plus,
  RefreshCw,
  SlidersHorizontal,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { NavigationModule } from '../../types';

interface BreadcrumbsProps {
  title: string;
  subtitle?: string;
  recordName?: string;
  badge?: {
    text: string;
    variant: 'blue' | 'magenta' | 'green' | 'amber' | 'slate';
  };
  primaryAction?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  title,
  subtitle,
  recordName,
  badge,
  primaryAction,
  secondaryAction,
}) => {
  const { currentModule, setCurrentModule, setSelectedClientId, setSelectedProjectId } = useApp();

  const getModuleInfo = (mod: NavigationModule) => {
    switch (mod) {
      case 'dashboard':
        return { label: 'Dashboard General', icon: <Home className="w-3.5 h-3.5" /> };
      case 'clients':
        return { label: 'Clientes y Contactos', icon: <Building2 className="w-3.5 h-3.5" /> };
      case 'projects':
        return { label: 'Proyectos e Infraestructura', icon: <Code2 className="w-3.5 h-3.5" /> };
      case 'finance':
        return { label: 'Finanzas, Suscripciones y Cobros', icon: <DollarSign className="w-3.5 h-3.5" /> };
      case 'maintenance':
        return { label: 'Mantenimiento & Revisiones Periódicas', icon: <Wrench className="w-3.5 h-3.5" /> };
      case 'documentation':
        return { label: 'Notas, Credenciales & Pre-Launch', icon: <FileText className="w-3.5 h-3.5" /> };
      default:
        return { label: 'Goolo System', icon: <Home className="w-3.5 h-3.5" /> };
    }
  };

  const moduleInfo = getModuleInfo(currentModule);

  const getBadgeClass = (variant: 'blue' | 'magenta' | 'green' | 'amber' | 'slate') => {
    switch (variant) {
      case 'magenta':
        return 'bg-[#ffe4ee] text-[#D81159] border border-[#D81159]/20 font-bold';
      case 'blue':
        return 'bg-blue-50 text-[#1d8fe6] border border-blue-200 font-bold';
      case 'green':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold';
      case 'amber':
        return 'bg-amber-50 text-amber-700 border border-amber-200 font-bold';
      default:
        return 'bg-slate-100 text-slate-700 border border-slate-200';
    }
  };

  return (
    <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3 sm:py-4 salesforce-record-header">
      {/* Salesforce Lightning Breadcrumb Trail */}
      <nav className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 font-medium mb-1.5 sm:mb-2 select-none">
        <button
          onClick={() => {
            setCurrentModule('dashboard');
            setSelectedClientId(null);
            setSelectedProjectId(null);
          }}
          className="hover:text-[#1d8fe6] flex items-center gap-1 transition-colors"
        >
          <Home className="w-3 h-3 text-slate-400" />
          <span>Inicio</span>
        </button>

        <ChevronRight className="w-3 h-3 text-slate-300 shrink-0" />

        <button
          onClick={() => {
            setSelectedClientId(null);
            setSelectedProjectId(null);
          }}
          className={`hover:text-[#1d8fe6] flex items-center gap-1 transition-colors ${!recordName ? 'text-slate-900 font-bold' : ''}`}
        >
          {moduleInfo.icon}
          <span className="truncate max-w-[140px] sm:max-w-none">{moduleInfo.label}</span>
        </button>

        {recordName && (
          <>
            <ChevronRight className="w-3 h-3 text-slate-300 shrink-0" />
            <span className="text-slate-900 font-bold truncate max-w-[160px] sm:max-w-xs">{recordName}</span>
          </>
        )}
      </nav>

      {/* Highlights Bar / Actions Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight truncate">
                {title}
              </h1>
              {badge && (
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] sm:text-xs font-semibold shrink-0 ${getBadgeClass(badge.variant)}`}>
                  {badge.text}
                </span>
              )}
            </div>
            {subtitle && (
              <p className="text-xs text-slate-500 font-medium mt-0.5 line-clamp-2 sm:line-clamp-none">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Quick Toolbar Actions */}
        {(primaryAction || secondaryAction) && (
          <div className="flex items-center gap-2 self-start sm:self-center shrink-0 flex-wrap">
            {secondaryAction && (
              <button
                type="button"
                onClick={secondaryAction.onClick}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-2xs transition-all"
              >
                {secondaryAction.icon}
                <span>{secondaryAction.label}</span>
              </button>
            )}

            {primaryAction && (
              <button
                type="button"
                onClick={primaryAction.onClick}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl bg-[#38A5F8] text-white hover:bg-[#1d8fe6] shadow-sm shadow-[#38A5F8]/25 transition-all"
              >
                {primaryAction.icon || <Plus className="w-3.5 h-3.5" />}
                <span>{primaryAction.label}</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
