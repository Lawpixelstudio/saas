import React, { useState } from 'react';
import { 
  Activity, 
  PauseCircle, 
  PlayCircle, 
  RefreshCw, 
  ShieldCheck, 
  Users, 
  Globe, 
  Database, 
  Zap, 
  Clock, 
  Settings2, 
  AlertTriangle, 
  CheckCircle2, 
  BarChart3, 
  TrendingUp, 
  Smartphone, 
  Laptop, 
  Tablet, 
  Terminal, 
  Radio, 
  Flame,
  Key,
  ExternalLink
} from 'lucide-react';
import { Project } from '../../types';
import { useApp } from '../../context/AppContext';
import { TrafficAreaChart } from './TrafficAreaChart';
import { ProjectApiConfigModal } from './ProjectApiConfigModal';
import { CopyButton } from '../common/CopyButton';

interface ProjectTelemetryDashboardProps {
  project: Project;
}

export const ProjectTelemetryDashboard: React.FC<ProjectTelemetryDashboardProps> = ({ project }) => {
  const { toggleProjectPause, testProjectHealth, showToast } = useApp();
  const [isTesting, setIsTesting] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [pauseReasonInput, setPauseReasonInput] = useState('');
  const [showPausePrompt, setShowPausePrompt] = useState(false);

  const siteApi = project.siteApi;
  const isPaused = siteApi.isPaused;

  const handleRunHealthCheck = () => {
    setIsTesting(true);
    showToast(`Comprobando salud en vivo para ${project.name}...`, 'info');
    setTimeout(() => {
      testProjectHealth(project.id);
      setIsTesting(false);
    }, 900);
  };

  const handleTogglePause = () => {
    if (!isPaused) {
      // Prompt for optional reason
      setShowPausePrompt(true);
    } else {
      toggleProjectPause(project.id);
      setShowPausePrompt(false);
    }
  };

  const handleConfirmPause = (e: React.FormEvent) => {
    e.preventDefault();
    toggleProjectPause(project.id, pauseReasonInput.trim() || 'Mantenimiento preventivo de software y base de datos');
    setShowPausePrompt(false);
    setPauseReasonInput('');
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* 1. TOP HERO CONTROL & REMOTE KILLSWITCH RIBBON */}
      <div className={`p-4 rounded-2xl border transition-all ${
        isPaused 
          ? 'bg-amber-500/10 border-amber-300 ring-1 ring-amber-400/30' 
          : 'bg-slate-900 text-white border-slate-800 shadow-sm'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Status badge & title */}
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-md ${
              isPaused 
                ? 'bg-amber-500 text-white animate-pulse' 
                : 'bg-gradient-to-tr from-emerald-500 to-teal-400 text-white'
            }`}>
              {isPaused ? <PauseCircle className="w-6 h-6" /> : <Activity className="w-6 h-6" />}
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-xs font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                  isPaused 
                    ? 'bg-amber-500 text-white' 
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                }`}>
                  {isPaused ? 'Sitio Pausado (503)' : '🟢 100% Operativo (200 OK)'}
                </span>

                <span className={`text-xs font-bold ${isPaused ? 'text-amber-900' : 'text-slate-300'}`}>
                  {project.cloudflare.domain}
                </span>
              </div>

              <p className={`text-xs mt-1 ${isPaused ? 'text-amber-800 font-medium' : 'text-slate-400'}`}>
                {isPaused 
                  ? `Pausado el ${siteApi.pausedAt || 'recientemente'}: ${siteApi.pauseReason || 'Modo Mantenimiento Activo'}` 
                  : `Último chequeo: ${siteApi.lastHealthCheck} • Latencia: ${siteApi.latencyMs}ms • Uptime: ${siteApi.uptimePercentage}%`}
              </p>
            </div>
          </div>

          {/* Quick Action Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Live Health Ping Test */}
            <button
              onClick={handleRunHealthCheck}
              disabled={isTesting}
              className={`px-3 py-2 text-xs font-bold rounded-xl border transition-all flex items-center gap-1.5 shadow-xs ${
                isPaused
                  ? 'bg-white hover:bg-slate-50 text-slate-700 border-amber-200'
                  : 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700'
              }`}
              title="Realiza una petición en vivo para verificar la respuesta HTTP y la base de datos"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin text-[#38A5F8]' : ''}`} />
              <span>{isTesting ? 'Verificando...' : 'Comprobar Salud en Vivo'}</span>
            </button>

            {/* Remote Pause / Resume Toggle */}
            <button
              onClick={handleTogglePause}
              className={`px-4 py-2 text-xs font-black rounded-xl transition-all shadow-md flex items-center gap-1.5 ${
                isPaused
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white ring-2 ring-emerald-400/40 animate-bounce'
                  : 'bg-amber-600 hover:bg-amber-500 text-white'
              }`}
            >
              {isPaused ? (
                <>
                  <PlayCircle className="w-4 h-4" />
                  <span>Reanudar Sitio Web</span>
                </>
              ) : (
                <>
                  <PauseCircle className="w-4 h-4" />
                  <span>Pausar Página</span>
                </>
              )}
            </button>

            {/* Settings Modal */}
            <button
              onClick={() => setIsConfigModalOpen(true)}
              className={`p-2 rounded-xl border transition-colors ${
                isPaused
                  ? 'bg-white hover:bg-slate-100 text-slate-700 border-amber-200'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
              }`}
              title="Configurar URLs de endpoints API y API Keys"
            >
              <Settings2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Reason Modal Prompt inline if requesting pause */}
        {showPausePrompt && (
          <form onSubmit={handleConfirmPause} className="mt-4 pt-3 border-t border-slate-800 text-xs space-y-2 animate-in fade-in">
            <div className="flex items-center justify-between text-slate-200">
              <span className="font-bold text-amber-400 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>¿Deseas activar el modo mantenimiento y pausar el sitio?</span>
              </span>
              <button
                type="button"
                onClick={() => setShowPausePrompt(false)}
                className="text-slate-400 hover:text-white"
              >
                Cancelar
              </button>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={pauseReasonInput}
                onChange={e => setPauseReasonInput(e.target.value)}
                placeholder="Motivo de la pausa (ej. Actualización de catálogo y mantenimiento programado)..."
                className="flex-1 px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:outline-hidden focus:border-amber-400"
              />
              <button
                type="submit"
                className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl transition-colors"
              >
                Confirmar Pausa
              </button>
            </div>
          </form>
        )}
      </div>

      {/* 2. REAL-TIME TRAFFIC & ACTIVE VISITORS KPIS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Active Now */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              En Vivo Ahora
            </span>
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
            </div>
          </div>
          <div className="mt-1.5 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-900 font-mono">
              {isPaused ? 0 : siteApi.liveActiveVisitors}
            </span>
            <span className="text-xs font-bold text-emerald-600">usuarios</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">Tráfico concurrente en vivo</p>
        </div>

        {/* Visits Today */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Visitas Hoy
            </span>
            <div className="w-6 h-6 rounded-lg bg-blue-50 text-[#1d8fe6] flex items-center justify-center">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-1.5 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-900 font-mono">
              {siteApi.visitsToday.toLocaleString()}
            </span>
            <span className="text-xs font-bold text-blue-600 font-mono">
              +{Math.round((siteApi.visitsToday / (siteApi.visitsThisWeek / 7 || 1) - 1) * 100)}%
            </span>
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">Páginas vistas: {siteApi.pageViewsToday.toLocaleString()}</p>
        </div>

        {/* Requests Per Minute */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Peticiones / Min
            </span>
            <div className="w-6 h-6 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Zap className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-1.5 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-900 font-mono">
              {isPaused ? 0 : siteApi.requestsPerMinute}
            </span>
            <span className="text-xs font-bold text-purple-600">req/min</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">Ancho de banda: {siteApi.bandwidthMbToday} MB</p>
        </div>

        {/* Latency / Health */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Latencia Edge
            </span>
            <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${
              siteApi.latencyMs < 75 ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
            }`}>
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-1.5 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-900 font-mono">
              {siteApi.latencyMs}
            </span>
            <span className="text-xs font-bold text-slate-500 font-mono">ms</span>
            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700">
              Óptima
            </span>
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">DB Postgres: {siteApi.dbLatencyMs}ms</p>
        </div>
      </div>

      {/* 3. MIDDLE SECTION: TRAFFIC GRAPH & TOP PAGES */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Visual Traffic Chart (2 cols) */}
        <div className="lg:col-span-2 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <TrafficAreaChart data={siteApi.hourlyTraffic} />
          
          {/* Traffic Summary Badges */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-[11px]">
            <div className="bg-slate-50 p-2 rounded-xl text-center">
              <span className="text-slate-400 block text-[10px]">Esta Semana</span>
              <strong className="text-slate-800 font-mono font-bold text-xs">{siteApi.visitsThisWeek.toLocaleString()}</strong>
            </div>
            <div className="bg-slate-50 p-2 rounded-xl text-center">
              <span className="text-slate-400 block text-[10px]">Este Mes</span>
              <strong className="text-slate-800 font-mono font-bold text-xs">{siteApi.visitsThisMonth.toLocaleString()}</strong>
            </div>
            <div className="bg-slate-50 p-2 rounded-xl text-center">
              <span className="text-slate-400 block text-[10px]">Tasa de Error</span>
              <strong className="text-emerald-700 font-mono font-bold text-xs">{siteApi.errorRatePercent}%</strong>
            </div>
          </div>
        </div>

        {/* Top Pages & Device Breakdown (1 col) */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                <span>Páginas Más Visitadas</span>
              </span>
              <span className="text-[10px] text-slate-400">Vistas hoy</span>
            </div>

            <div className="space-y-2">
              {siteApi.topPages.map((page, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-mono text-slate-700 truncate max-w-[150px]">{page.path}</span>
                    <span className="font-mono font-bold text-slate-900">{page.views.toLocaleString()}</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#38A5F8] rounded-full"
                      style={{ width: `${page.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Device Breakdown */}
          <div className="pt-3 border-t border-slate-100">
            <span className="text-[11px] font-bold text-slate-700 block mb-2">Dispositivos de Entrada</span>
            <div className="grid grid-cols-3 gap-1.5 text-center text-[10px]">
              <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-200">
                <Smartphone className="w-3.5 h-3.5 text-blue-600 mx-auto mb-0.5" />
                <p className="font-bold text-slate-800">{siteApi.deviceBreakdown.mobile}%</p>
                <span className="text-slate-400">Móvil</span>
              </div>
              <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-200">
                <Laptop className="w-3.5 h-3.5 text-purple-600 mx-auto mb-0.5" />
                <p className="font-bold text-slate-800">{siteApi.deviceBreakdown.desktop}%</p>
                <span className="text-slate-400">Desktop</span>
              </div>
              <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-200">
                <Tablet className="w-3.5 h-3.5 text-emerald-600 mx-auto mb-0.5" />
                <p className="font-bold text-slate-800">{siteApi.deviceBreakdown.tablet}%</p>
                <span className="text-slate-400">Tablet</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. HEALTH REPORT LOG & API INTEGRATION CONSOLE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* Diagnostic Terminal Output */}
        <div className="bg-slate-950 text-slate-200 p-4 rounded-2xl border border-slate-800 shadow-sm space-y-2 font-mono">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5" />
              <span>Consola de Diagnóstico & Health Check</span>
            </span>
            <span className="text-[10px] text-slate-400">HTTP {siteApi.httpStatusCode}</span>
          </div>

          <div className="text-[11px] space-y-1.5 text-slate-300">
            <p className="flex items-center gap-2">
              <span className="text-emerald-400">✓</span>
              <span>Endpoint: <strong className="text-white">{siteApi.healthCheckEndpoint}</strong></span>
            </p>
            <p className="flex items-center gap-2">
              <span className="text-emerald-400">✓</span>
              <span>Cloudflare Edge Cache: <strong className="text-amber-300">{siteApi.edgeCacheStatus}</strong> (WAF Activo)</span>
            </p>
            <p className="flex items-center gap-2">
              <span className="text-emerald-400">✓</span>
              <span>Supabase Postgres Connection: <strong className="text-emerald-300">{siteApi.dbLatencyMs}ms</strong></span>
            </p>
            <p className="flex items-center gap-2">
              <span className="text-emerald-400">✓</span>
              <span>Certificado SSL: <strong className="text-white">Válido ({siteApi.sslDaysRemaining} días restantes)</strong></span>
            </p>
            {siteApi.lastTestLog && (
              <div className="mt-2 p-2 bg-slate-900 rounded-lg text-[10px] text-blue-300 border border-slate-800">
                {siteApi.lastTestLog}
              </div>
            )}
          </div>
        </div>

        {/* API Developer Quick Webhook & Keys Card */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-[#38A5F8]" />
              <span>Endpoints del Proyecto & API Key</span>
            </span>
            <button
              onClick={() => setIsConfigModalOpen(true)}
              className="text-[11px] text-[#1d8fe6] font-bold hover:underline"
            >
              Editar Endpoints →
            </button>
          </div>

          <div className="space-y-2 text-[11px]">
            <div>
              <p className="text-slate-400 text-[10px]">Webhook de Pausa / Control Remoto:</p>
              <div className="flex items-center justify-between gap-1 bg-slate-50 p-1.5 rounded-lg border border-slate-200 mt-0.5">
                <span className="font-mono text-slate-700 truncate max-w-[240px]">
                  {siteApi.pauseWebhookUrl}
                </span>
                <CopyButton textToCopy={siteApi.pauseWebhookUrl || ''} />
              </div>
            </div>

            <div>
              <p className="text-slate-400 text-[10px]">API Key de Integración (Bearer Auth):</p>
              <div className="flex items-center justify-between gap-1 bg-slate-50 p-1.5 rounded-lg border border-slate-200 mt-0.5">
                <span className="font-mono text-slate-700 truncate max-w-[240px]">
                  {siteApi.apiKey ? `${siteApi.apiKey.substring(0, 14)}••••••••` : 'No configurada'}
                </span>
                <CopyButton textToCopy={siteApi.apiKey || ''} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL CONFIG */}
      <ProjectApiConfigModal
        project={project}
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
      />
    </div>
  );
};
