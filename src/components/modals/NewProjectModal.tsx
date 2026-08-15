import React, { useState } from 'react';
import { X, Code2, Globe, Database, GitBranch, Layers, ShieldCheck, Key } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DeliveryType, ProjectStatus, SupabasePlan, CloudflareDnsStatus, CloudflareSslStatus } from '../../types';

export const NewProjectModal: React.FC = () => {
  const { isNewProjectModalOpen, setIsNewProjectModalOpen, clients, addProject } = useApp();

  const [clientId, setClientId] = useState(clients[0]?.id || '');
  const [name, setName] = useState('');
  const [deliveryType, setDeliveryType] = useState<DeliveryType>('PWA');
  const [status, setStatus] = useState<ProjectStatus>('En Desarrollo');
  const [liveUrl, setLiveUrl] = useState('https://');
  const [description, setDescription] = useState('');

  // GitHub Data
  const [repo, setRepo] = useState('goolo-dev/');
  const [branch, setBranch] = useState('main');

  // Cloudflare Data
  const [zoneId, setZoneId] = useState('');
  const [domain, setDomain] = useState('');
  const [dnsStatus, setDnsStatus] = useState<CloudflareDnsStatus>('Proxied');
  const [sslStatus, setSslStatus] = useState<CloudflareSslStatus>('Full (Strict)');

  // Supabase Data
  const [projectRef, setProjectRef] = useState('');
  const [projectUrl, setProjectUrl] = useState('https://.supabase.co');
  const [anonApiKey, setAnonApiKey] = useState('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');
  const [plan, setPlan] = useState<SupabasePlan>('Pro');

  const [activeTab, setActiveTab] = useState<'general' | 'infra'>('general');

  if (!isNewProjectModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !clientId) return;

    addProject({
      clientId,
      name: name.trim(),
      deliveryType,
      status,
      liveUrl: liveUrl.trim(),
      description: description.trim(),
      github: {
        repo: repo.trim() || `goolo-dev/${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
        branch: branch.trim() || 'main',
        lastDeployStatus: 'success',
        lastDeployAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
        commitHash: Math.random().toString(36).substring(2, 9),
        commitMessage: 'Initial project infrastructure setup and scaffolding',
      },
      cloudflare: {
        zoneId: zoneId.trim() || Math.random().toString(36).substring(2, 18) + Math.random().toString(36).substring(2, 18),
        domain: domain.trim() || (liveUrl.replace(/^https?:\/\//, '').split('/')[0] || 'app.com'),
        dnsStatus,
        sslStatus,
        sslExpiresAt: '2027-08-14',
        ipAddress: '104.21.77.102',
      },
      supabase: {
        projectRef: projectRef.trim() || Math.random().toString(36).substring(2, 14),
        projectUrl: projectUrl.trim() || `https://${projectRef || 'app'}.supabase.co`,
        anonApiKey: anonApiKey.trim(),
        serviceRoleKey: 'secret_service_role_key_' + Math.random().toString(36).substring(2, 8),
        plan,
        dbSizeMb: 15.0,
        storageSizeMb: 50.0,
        status: 'Healthy',
      },
      siteApi: {
        isPaused: false,
        pauseReason: '',
        pauseWebhookUrl: `https://${domain.trim() || 'app.com'}/api/pause`,
        apiKey: `goolo_live_${Math.random().toString(36).substring(2, 12)}`,
        healthStatus: 'operational',
        httpStatusCode: 200,
        latencyMs: 48,
        uptimePercentage: 99.98,
        lastHealthCheck: new Date().toISOString().replace('T', ' ').slice(0, 19),
        healthCheckEndpoint: `https://${domain.trim() || 'app.com'}/api/health`,
        sslDaysRemaining: 365,
        dbLatencyMs: 14,
        edgeCacheStatus: 'HIT',
        isFunctional: true,
        lastTestLog: 'Inicialización de telemetría en vivo configurada.',
        analyticsApiUrl: `https://${domain.trim() || 'app.com'}/api/analytics`,
        liveActiveVisitors: 12,
        visitsToday: 150,
        visitsThisWeek: 1200,
        visitsThisMonth: 4800,
        pageViewsToday: 490,
        requestsPerMinute: 18,
        bandwidthMbToday: 42.0,
        avgResponseTimeMs: 46,
        errorRatePercent: 0.0,
        hourlyTraffic: [
          { hour: '00:00', visits: 5, requests: 12 },
          { hour: '04:00', visits: 2, requests: 5 },
          { hour: '08:00', visits: 25, requests: 68 },
          { hour: '11:00', visits: 40, requests: 110 },
          { hour: '13:00', visits: 35, requests: 95 },
          { hour: '15:00', visits: 22, requests: 70 },
          { hour: '18:00', visits: 14, requests: 45 },
          { hour: '20:00', visits: 7, requests: 25 },
        ],
        topPages: [
          { path: '/', views: 240, percentage: 50 },
          { path: '/contacto', views: 120, percentage: 25 },
          { path: '/servicios', views: 80, percentage: 16 },
          { path: '/precios', views: 50, percentage: 9 },
        ],
        deviceBreakdown: {
          mobile: 70,
          desktop: 26,
          tablet: 4,
        }
      }
    });

    setIsNewProjectModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="fixed inset-0" 
        onClick={() => setIsNewProjectModalOpen(false)} 
      />

      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#38A5F8]/10 text-[#1d8fe6]">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Nuevo Proyecto & Infraestructura</h2>
              <p className="text-xs text-slate-500">Configuración unificada de GitHub, Cloudflare y Supabase</p>
            </div>
          </div>
          <button
            onClick={() => setIsNewProjectModalOpen(false)}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50/50 px-6 pt-2">
          <button
            type="button"
            onClick={() => setActiveTab('general')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'general'
                ? 'border-[#38A5F8] text-[#1d8fe6]'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>1. Datos del Proyecto</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('infra')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'infra'
                ? 'border-[#38A5F8] text-[#1d8fe6]'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>2. Infraestructura (GitHub, CF & Supabase)</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {activeTab === 'general' && (
            <div className="space-y-4 animate-in fade-in duration-100">
              {/* Client selection & Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Cliente Propietario *
                  </label>
                  <select
                    required
                    value={clientId}
                    onChange={e => setClientId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:border-[#38A5F8] focus:outline-hidden"
                  >
                    {clients.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.taxId})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Nombre del Proyecto *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Ej. Delivery Gourmet PWA"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:bg-white focus:border-[#38A5F8] focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Delivery Type & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Tipo de Entrega / Arquitectura *
                  </label>
                  <select
                    value={deliveryType}
                    onChange={e => setDeliveryType(e.target.value as DeliveryType)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:border-[#38A5F8] focus:outline-hidden"
                  >
                    <option value="PWA">PWA (Progressive Web App)</option>
                    <option value="E-commerce">E-commerce / Tienda Online</option>
                    <option value="Menú Digital">Menú Digital Interactivo</option>
                    <option value="Landing Page">Landing Page de Conversión</option>
                    <option value="Portal Web / Dashboard">Portal Web / Dashboard B2B</option>
                    <option value="API / Backend">API / Microservicio Backend</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Estado Actual
                  </label>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value as ProjectStatus)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:border-[#38A5F8] focus:outline-hidden"
                  >
                    <option value="En Desarrollo">En Desarrollo</option>
                    <option value="En Producción">En Producción (Live)</option>
                    <option value="En Revisión">En Revisión / QA</option>
                    <option value="Mantenimiento">Mantenimiento</option>
                  </select>
                </div>
              </div>

              {/* URL */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  URL de Producción / Staging
                </label>
                <input
                  type="text"
                  value={liveUrl}
                  onChange={e => setLiveUrl(e.target.value)}
                  placeholder="https://app.cliente.com"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:border-[#38A5F8] focus:outline-hidden font-mono"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Descripción & Alcance del Proyecto
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Objetivo del proyecto, pasarelas integradas, flujos principales..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:bg-white focus:border-[#38A5F8] focus:outline-hidden resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('infra')}
                  className="w-full py-2 bg-blue-50 text-[#1d8fe6] font-bold rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Continuar a Configuración de Infraestructura</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'infra' && (
            <div className="space-y-4 animate-in fade-in duration-100 max-h-96 overflow-y-auto pr-1">
              {/* GitHub Card */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2 mb-2.5">
                  <GitBranch className="w-4 h-4 text-slate-800" />
                  <span className="font-bold text-slate-900">1. Repositorio GitHub</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Repositorio (usuario/repo)
                    </label>
                    <input
                      type="text"
                      value={repo}
                      onChange={e => setRepo(e.target.value)}
                      placeholder="goolo-dev/mi-proyecto"
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-md font-mono text-[11px]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Rama Principal
                    </label>
                    <input
                      type="text"
                      value={branch}
                      onChange={e => setBranch(e.target.value)}
                      placeholder="main"
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-md font-mono text-[11px]"
                    />
                  </div>
                </div>
              </div>

              {/* Cloudflare Card */}
              <div className="p-3.5 bg-amber-50/50 rounded-xl border border-amber-200/80">
                <div className="flex items-center gap-2 mb-2.5">
                  <Globe className="w-4 h-4 text-amber-600" />
                  <span className="font-bold text-slate-900">2. Configuración Cloudflare</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Dominio Asociado
                    </label>
                    <input
                      type="text"
                      value={domain}
                      onChange={e => setDomain(e.target.value)}
                      placeholder="ejemplo.com"
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-md font-mono text-[11px]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Zone ID
                    </label>
                    <input
                      type="text"
                      value={zoneId}
                      onChange={e => setZoneId(e.target.value)}
                      placeholder="8f4a9b2c3d..."
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-md font-mono text-[11px]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Estado DNS
                    </label>
                    <select
                      value={dnsStatus}
                      onChange={e => setDnsStatus(e.target.value as CloudflareDnsStatus)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-md text-[11px]"
                    >
                      <option value="Proxied">Proxied (Nube Naranja / WAF)</option>
                      <option value="DNS Only">DNS Only (Gris)</option>
                      <option value="Pending">Pendiente</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Modo SSL / TLS
                    </label>
                    <select
                      value={sslStatus}
                      onChange={e => setSslStatus(e.target.value as CloudflareSslStatus)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-md text-[11px]"
                    >
                      <option value="Full (Strict)">Full (Strict) - Recomendado</option>
                      <option value="Flexible">Flexible</option>
                      <option value="Off">Desactivado</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Supabase Card */}
              <div className="p-3.5 bg-emerald-50/50 rounded-xl border border-emerald-200/80">
                <div className="flex items-center gap-2 mb-2.5">
                  <Database className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold text-slate-900">3. Base de Datos & Auth Supabase</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Project Ref ID
                    </label>
                    <input
                      type="text"
                      value={projectRef}
                      onChange={e => {
                        setProjectRef(e.target.value);
                        setProjectUrl(`https://${e.target.value}.supabase.co`);
                      }}
                      placeholder="abxvyuqwezptl"
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-md font-mono text-[11px]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Plan de Supabase
                    </label>
                    <select
                      value={plan}
                      onChange={e => setPlan(e.target.value as SupabasePlan)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-md text-[11px]"
                    >
                      <option value="Free">Free Tier</option>
                      <option value="Pro">Pro Plan ($25/m)</option>
                      <option value="Team">Team Plan ($599/m)</option>
                      <option value="Enterprise">Enterprise</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Anon Public API Key
                    </label>
                    <input
                      type="text"
                      value={anonApiKey}
                      onChange={e => setAnonApiKey(e.target.value)}
                      placeholder="eyJhbGci..."
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-md font-mono text-[11px]"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setIsNewProjectModalOpen(false)}
              className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 font-bold text-white bg-[#38A5F8] hover:bg-[#1d8fe6] rounded-lg shadow-sm shadow-[#38A5F8]/25 transition-all"
            >
              Crear Proyecto & Conectar Infra
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
