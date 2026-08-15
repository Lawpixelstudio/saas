import React, { useState } from 'react';
import { 
  Code2, 
  Globe, 
  Database, 
  GitBranch, 
  Key, 
  Eye, 
  EyeOff, 
  Plus, 
  ExternalLink, 
  RefreshCw, 
  ShieldCheck, 
  Server, 
  Layers, 
  Search,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Trash2,
  HardDrive,
  Activity,
  PauseCircle,
  PlayCircle,
  Radio,
  Users,
  Clock,
  Zap,
  Settings2,
  History,
  Rocket
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Breadcrumbs } from '../layout/Breadcrumbs';
import { CopyButton } from '../common/CopyButton';
import { DeliveryType, Project } from '../../types';
import { ProjectTelemetryDashboard } from './ProjectTelemetryDashboard';
import { SiteStatusBadge } from '../common/SiteStatusBadge';
import { ActivityFeed } from './ActivityFeed';

export const ProjectsView: React.FC = () => {
  const { 
    projects, 
    clients, 
    projectActivities,
    selectedProjectId, 
    setSelectedProjectId,
    setIsNewProjectModalOpen,
    setCurrentModule,
    updateProject,
    toggleProjectPause,
    testProjectHealth,
    addProjectActivity,
    showToast,
    deleteProject
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'all' | 'active' | 'paused'>('all');
  const [visibleKeyProjectId, setVisibleKeyProjectId] = useState<string | null>(null);
  const [isSimulatingDeploy, setIsSimulatingDeploy] = useState<string | null>(null);
  
  // Card-level active tab: 'telemetry' (default) vs 'infra' vs 'activity'
  const [projectTabs, setProjectTabs] = useState<Record<string, 'telemetry' | 'infra' | 'activity'>>({});

  const getProjectTab = (projectId: string) => projectTabs[projectId] || 'telemetry';
  const setProjectTab = (projectId: string, tab: 'telemetry' | 'infra' | 'activity') => {
    setProjectTabs(prev => ({ ...prev, [projectId]: tab }));
  };

  const filteredProjects = projects.filter(p => {
    const client = clients.find(c => c.id === p.clientId);
    const matchesSearch = 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.deliveryType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.cloudflare.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.github.repo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.supabase.projectRef.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.siteApi?.healthCheckEndpoint && p.siteApi.healthCheckEndpoint.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (client && client.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType = selectedType === 'all' || p.deliveryType === selectedType;

    const matchesStatus = 
      selectedStatusFilter === 'all' ||
      (selectedStatusFilter === 'active' && !p.siteApi?.isPaused) ||
      (selectedStatusFilter === 'paused' && p.siteApi?.isPaused);

    return matchesSearch && matchesType && matchesStatus;
  });

  const handleSimulateDeploy = (projectId: string) => {
    setIsSimulatingDeploy(projectId);
    showToast('Iniciando nuevo despliegue en edge server...', 'info');

    const randomHash = Math.random().toString(36).substring(2, 9);
    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16);
    const proj = projects.find(p => p.id === projectId);

    setTimeout(() => {
      updateProject(projectId, {
        github: {
          ...projects.find(p => p.id === projectId)!.github,
          lastDeployStatus: 'success',
          lastDeployAt: nowStr,
          commitHash: randomHash,
        }
      });

      addProjectActivity({
        projectId,
        type: 'deployment',
        title: `Deploy Producción (${randomHash})`,
        description: 'Compilación y despliegue exitoso desde rama main con optimizaciones en edge network.',
        severity: 'success',
        author: 'GitHub Actions (CI/CD)',
        metadata: {
          commitHash: randomHash,
          commitMessage: 'feat(core): trigger production redeploy',
          branch: proj?.github.branch || 'main',
          deployDurationSec: 32,
          deployStatus: 'success',
          environment: 'production',
          rollbackAvailable: true,
          deployLogs: [
            'Triggered by push to refs/heads/main',
            'Running automated test suite: All tests passing',
            'Vite production assets compiled in 2.4s',
            'Assets distributed to Cloudflare Edge Network',
            'Health Check verified: HTTP 200 OK'
          ]
        }
      });

      setIsSimulatingDeploy(null);
      showToast('¡Despliegue a producción completado con éxito!', 'success');
    }, 1500);
  };

  const handleTestSslDns = (project: Project) => {
    showToast(`Verificando Cloudflare DNS y certificado SSL para ${project.cloudflare.domain}...`, 'info');
    setTimeout(() => {
      showToast(`DNS Proxied activo y SSL Full (Strict) válido hasta ${project.cloudflare.sslExpiresAt}`, 'success');
    }, 800);
  };

  const pausedCount = projects.filter(p => p.siteApi?.isPaused).length;
  const activeCount = projects.length - pausedCount;

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#F8FAFC]">
      <Breadcrumbs
        title="Proyectos, Telemetría & API en Vivo"
        subtitle="Monitoreo de salud, visitas en tiempo real, control de pausa y administración de infraestructura"
        badge={{
          text: `${projects.length} Proyectos Registrados`,
          variant: 'blue'
        }}
        primaryAction={{
          label: 'Nuevo Proyecto & API',
          onClick: () => setIsNewProjectModalOpen(true),
          icon: <Plus className="w-3.5 h-3.5" />
        }}
      />

      <div className="p-3 sm:p-6 space-y-4 sm:space-y-6 max-w-7xl w-full mx-auto">
        {/* Quick Status Stats Ribbon */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">
                🟢
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-500 uppercase">Sitios en Línea</p>
                <p className="text-lg font-black text-slate-900 font-mono">{activeCount} activos</p>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              200 OK
            </span>
          </div>

          <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xs">
                ⏸️
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-500 uppercase">Sitios Pausados</p>
                <p className="text-lg font-black text-amber-700 font-mono">{pausedCount} en pausa</p>
              </div>
            </div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${pausedCount > 0 ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'}`}>
              503 Mantenimiento
            </span>
          </div>

          <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#1d8fe6] flex items-center justify-center font-bold text-xs">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-500 uppercase">Visitas Globales Hoy</p>
                <p className="text-lg font-black text-slate-900 font-mono">
                  {projects.reduce((sum, p) => sum + (p.siteApi?.visitsToday || 0), 0).toLocaleString()}
                </p>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
              Tráfico Live
            </span>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Buscar por proyecto, dominio, API endpoint, repo..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-[#38A5F8] focus:outline-hidden"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
            {/* Status Filter Buttons */}
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-[11px] font-bold">
              <button
                type="button"
                onClick={() => setSelectedStatusFilter('all')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  selectedStatusFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Todos ({projects.length})
              </button>
              <button
                type="button"
                onClick={() => setSelectedStatusFilter('active')}
                className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1 ${
                  selectedStatusFilter === 'active' ? 'bg-white text-emerald-700 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <span>Activos ({activeCount})</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedStatusFilter('paused')}
                className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1 ${
                  selectedStatusFilter === 'paused' ? 'bg-white text-amber-700 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <span>Pausados ({pausedCount})</span>
              </button>
            </div>

            {/* Delivery Type Dropdown */}
            <select
              value={selectedType}
              onChange={e => setSelectedType(e.target.value)}
              className="w-full sm:w-auto px-3 py-1.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:bg-white focus:outline-hidden"
            >
              <option value="all">Todos los Tipos de Entrega</option>
              <option value="PWA">PWA (Progressive Web App)</option>
              <option value="E-commerce">E-commerce / Tienda</option>
              <option value="Menú Digital">Menú Digital</option>
              <option value="Landing Page">Landing Page</option>
              <option value="Portal Web / Dashboard">Portal Web / Dashboard</option>
              <option value="API / Backend">API / Microservicio</option>
            </select>
          </div>
        </div>

        {/* PROJECTS LIST */}
        <div className="space-y-6">
          {filteredProjects.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
              <Activity className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-slate-800">No se encontraron proyectos</h3>
              <p className="text-xs text-slate-500 mt-1">Prueba cambiando los filtros o el término de búsqueda.</p>
            </div>
          ) : (
            filteredProjects.map(project => {
              const client = clients.find(c => c.id === project.clientId);
              const isKeysRevealed = visibleKeyProjectId === project.id;
              const isDeploying = isSimulatingDeploy === project.id;
              const activeTab = getProjectTab(project.id);
              const isPaused = project.siteApi?.isPaused;

              return (
                <div 
                  key={project.id}
                  id={`project-card-${project.id}`}
                  className={`bg-white rounded-2xl border shadow-xs overflow-hidden transition-all hover:shadow-md ${
                    isPaused ? 'border-amber-300' : 'border-slate-200'
                  }`}
                >
                  {/* PROJECT HEADER RIBBON */}
                  <div className={`p-5 border-b flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    isPaused ? 'bg-amber-500/10 border-amber-200' : 'bg-slate-50/50 border-slate-100'
                  }`}>
                    <div className="flex items-start gap-3">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm shadow-md shrink-0 ${
                        isPaused ? 'bg-amber-500 text-white' : 'bg-gradient-to-tr from-slate-900 to-slate-700 text-white'
                      }`}>
                        {isPaused ? <PauseCircle className="w-6 h-6" /> : <Code2 className="w-6 h-6 text-[#38A5F8]" />}
                      </div>

                      <div>
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <h3 className="text-base font-black text-slate-900">
                            {project.name}
                          </h3>
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#38A5F8]/10 text-[#1d8fe6]">
                            {project.deliveryType}
                          </span>

                          {/* Operational Status Pill & Live Uptime */}
                          <SiteStatusBadge 
                            project={project} 
                            variant="pill" 
                            showLatency={true} 
                            interactive={true} 
                          />

                          {/* Live Visits Badge */}
                          <span className="px-2 py-0.5 rounded-md text-[11px] font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
                            <Users className="w-3 h-3 text-[#1d8fe6]" />
                            <span>{project.siteApi?.visitsToday.toLocaleString() || 0} visitas hoy</span>
                            {!isPaused && (
                              <span className="text-emerald-600 ml-1">({project.siteApi?.liveActiveVisitors || 0} en vivo)</span>
                            )}
                          </span>
                        </div>

                        <p className="text-xs text-slate-500 mt-1">
                          Cliente: <strong className="text-slate-800">{client?.name}</strong> • Dominio: <span className="font-mono text-slate-700 font-bold">{project.cloudflare.domain}</span>
                        </p>
                      </div>
                    </div>

                    {/* Header Action Controls */}
                    <div className="flex items-center gap-2 self-end md:self-center flex-wrap">
                      {/* Direct Pause/Resume Switch */}
                      <button
                        onClick={() => toggleProjectPause(project.id)}
                        className={`px-3 py-1.5 text-xs font-black rounded-xl transition-all flex items-center gap-1.5 shadow-2xs ${
                          isPaused
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                            : 'bg-amber-500 hover:bg-amber-600 text-white'
                        }`}
                        title={isPaused ? 'Reanudar sitio y poner en línea' : 'Pausar página y mostrar pantalla 503'}
                      >
                        {isPaused ? <PlayCircle className="w-3.5 h-3.5" /> : <PauseCircle className="w-3.5 h-3.5" />}
                        <span>{isPaused ? 'Reanudar Sitio' : 'Pausar'}</span>
                      </button>

                      {/* Live Link */}
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs"
                      >
                        <span>Abrir Web</span>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                      </a>

                      <button
                        onClick={() => {
                          setSelectedProjectId(project.id);
                          setCurrentModule('documentation');
                        }}
                        className="px-3 py-1.5 text-xs font-bold text-[#1d8fe6] bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors flex items-center gap-1.5"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Docs & .env</span>
                      </button>
                    </div>
                  </div>

                  {/* PROJECT CARD TABS: TELEMETRÍA vs INFRAESTRUCTURA vs ACTIVIDAD */}
                  <div className="flex border-b border-slate-200 bg-slate-50/40 px-5 pt-2 gap-4 overflow-x-auto">
                    <button
                      type="button"
                      onClick={() => setProjectTab(project.id, 'telemetry')}
                      className={`pb-2.5 px-2 text-xs font-bold border-b-2 transition-all flex items-center gap-2 shrink-0 ${
                        activeTab === 'telemetry'
                          ? 'border-[#38A5F8] text-[#1d8fe6]'
                          : 'border-transparent text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      <Activity className="w-3.5 h-3.5" />
                      <span>1. Dashboard de Telemetría, Visitas & API</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setProjectTab(project.id, 'infra')}
                      className={`pb-2.5 px-2 text-xs font-bold border-b-2 transition-all flex items-center gap-2 shrink-0 ${
                        activeTab === 'infra'
                          ? 'border-[#38A5F8] text-[#1d8fe6]'
                          : 'border-transparent text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      <Server className="w-3.5 h-3.5" />
                      <span>2. Infraestructura Cloud (GitHub, Cloudflare & Supabase)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setProjectTab(project.id, 'activity')}
                      className={`pb-2.5 px-2 text-xs font-bold border-b-2 transition-all flex items-center gap-2 shrink-0 ${
                        activeTab === 'activity'
                          ? 'border-[#38A5F8] text-[#1d8fe6]'
                          : 'border-transparent text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      <History className="w-3.5 h-3.5" />
                      <span>3. Historial de Actividad, Despliegues & Auditoría</span>
                      {(() => {
                        const projEvents = projectActivities.filter(a => a.projectId === project.id);
                        const hasUnresolved = projEvents.some(a => a.type === 'system_alert' && !a.metadata?.resolved && a.severity !== 'success');
                        return (
                          <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                            hasUnresolved 
                              ? 'bg-[#ffe4ee] text-[#D81159] font-black animate-pulse' 
                              : activeTab === 'activity' ? 'bg-blue-100 text-[#1d8fe6]' : 'bg-slate-200 text-slate-700'
                          }`}>
                            {projEvents.length}
                          </span>
                        );
                      })()}
                    </button>
                  </div>

                  {/* TAB 1: TELEMETRY & API DASHBOARD */}
                  {activeTab === 'telemetry' && (
                    <div className="p-5">
                      <ProjectTelemetryDashboard project={project} />
                    </div>
                  )}

                  {/* TAB 2: INFRASTRUCTURE 3-COLUMN STACK */}
                  {activeTab === 'infra' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100 p-5 gap-5 animate-in fade-in">
                      {/* COL 1: GITHUB DATA */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-lg bg-slate-900 text-white">
                              <GitBranch className="w-4 h-4" />
                            </div>
                            <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                              GitHub Repository
                            </span>
                          </div>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700">
                            {project.github.lastDeployStatus === 'success' ? 'Deployed' : project.github.lastDeployStatus}
                          </span>
                        </div>

                        <div className="space-y-2 text-xs">
                          <div>
                            <p className="text-[11px] text-slate-400 font-medium">Repo Privado:</p>
                            <div className="flex items-center justify-between gap-1 bg-slate-50 p-1.5 rounded-lg border border-slate-200 mt-0.5">
                              <span className="font-mono text-slate-800 font-semibold truncate text-[11px]">
                                {project.github.repo}
                              </span>
                              <CopyButton textToCopy={`https://github.com/${project.github.repo}`} />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-[11px]">
                            <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                              <p className="text-slate-400">Rama:</p>
                              <p className="font-mono font-bold text-slate-800">{project.github.branch}</p>
                            </div>
                            <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                              <p className="text-slate-400">Commit Hash:</p>
                              <p className="font-mono font-bold text-slate-800">{project.github.commitHash}</p>
                            </div>
                          </div>

                          <div className="pt-1 flex items-center justify-between text-[11px] text-slate-500">
                            <span>Último build: {project.github.lastDeployAt}</span>
                            <button
                              onClick={() => handleSimulateDeploy(project.id)}
                              disabled={isDeploying}
                              className="text-[#1d8fe6] font-bold hover:underline flex items-center gap-1"
                            >
                              <RefreshCw className={`w-3 h-3 ${isDeploying ? 'animate-spin' : ''}`} />
                              <span>{isDeploying ? 'Desplegando...' : 'Re-Deploy'}</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* COL 2: CLOUDFLARE DATA */}
                      <div className="space-y-3 pt-4 md:pt-0 md:pl-5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-lg bg-amber-500 text-white">
                              <Globe className="w-4 h-4" />
                            </div>
                            <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                              Cloudflare Edge & SSL
                            </span>
                          </div>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-800">
                            {project.cloudflare.dnsStatus}
                          </span>
                        </div>

                        <div className="space-y-2 text-xs">
                          <div>
                            <p className="text-[11px] text-slate-400 font-medium">Dominio Primario:</p>
                            <div className="flex items-center justify-between gap-1 bg-slate-50 p-1.5 rounded-lg border border-slate-200 mt-0.5">
                              <span className="font-mono text-slate-800 font-semibold truncate text-[11px]">
                                {project.cloudflare.domain}
                              </span>
                              <CopyButton textToCopy={project.cloudflare.domain} />
                            </div>
                          </div>

                          <div>
                            <p className="text-[11px] text-slate-400 font-medium">Zone ID:</p>
                            <div className="flex items-center justify-between gap-1 bg-slate-50 p-1.5 rounded-lg border border-slate-200 mt-0.5">
                              <span className="font-mono text-slate-600 text-[10px] truncate max-w-[170px]">
                                {project.cloudflare.zoneId}
                              </span>
                              <CopyButton textToCopy={project.cloudflare.zoneId} />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-[11px]">
                            <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                              <p className="text-slate-400">Modo SSL:</p>
                              <p className="font-bold text-emerald-700">{project.cloudflare.sslStatus}</p>
                            </div>
                            <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                              <p className="text-slate-400">SSL Expira:</p>
                              <p className="font-bold text-slate-700">{project.cloudflare.sslExpiresAt}</p>
                            </div>
                          </div>

                          <div className="pt-1 text-right">
                            <button
                              onClick={() => handleTestSslDns(project)}
                              className="text-[11px] font-bold text-amber-700 hover:underline"
                            >
                              Verificar DNS / SSL →
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* COL 3: SUPABASE DATA */}
                      <div className="space-y-3 pt-4 md:pt-0 md:pl-5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-lg bg-emerald-600 text-white">
                              <Database className="w-4 h-4" />
                            </div>
                            <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                              Supabase Backend
                            </span>
                          </div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">
                            {project.supabase.plan} Plan
                          </span>
                        </div>

                        <div className="space-y-2 text-xs">
                          <div>
                            <p className="text-[11px] text-slate-400 font-medium">Project Ref & URL:</p>
                            <div className="flex items-center justify-between gap-1 bg-slate-50 p-1.5 rounded-lg border border-slate-200 mt-0.5">
                              <span className="font-mono text-slate-800 font-semibold truncate text-[11px]">
                                {project.supabase.projectRef}
                              </span>
                              <CopyButton textToCopy={project.supabase.projectUrl} label="URL" />
                            </div>
                          </div>

                          {/* API Key with reveal toggle */}
                          <div>
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="text-slate-400 font-medium">Anon Public Key:</span>
                              <button
                                onClick={() => setVisibleKeyProjectId(isKeysRevealed ? null : project.id)}
                                className="text-[#1d8fe6] font-bold flex items-center gap-1 hover:underline"
                              >
                                {isKeysRevealed ? (
                                  <>
                                    <EyeOff className="w-3 h-3" />
                                    <span>Ocultar</span>
                                  </>
                                ) : (
                                  <>
                                    <Eye className="w-3 h-3" />
                                    <span>Revelar</span>
                                  </>
                                )}
                              </button>
                            </div>
                            <div className="flex items-center justify-between gap-1 bg-slate-50 p-1.5 rounded-lg border border-slate-200 mt-0.5">
                              <span className="font-mono text-slate-600 text-[10px] truncate max-w-[170px]">
                                {isKeysRevealed 
                                  ? project.supabase.anonApiKey 
                                  : '••••••••••••••••••••••••••••••••••••••••'}
                              </span>
                              <CopyButton textToCopy={project.supabase.anonApiKey} />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-[11px]">
                            <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                              <p className="text-slate-400">DB Size:</p>
                              <p className="font-mono font-bold text-slate-800">{project.supabase.dbSizeMb} MB</p>
                            </div>
                            <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                              <p className="text-slate-400">Storage:</p>
                              <p className="font-mono font-bold text-slate-800">{project.supabase.storageSizeMb} MB</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 3: ACTIVITY FEED, DEPLOYMENTS & AUDIT */}
                  {activeTab === 'activity' && (
                    <div className="p-5">
                      <ActivityFeed project={project} />
                    </div>
                  )}

                  {/* Card Bottom Bar */}
                  <div className="px-5 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <div className="flex items-center gap-2 font-mono">
                      <span>Creado: {project.createdAt}</span>
                      <span>•</span>
                      <span>Endpoint: {project.siteApi?.healthCheckEndpoint || `https://${project.cloudflare.domain}/api/health`}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => {
                          if (confirm(`¿Eliminar el proyecto ${project.name}?`)) {
                            deleteProject(project.id);
                          }
                        }}
                        className="text-red-500 hover:text-red-700 flex items-center gap-1 font-semibold"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Eliminar</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
