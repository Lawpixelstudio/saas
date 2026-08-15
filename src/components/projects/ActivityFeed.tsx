import React, { useState, useMemo } from 'react';
import { 
  Rocket, 
  Settings2, 
  AlertTriangle, 
  GitBranch, 
  CheckCircle2, 
  Clock, 
  Search, 
  Filter, 
  Plus, 
  RotateCcw, 
  ChevronDown, 
  ChevronUp, 
  Terminal, 
  ShieldCheck, 
  Database, 
  Globe, 
  Zap, 
  Server, 
  Activity, 
  Trash2, 
  ArrowRight,
  ExternalLink,
  Info,
  ShieldAlert,
  SlidersHorizontal,
  RefreshCw,
  Eye,
  BellRing
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { 
  Project, 
  ProjectActivity, 
  ProjectActivityType, 
  ProjectActivitySeverity 
} from '../../types';
import { CopyButton } from '../common/CopyButton';
import { AddActivityModal } from './AddActivityModal';

interface ActivityFeedProps {
  project: Project;
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ project }) => {
  const { 
    projectActivities, 
    deleteProjectActivity, 
    resolveActivityAlert, 
    rollbackProjectDeployment,
    addProjectActivity,
    updateProject,
    testProjectHealth,
    showToast 
  } = useApp();

  // Component states
  const [activeTypeTab, setActiveTypeTab] = useState<'all' | ProjectActivityType>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<'all' | ProjectActivitySeverity>('all');
  const [expandedLogs, setExpandedLogs] = useState<Record<string, boolean>>({});
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSimulatingDeploy, setIsSimulatingDeploy] = useState(false);

  // Filter activities for this project
  const projectEvents = useMemo(() => {
    return projectActivities.filter(a => a.projectId === project.id);
  }, [projectActivities, project.id]);

  // Counts by category
  const deployEventsCount = projectEvents.filter(a => a.type === 'deployment').length;
  const configEventsCount = projectEvents.filter(a => a.type === 'config_change').length;
  const alertEventsCount = projectEvents.filter(a => a.type === 'system_alert').length;
  const activeAlertsCount = projectEvents.filter(a => a.type === 'system_alert' && !a.metadata?.resolved && a.severity !== 'success').length;

  // Filtered list
  const filteredEvents = useMemo(() => {
    return projectEvents.filter(event => {
      // Type tab filter
      if (activeTypeTab !== 'all' && event.type !== activeTypeTab) return false;

      // Severity filter
      if (selectedSeverity !== 'all' && event.severity !== selectedSeverity) return false;

      // Search filter
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesTitle = event.title.toLowerCase().includes(query);
        const matchesDesc = event.description.toLowerCase().includes(query);
        const matchesAuthor = event.author?.toLowerCase().includes(query);
        const matchesCommit = event.metadata?.commitHash?.toLowerCase().includes(query);
        const matchesField = event.metadata?.changedField?.toLowerCase().includes(query);
        const matchesMetric = event.metadata?.metricName?.toLowerCase().includes(query);

        if (!matchesTitle && !matchesDesc && !matchesAuthor && !matchesCommit && !matchesField && !matchesMetric) {
          return false;
        }
      }

      return true;
    });
  }, [projectEvents, activeTypeTab, selectedSeverity, searchTerm]);

  // Toggle log expansion
  const toggleLogs = (activityId: string) => {
    setExpandedLogs(prev => ({ ...prev, [activityId]: !prev[activityId] }));
  };

  // Quick simulate deploy
  const handleTriggerQuickDeploy = () => {
    setIsSimulatingDeploy(true);
    showToast('Iniciando pipeline de construcción CI/CD en GitHub Actions...', 'info');

    const randomHash = Math.random().toString(36).substring(2, 9);
    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16);

    setTimeout(() => {
      // Update project github state
      updateProject(project.id, {
        github: {
          ...project.github,
          commitHash: randomHash,
          commitMessage: `feat(core): automated edge optimization and bundle minification`,
          lastDeployStatus: 'success',
          lastDeployAt: nowStr
        }
      });

      // Add to activity feed
      addProjectActivity({
        projectId: project.id,
        type: 'deployment',
        title: `Deploy Producción (${randomHash})`,
        description: 'Compilación y despliegue exitoso desde rama main con optimizaciones en assets.',
        severity: 'success',
        author: 'GitHub Actions (CI/CD)',
        metadata: {
          commitHash: randomHash,
          commitMessage: 'feat(core): automated edge optimization and bundle minification',
          branch: project.github.branch || 'main',
          deployDurationSec: 36,
          deployStatus: 'success',
          environment: 'production',
          rollbackAvailable: true,
          deployLogs: [
            'Triggered by push to refs/heads/main',
            'Running automated test suite: 28 tests passing (0 failures)',
            'Vite bundle compiled in 2.8s',
            'Publishing assets to Cloudflare Global Edge Network (275+ PoPs)...',
            'Purging stale edge HTML cache tags...',
            'Health Check verified: HTTP 200 OK (38ms latency)'
          ]
        }
      });

      setIsSimulatingDeploy(false);
      showToast(`¡Despliegue completado con éxito! Commit ${randomHash} en producción.`, 'success');
    }, 1200);
  };

  // Severity badge helpers
  const getSeverityBadge = (severity: ProjectActivitySeverity) => {
    switch (severity) {
      case 'critical':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-[#ffe4ee] text-[#D81159] border border-red-200">
            Crítico
          </span>
        );
      case 'warning':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
            Aviso
          </span>
        );
      case 'success':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Éxito
          </span>
        );
      case 'info':
      default:
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
            Info
          </span>
        );
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in">
      {/* SUMMARY STATS STRIP */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-100 text-[#1d8fe6]">
              <Rocket className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Despliegues Totales</p>
              <p className="text-sm font-black text-slate-900 font-mono">{deployEventsCount} builds</p>
            </div>
          </div>
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
            100% OK
          </span>
        </div>

        <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-100 text-indigo-700">
              <Settings2 className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Cambios de Config</p>
              <p className="text-sm font-black text-slate-900 font-mono">{configEventsCount} auditados</p>
            </div>
          </div>
          <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-200">
            Audit Trail
          </span>
        </div>

        <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-lg ${activeAlertsCount > 0 ? 'bg-[#ffe4ee] text-[#D81159]' : 'bg-emerald-100 text-emerald-700'}`}>
              {activeAlertsCount > 0 ? <AlertTriangle className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Alertas de Sistema</p>
              <p className="text-sm font-black text-slate-900 font-mono">
                {activeAlertsCount > 0 ? `${activeAlertsCount} activa(s)` : '0 Pendientes'}
              </p>
            </div>
          </div>
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
            activeAlertsCount > 0 ? 'bg-[#ffe4ee] text-[#D81159] border-red-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
          }`}>
            {activeAlertsCount > 0 ? 'Revisión Req.' : 'Nominal'}
          </span>
        </div>

        <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-slate-200 text-slate-800">
              <GitBranch className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Último Commit</p>
              <p className="text-xs font-mono font-black text-slate-800 truncate max-w-[110px]">
                {project.github.commitHash || 'main'}
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono text-slate-500">
            {project.github.branch || 'main'}
          </span>
        </div>
      </div>

      {/* ACTION CONTROLS & FILTER BAR */}
      <div className="bg-slate-50/50 p-3.5 rounded-xl border border-slate-200 space-y-3">
        {/* Top Controls Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-200/70 p-1 rounded-xl text-xs font-bold overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTypeTab('all')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 shrink-0 ${
                activeTypeTab === 'all' 
                  ? 'bg-white text-slate-900 shadow-2xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Todos los Eventos</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 font-mono">
                {projectEvents.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTypeTab('deployment')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 shrink-0 ${
                activeTypeTab === 'deployment' 
                  ? 'bg-white text-[#1d8fe6] shadow-2xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Rocket className="w-3.5 h-3.5" />
              <span>Despliegues & CI/CD</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-blue-50 text-blue-700 font-mono">
                {deployEventsCount}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTypeTab('config_change')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 shrink-0 ${
                activeTypeTab === 'config_change' 
                  ? 'bg-white text-indigo-700 shadow-2xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Settings2 className="w-3.5 h-3.5" />
              <span>Cambios de Config</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-indigo-50 text-indigo-700 font-mono">
                {configEventsCount}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTypeTab('system_alert')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 shrink-0 ${
                activeTypeTab === 'system_alert' 
                  ? 'bg-white text-amber-700 shadow-2xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Alertas del Sistema</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                activeAlertsCount > 0 ? 'bg-[#ffe4ee] text-[#D81159]' : 'bg-slate-100 text-slate-600'
              }`}>
                {alertEventsCount}
              </span>
            </button>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <button
              type="button"
              onClick={handleTriggerQuickDeploy}
              disabled={isSimulatingDeploy}
              className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-all flex items-center gap-1.5 shadow-2xs disabled:opacity-50"
            >
              <Zap className={`w-3.5 h-3.5 text-amber-500 ${isSimulatingDeploy ? 'animate-spin' : ''}`} />
              <span>{isSimulatingDeploy ? 'Compilando...' : 'Simular Deploy CI/CD'}</span>
            </button>

            <button
              type="button"
              onClick={() => testProjectHealth(project.id)}
              className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-all flex items-center gap-1.5 shadow-2xs"
            >
              <Activity className="w-3.5 h-3.5 text-emerald-600" />
              <span>Test Salud</span>
            </button>

            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="px-3 py-1.5 text-xs font-black text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all flex items-center gap-1.5 shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Registrar Evento</span>
            </button>
          </div>
        </div>

        {/* Search & Severity Filters */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
          <div className="relative flex-1 w-full">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Buscar por commit, autor, métrica, campo modificado o palabra clave..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden focus:border-[#38A5F8]"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={selectedSeverity}
              onChange={e => setSelectedSeverity(e.target.value as any)}
              className="px-3 py-1.5 text-xs font-semibold bg-white border border-slate-200 rounded-xl text-slate-700 focus:outline-hidden w-full sm:w-auto"
            >
              <option value="all">Todas las Severidades</option>
              <option value="success">Solo Éxito (Success)</option>
              <option value="info">Solo Información (Info)</option>
              <option value="warning">Solo Advertencias (Warning)</option>
              <option value="critical">Solo Críticas (Critical)</option>
            </select>

            {(searchTerm || selectedSeverity !== 'all' || activeTypeTab !== 'all') && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedSeverity('all');
                  setActiveTypeTab('all');
                }}
                className="px-2.5 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-200/50 rounded-lg transition-colors shrink-0"
              >
                Limpiar Filtros
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ACTIVITY TIMELINE FEED */}
      <div className="space-y-3">
        {filteredEvents.length === 0 ? (
          <div className="p-10 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
            <Activity className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <h4 className="text-xs font-bold text-slate-700">No hay eventos registrados con estos filtros</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Prueba cambiando los términos de búsqueda o pulsa "Registrar Evento" para añadir un registro manual.
            </p>
          </div>
        ) : (
          <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
            {filteredEvents.map(event => {
              const isLogsOpen = expandedLogs[event.id];

              return (
                <div 
                  key={event.id}
                  id={`activity-item-${event.id}`}
                  className="relative group bg-white rounded-xl border border-slate-200/90 shadow-2xs hover:shadow-xs transition-all p-4"
                >
                  {/* Timeline Marker Dot */}
                  <div className={`absolute -left-6 top-4 -translate-x-1/2 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center shadow-2xs ${
                    event.type === 'deployment' ? 'bg-[#1d8fe6]' :
                    event.type === 'config_change' ? 'bg-indigo-600' :
                    event.severity === 'critical' ? 'bg-[#D81159]' :
                    event.severity === 'warning' ? 'bg-amber-500' :
                    'bg-emerald-500'
                  }`}>
                    <span className="w-1 h-1 rounded-full bg-white" />
                  </div>

                  {/* EVENT HEADER */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Type Icon Badge */}
                      <span className={`p-1.5 rounded-lg flex items-center justify-center shrink-0 ${
                        event.type === 'deployment' ? 'bg-blue-50 text-[#1d8fe6]' :
                        event.type === 'config_change' ? 'bg-indigo-50 text-indigo-700' :
                        event.severity === 'critical' ? 'bg-[#ffe4ee] text-[#D81159]' :
                        event.severity === 'warning' ? 'bg-amber-50 text-amber-800' :
                        'bg-emerald-50 text-emerald-700'
                      }`}>
                        {event.type === 'deployment' ? <Rocket className="w-3.5 h-3.5" /> :
                         event.type === 'config_change' ? <Settings2 className="w-3.5 h-3.5" /> :
                         <AlertTriangle className="w-3.5 h-3.5" />}
                      </span>

                      <h4 className="text-xs font-black text-slate-900">
                        {event.title}
                      </h4>

                      {/* Severity Pill */}
                      {getSeverityBadge(event.severity)}

                      {/* Deployment Environment / Status */}
                      {event.type === 'deployment' && event.metadata?.environment && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-slate-100 text-slate-700 uppercase">
                          {event.metadata.environment}
                        </span>
                      )}

                      {/* Config Category */}
                      {event.type === 'config_change' && event.metadata?.category && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 text-indigo-700 uppercase tracking-wider">
                          {event.metadata.category}
                        </span>
                      )}

                      {/* Alert Resolved Status */}
                      {event.type === 'system_alert' && (
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          event.metadata?.resolved 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                            : 'bg-[#ffe4ee] text-[#D81159] border border-red-200 animate-pulse'
                        }`}>
                          {event.metadata?.resolved ? '✓ Resuelta' : '⚠️ Activa'}
                        </span>
                      )}
                    </div>

                    {/* Timestamp and Author */}
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 shrink-0">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span className="font-mono">{event.timestamp}</span>
                      {event.author && (
                        <>
                          <span>•</span>
                          <span className="text-slate-600 font-medium">{event.author}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* DESCRIPTION */}
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {event.description}
                  </p>

                  {/* TYPE SPECIFIC DETAILS */}
                  {/* 1. DEPLOYMENT METADATA */}
                  {event.type === 'deployment' && (
                    <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2.5">
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-2 flex-wrap">
                          {event.metadata?.commitHash && (
                            <div className="flex items-center gap-1 bg-white px-2 py-0.5 rounded-md border border-slate-200 font-mono text-[11px] font-bold text-slate-800">
                              <GitBranch className="w-3 h-3 text-slate-400" />
                              <span>{event.metadata.commitHash}</span>
                              <CopyButton textToCopy={event.metadata.commitHash} />
                            </div>
                          )}

                          {event.metadata?.branch && (
                            <span className="font-mono text-[11px] text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                              rama: {event.metadata.branch}
                            </span>
                          )}

                          {event.metadata?.deployDurationSec && (
                            <span className="text-[11px] text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200 font-mono">
                              duración: {event.metadata.deployDurationSec}s
                            </span>
                          )}
                        </div>

                        {/* Rollback & Log Controls */}
                        <div className="flex items-center gap-2">
                          {event.metadata?.rollbackAvailable && event.metadata.commitHash && (
                            <button
                              type="button"
                              onClick={() => rollbackProjectDeployment(
                                project.id, 
                                event.metadata!.commitHash!,
                                event.metadata?.commitMessage || event.title
                              )}
                              className="px-2.5 py-1 text-[11px] font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors flex items-center gap-1"
                              title="Hacer rollback instantáneo a este commit"
                            >
                              <RotateCcw className="w-3 h-3" />
                              <span>Rollback a este Commit</span>
                            </button>
                          )}

                          {event.metadata?.deployLogs && event.metadata.deployLogs.length > 0 && (
                            <button
                              type="button"
                              onClick={() => toggleLogs(event.id)}
                              className="px-2.5 py-1 text-[11px] font-bold text-slate-600 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors flex items-center gap-1"
                            >
                              <Terminal className="w-3 h-3 text-slate-500" />
                              <span>{isLogsOpen ? 'Ocultar Logs' : 'Ver Logs'}</span>
                              {isLogsOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Commit Message Box */}
                      {event.metadata?.commitMessage && (
                        <p className="text-[11px] font-mono text-slate-600 bg-white p-2 rounded-lg border border-slate-200/70">
                          {event.metadata.commitMessage}
                        </p>
                      )}

                      {/* Expandable Deploy Terminal Logs */}
                      {isLogsOpen && event.metadata?.deployLogs && (
                        <div className="bg-slate-900 text-slate-100 font-mono text-[11px] p-3 rounded-lg space-y-1 overflow-x-auto animate-in fade-in">
                          <div className="flex items-center justify-between pb-1 mb-1 border-b border-slate-800 text-[10px] text-slate-400">
                            <span>Deploy Build Console Logs</span>
                            <span>Status: 200 SUCCESS</span>
                          </div>
                          {event.metadata.deployLogs.map((logLine, idx) => (
                            <div key={idx} className="flex items-start gap-2">
                              <span className="text-slate-500 select-none">{idx + 1}.</span>
                              <span className={idx === event.metadata!.deployLogs!.length - 1 ? 'text-emerald-400 font-bold' : 'text-slate-300'}>
                                {logLine}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* 2. CONFIG CHANGE METADATA (VISUAL DIFF) */}
                  {event.type === 'config_change' && event.metadata && (
                    <div className="mt-3 p-3 bg-indigo-50/40 rounded-xl border border-indigo-100 space-y-2">
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                        <span className="text-[11px] text-indigo-900 font-bold">
                          Parámetro: <code className="bg-white px-1.5 py-0.5 rounded border border-indigo-200 text-indigo-700">{event.metadata.changedField || 'Config'}</code>
                        </span>
                      </div>

                      {/* Diff Visual Box */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {event.metadata.previousValue && (
                          <div className="bg-white p-2 rounded-lg border border-slate-200 space-y-0.5">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Valor Previo:</span>
                            <p className="font-mono text-[11px] text-slate-600 line-through opacity-80 break-words">
                              {event.metadata.previousValue}
                            </p>
                          </div>
                        )}

                        {event.metadata.newValue && (
                          <div className="bg-emerald-50/70 p-2 rounded-lg border border-emerald-200 space-y-0.5">
                            <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">Nuevo Valor:</span>
                            <p className="font-mono text-[11px] font-bold text-emerald-900 break-words">
                              {event.metadata.newValue}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* 3. SYSTEM ALERT METADATA */}
                  {event.type === 'system_alert' && event.metadata && (
                    <div className={`mt-3 p-3 rounded-xl border space-y-2 ${
                      event.metadata.resolved ? 'bg-slate-50 border-slate-200' : 'bg-amber-50/50 border-amber-200'
                    }`}>
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-3 flex-wrap">
                          {event.metadata.metricName && (
                            <span className="text-[11px] font-semibold text-slate-700">
                              Métrica: <strong className="text-slate-900">{event.metadata.metricName}</strong>
                            </span>
                          )}

                          {event.metadata.metricValue && (
                            <span className="font-mono text-[11px] bg-white px-2 py-0.5 rounded border border-slate-200 font-bold text-slate-800">
                              Detectado: {event.metadata.metricValue}
                            </span>
                          )}

                          {event.metadata.threshold && (
                            <span className="font-mono text-[11px] text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                              Umbral SLA: {event.metadata.threshold}
                            </span>
                          )}
                        </div>

                        {/* Resolve Action Button */}
                        {!event.metadata.resolved && (
                          <button
                            type="button"
                            onClick={() => resolveActivityAlert(event.id)}
                            className="px-2.5 py-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Marcar como Resuelta</span>
                          </button>
                        )}

                        {event.metadata.resolved && event.metadata.resolvedAt && (
                          <span className="text-[11px] text-emerald-700 font-medium">
                            Resuelta a las {event.metadata.resolvedAt}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Card Delete Action */}
                  <div className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => deleteProjectActivity(event.id)}
                      className="p-1 rounded text-slate-400 hover:text-[#D81159] hover:bg-slate-100 transition-colors"
                      title="Eliminar este evento del historial"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* MANUAL ACTIVITY LOGGER MODAL */}
      <AddActivityModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        project={project}
      />
    </div>
  );
};
