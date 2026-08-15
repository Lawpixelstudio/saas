import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, X, Building2, Code, DollarSign, Wrench, FileText, ArrowRight, Globe, Database, GitBranch } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const GlobalSearchModal: React.FC = () => {
  const { 
    isSearchOpen, 
    setIsSearchOpen, 
    clients, 
    projects, 
    financeRecords, 
    maintenanceReviews, 
    projectNotes,
    setCurrentModule,
    setSelectedClientId,
    setSelectedProjectId
  } = useApp();

  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isSearchOpen]);

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();

    const results: Array<{
      id: string;
      title: string;
      subtitle: string;
      category: 'Cliente' | 'Proyecto' | 'GitHub' | 'Cloudflare' | 'Supabase' | 'Finanzas' | 'Revisión' | 'Nota';
      icon: React.ReactNode;
      onClick: () => void;
      tag?: string;
    }> = [];

    // Search Clients
    clients.forEach(c => {
      if (
        c.name.toLowerCase().includes(q) ||
        c.taxId.toLowerCase().includes(q) ||
        (c.domain && c.domain.toLowerCase().includes(q)) ||
        (c.githubRepo && c.githubRepo.toLowerCase().includes(q)) ||
        (c.githubEmail && c.githubEmail.toLowerCase().includes(q)) ||
        (c.githubLogin && c.githubLogin.toLowerCase().includes(q)) ||
        (c.supabaseEmail && c.supabaseEmail.toLowerCase().includes(q)) ||
        (c.cloudflareEmail && c.cloudflareEmail.toLowerCase().includes(q)) ||
        c.legalRepresentative.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q)
      ) {
        results.push({
          id: `cli-${c.id}`,
          title: c.name,
          subtitle: `Dominio: ${c.domain || 'N/A'} • Repo: ${c.githubRepo || 'N/A'} • RIF: ${c.taxId}`,
          category: 'Cliente',
          icon: <Building2 className="w-4 h-4 text-[#38A5F8]" />,
          tag: c.status,
          onClick: () => {
            setSelectedClientId(c.id);
            setCurrentModule('clients');
            setIsSearchOpen(false);
          }
        });
      }
    });

    // Search Projects & Infra
    projects.forEach(p => {
      const client = clients.find(c => c.id === p.clientId);
      const isMatch = 
        p.name.toLowerCase().includes(q) ||
        p.deliveryType.toLowerCase().includes(q) ||
        p.github.repo.toLowerCase().includes(q) ||
        p.cloudflare.domain.toLowerCase().includes(q) ||
        p.cloudflare.zoneId.toLowerCase().includes(q) ||
        (p.cloudflare.ipAddress && p.cloudflare.ipAddress.includes(q)) ||
        p.supabase.projectRef.toLowerCase().includes(q) ||
        p.supabase.projectUrl.toLowerCase().includes(q);

      if (isMatch) {
        results.push({
          id: `proj-${p.id}`,
          title: p.name,
          subtitle: `Cliente: ${client?.name || 'N/A'} • Tipo: ${p.deliveryType} • Dominio: ${p.cloudflare.domain}`,
          category: 'Proyecto',
          icon: <Code className="w-4 h-4 text-[#38A5F8]" />,
          tag: p.status,
          onClick: () => {
            setSelectedProjectId(p.id);
            setCurrentModule('projects');
            setIsSearchOpen(false);
          }
        });

        // If matched github repo specifically
        if (p.github.repo.toLowerCase().includes(q)) {
          results.push({
            id: `gh-${p.id}`,
            title: `GitHub: ${p.github.repo}`,
            subtitle: `Rama: ${p.github.branch} • Último Commit: ${p.github.commitHash} • ${p.name}`,
            category: 'GitHub',
            icon: <GitBranch className="w-4 h-4 text-slate-700" />,
            tag: p.github.lastDeployStatus,
            onClick: () => {
              setSelectedProjectId(p.id);
              setCurrentModule('projects');
              setIsSearchOpen(false);
            }
          });
        }

        // If matched cloudflare domain or zone
        if (p.cloudflare.domain.toLowerCase().includes(q) || p.cloudflare.zoneId.toLowerCase().includes(q)) {
          results.push({
            id: `cf-${p.id}`,
            title: `Cloudflare: ${p.cloudflare.domain}`,
            subtitle: `Zone ID: ${p.cloudflare.zoneId} • SSL: ${p.cloudflare.sslStatus} • IP: ${p.cloudflare.ipAddress || '104.21.x.x'}`,
            category: 'Cloudflare',
            icon: <Globe className="w-4 h-4 text-amber-500" />,
            tag: p.cloudflare.dnsStatus,
            onClick: () => {
              setSelectedProjectId(p.id);
              setCurrentModule('projects');
              setIsSearchOpen(false);
            }
          });
        }

        // If matched supabase
        if (p.supabase.projectRef.toLowerCase().includes(q) || p.supabase.projectUrl.toLowerCase().includes(q)) {
          results.push({
            id: `sb-${p.id}`,
            title: `Supabase: ${p.supabase.projectRef}`,
            subtitle: `Plan: ${p.supabase.plan} • URL: ${p.supabase.projectUrl} • Proyecto: ${p.name}`,
            category: 'Supabase',
            icon: <Database className="w-4 h-4 text-emerald-500" />,
            tag: p.supabase.status,
            onClick: () => {
              setSelectedProjectId(p.id);
              setCurrentModule('projects');
              setIsSearchOpen(false);
            }
          });
        }
      }
    });

    // Search Finances
    financeRecords.forEach(f => {
      const client = clients.find(c => c.id === f.clientId);
      const project = projects.find(p => p.id === f.projectId);
      if (
        (client && client.name.toLowerCase().includes(q)) ||
        (project && project.name.toLowerCase().includes(q)) ||
        (f.notes && f.notes.toLowerCase().includes(q)) ||
        (f.paymentType === 'subscription' && 'suscripcion recurrente mensual'.includes(q)) ||
        (f.subscriptionStatus && f.subscriptionStatus.toLowerCase().includes(q)) ||
        (f.oneTimeStatus && f.oneTimeStatus.toLowerCase().includes(q))
      ) {
        results.push({
          id: `fin-${f.id}`,
          title: `Finanzas: ${client?.name || 'Cliente'} (${project?.name || ''})`,
          subtitle: f.paymentType === 'subscription' 
            ? `Suscripción: $${f.monthlyAmount} USD/mes • Cobro Día ${f.billingDay} • Estado: ${f.subscriptionStatus}`
            : `Pago Único: Total $${f.totalAmount} • Restante $${f.remainingBalance} USD • ${f.oneTimeStatus}`,
          category: 'Finanzas',
          icon: <DollarSign className="w-4 h-4 text-emerald-600" />,
          tag: f.paymentType === 'subscription' ? f.subscriptionStatus : f.oneTimeStatus,
          onClick: () => {
            setCurrentModule('finance');
            setIsSearchOpen(false);
          }
        });
      }
    });

    // Search Maintenance
    maintenanceReviews.forEach(r => {
      if (
        r.title.toLowerCase().includes(q) ||
        r.auditorName.toLowerCase().includes(q) ||
        r.notes.toLowerCase().includes(q) ||
        r.status.toLowerCase().includes(q)
      ) {
        results.push({
          id: `rev-${r.id}`,
          title: r.title,
          subtitle: `Ciclo: cada ${r.intervalDays} días • Próxima: ${r.nextReviewDate} • Auditor: ${r.auditorName}`,
          category: 'Revisión',
          icon: <Wrench className="w-4 h-4 text-purple-600" />,
          tag: r.status,
          onClick: () => {
            setCurrentModule('maintenance');
            setIsSearchOpen(false);
          }
        });
      }
    });

    // Search Documentation Notes
    projectNotes.forEach(n => {
      const project = projects.find(p => p.id === n.projectId);
      if (
        n.title.toLowerCase().includes(q) ||
        n.markdownContent.toLowerCase().includes(q)
      ) {
        results.push({
          id: `note-${n.id}`,
          title: n.title,
          subtitle: `Proyecto: ${project?.name || 'General'} • Categoría: ${n.category} • Actualizado: ${n.updatedAt}`,
          category: 'Nota',
          icon: <FileText className="w-4 h-4 text-amber-600" />,
          tag: n.category,
          onClick: () => {
            setSelectedProjectId(n.projectId);
            setCurrentModule('documentation');
            setIsSearchOpen(false);
          }
        });
      }
    });

    return results;
  }, [query, clients, projects, financeRecords, maintenanceReviews, projectNotes, setCurrentModule, setSelectedClientId, setSelectedProjectId, setIsSearchOpen]);

  if (!isSearchOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-start justify-center pt-16 sm:pt-24 p-4">
      <div 
        className="fixed inset-0" 
        onClick={() => setIsSearchOpen(false)} 
      />

      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-100 bg-slate-50/50">
          <Search className="w-5 h-5 text-[#38A5F8] shrink-0 mr-3" />
          <input
            ref={inputRef}
            id="global-search-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar clientes, repositorios GitHub, Zone ID Cloudflare, Supabase, IPs, RIFs..."
            className="w-full bg-transparent border-0 text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-0"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-md transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block ml-2 px-2 py-0.5 text-[10px] font-mono font-semibold text-slate-400 bg-slate-200/80 rounded border border-slate-300">
            ESC
          </kbd>
        </div>

        {/* Search Results List */}
        <div className="max-h-96 overflow-y-auto p-2 divide-y divide-slate-100">
          {!query.trim() ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              <Search className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p className="font-medium text-slate-600">Buscador Universal de Goolo System</p>
              <p className="mt-1 text-slate-400">Escribe para encontrar cualquier cliente, infraestructura, clave o factura al instante.</p>
              <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-[11px] text-slate-500">
                <span className="px-2 py-1 bg-slate-100 rounded-md">Ej. Caracas Gourmet</span>
                <span className="px-2 py-1 bg-slate-100 rounded-md">Ej. novapay.io</span>
                <span className="px-2 py-1 bg-slate-100 rounded-md">Ej. Supabase</span>
                <span className="px-2 py-1 bg-slate-100 rounded-md">Ej. En Mora</span>
              </div>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              <p className="font-semibold text-slate-600">No se encontraron resultados para &quot;{query}&quot;</p>
              <p className="mt-1 text-slate-400">Prueba con otro término de búsqueda o revisa la ortografía.</p>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Resultados ({searchResults.length})
              </div>
              {searchResults.map(item => {
                const isMora = item.tag === 'En Mora' || item.tag === 'Vencida' || item.tag === 'Error' || item.tag === 'failed' || item.tag === 'Off';
                return (
                  <div
                    key={item.id}
                    onClick={item.onClick}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-100/80 cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2 rounded-lg bg-slate-50 border border-slate-200/60 shrink-0">
                        {item.icon}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-slate-900 truncate">
                            {item.title}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 font-medium">
                            {item.category}
                          </span>
                          {item.tag && (
                            <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                              isMora ? 'bg-[#ffe4ee] text-[#D81159]' : 'bg-slate-100 text-slate-600'
                            }`}>
                              {item.tag}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">
                          {item.subtitle}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#38A5F8] group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span>Goolo System Search</span>
          <span className="flex items-center gap-1.5">
            Presiona <kbd className="px-1.5 py-0.5 bg-slate-200 rounded font-mono text-[9px]">ESC</kbd> para cerrar
          </span>
        </div>
      </div>
    </div>
  );
};
