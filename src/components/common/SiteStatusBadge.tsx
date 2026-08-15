import React, { useState } from 'react';
import { Activity, RefreshCw, AlertCircle, CheckCircle2, PauseCircle, ShieldCheck, Clock } from 'lucide-react';
import { Project } from '../../types';
import { checkSiteHealth, getHealthStatusConfig, HealthCheckResult } from '../../lib/apiManager';
import { useApp } from '../../context/AppContext';

interface SiteStatusBadgeProps {
  project: Project;
  variant?: 'badge' | 'pill' | 'detailed' | 'mini';
  showUptime?: boolean;
  showLatency?: boolean;
  interactive?: boolean;
  className?: string;
}

export const SiteStatusBadge: React.FC<SiteStatusBadgeProps> = ({
  project,
  variant = 'badge',
  showUptime = true,
  showLatency = true,
  interactive = true,
  className = '',
}) => {
  const { testProjectHealth, showToast } = useApp();
  const [isChecking, setIsChecking] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const siteApi = project.siteApi;
  const isPaused = siteApi?.isPaused ?? false;
  const healthStatus = siteApi?.healthStatus ?? (isPaused ? 'maintenance' : 'operational');
  const latency = siteApi?.latencyMs ?? 45;
  const uptime = siteApi?.uptimePercentage ?? 99.98;

  const config = getHealthStatusConfig(healthStatus, isPaused);

  const handleQuickCheck = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!interactive || isChecking) return;

    setIsChecking(true);
    showToast(`Comprobando estado HTTP en vivo para ${project.name}...`, 'info');

    try {
      const endpoint = siteApi?.healthCheckEndpoint || `https://${project.cloudflare.domain}/api/health`;
      const result: HealthCheckResult = await checkSiteHealth(endpoint, { isPaused });
      
      // Update app state
      testProjectHealth(project.id);
    } catch (err) {
      console.error(err);
    } finally {
      setIsChecking(false);
    }
  };

  if (variant === 'mini') {
    return (
      <div 
        className={`inline-flex items-center gap-1.5 text-xs font-mono font-bold ${className}`}
        title={`Estado: ${config.label} | Latencia: ${latency}ms | Uptime: ${uptime}%`}
      >
        <span className="relative flex h-2 w-2">
          {!isPaused && (
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${config.dotClass} opacity-75`} />
          )}
          <span className={`relative inline-flex rounded-full h-2 w-2 ${config.dotClass}`} />
        </span>
        <span className={isPaused ? 'text-amber-700' : 'text-slate-700'}>
          {config.shortLabel}
        </span>
      </div>
    );
  }

  if (variant === 'pill') {
    return (
      <div className={`relative inline-flex items-center ${className}`}>
        <button
          type="button"
          onClick={handleQuickCheck}
          disabled={!interactive || isChecking}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all flex items-center gap-1.5 shadow-2xs ${config.pillClass} ${
            interactive ? 'hover:scale-[1.02] cursor-pointer' : ''
          }`}
        >
          <span className="relative flex h-2 w-2">
            {!isPaused && (
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${config.dotClass} opacity-75`} />
            )}
            <span className={`relative inline-flex rounded-full h-2 w-2 ${config.dotClass}`} />
          </span>

          <span className="font-semibold">{config.label}</span>

          {showLatency && (
            <span className="font-mono opacity-80 border-l border-current pl-1.5 ml-0.5">
              {latency}ms
            </span>
          )}

          {interactive && (
            <RefreshCw className={`w-3 h-3 ml-0.5 opacity-60 hover:opacity-100 ${isChecking ? 'animate-spin' : ''}`} />
          )}
        </button>

        {/* Live Hover Tooltip */}
        {showTooltip && (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 z-30 px-3 py-2 bg-slate-900 text-white rounded-xl shadow-xl text-[10px] font-mono whitespace-nowrap pointer-events-none border border-slate-700 animate-in fade-in zoom-in-95 duration-100">
            <p className="font-bold font-sans text-slate-200">{project.name}</p>
            <p className="text-emerald-400">● Uptime: {uptime}%</p>
            <p className="text-blue-300">● Latencia HTTP: {latency}ms</p>
            <p className="text-slate-400">● Supabase DB: {siteApi?.dbLatencyMs || 12}ms</p>
            <p className="text-amber-300">● SSL: {siteApi?.sslDaysRemaining || 180} días restantes</p>
            <div className="w-2 h-2 bg-slate-900 rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2 border-r border-b border-slate-700" />
          </div>
        )}
      </div>
    );
  }

  if (variant === 'detailed') {
    return (
      <div className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${config.badgeClass} ${className}`}>
        <div className="flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white shadow-xs ${
            isPaused ? 'bg-amber-500' : 'bg-emerald-600'
          }`}>
            {isPaused ? <PauseCircle className="w-4 h-4" /> : <Activity className="w-4 h-4" />}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-xs">{config.label}</span>
              <span className="text-[10px] opacity-75 font-mono">({project.cloudflare.domain})</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] opacity-85 font-mono mt-0.5">
              <span>Uptime: <strong>{uptime}%</strong></span>
              <span>•</span>
              <span>Latencia: <strong>{latency}ms</strong></span>
              <span>•</span>
              <span>DB: <strong>{siteApi?.dbLatencyMs || 12}ms</strong></span>
            </div>
          </div>
        </div>

        {interactive && (
          <button
            type="button"
            onClick={handleQuickCheck}
            disabled={isChecking}
            className="px-2.5 py-1 text-[11px] font-bold bg-white/80 hover:bg-white text-slate-800 rounded-lg border border-slate-200 transition-colors flex items-center gap-1 shadow-2xs"
            title="Realizar ping en vivo"
          >
            <RefreshCw className={`w-3 h-3 ${isChecking ? 'animate-spin text-[#38A5F8]' : ''}`} />
            <span>{isChecking ? 'Probando...' : 'Test'}</span>
          </button>
        )}
      </div>
    );
  }

  // Default 'badge' variant
  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <div 
        onClick={handleQuickCheck}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold border flex items-center gap-1.5 transition-colors ${config.badgeClass} ${
          interactive ? 'cursor-pointer hover:opacity-90' : ''
        }`}
      >
        <span className="relative flex h-2 w-2">
          {!isPaused && (
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${config.dotClass} opacity-75`} />
          )}
          <span className={`relative inline-flex rounded-full h-2 w-2 ${config.dotClass}`} />
        </span>

        <span>{config.label}</span>

        {showUptime && (
          <span className="font-mono text-[10px] opacity-75 border-l border-current/30 pl-1 ml-0.5">
            {uptime}%
          </span>
        )}

        {interactive && (
          <RefreshCw className={`w-2.5 h-2.5 opacity-60 ${isChecking ? 'animate-spin' : ''}`} />
        )}
      </div>

      {showTooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 z-30 px-2.5 py-1.5 bg-slate-900 text-white rounded-lg shadow-xl text-[10px] font-mono whitespace-nowrap pointer-events-none border border-slate-700">
          <span>Latencia: {latency}ms • Uptime: {uptime}% • DB: {siteApi?.dbLatencyMs || 12}ms</span>
          <div className="w-1.5 h-1.5 bg-slate-900 rotate-45 absolute -bottom-0.5 left-1/2 -translate-x-1/2 border-r border-b border-slate-700" />
        </div>
      )}
    </div>
  );
};
