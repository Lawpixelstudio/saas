import React, { useState } from 'react';
import { X, Key, Globe, Shield, RefreshCw, CheckCircle2, Code2, AlertTriangle, Terminal, Lock } from 'lucide-react';
import { Project, ProjectApiIntegration } from '../../types';
import { useApp } from '../../context/AppContext';
import { CopyButton } from '../common/CopyButton';

interface ProjectApiConfigModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectApiConfigModal: React.FC<ProjectApiConfigModalProps> = ({
  project,
  isOpen,
  onClose,
}) => {
  const { updateProjectApiConfig, showToast } = useApp();

  if (!isOpen || !project) return null;

  const [healthCheckEndpoint, setHealthCheckEndpoint] = useState(
    project.siteApi?.healthCheckEndpoint || `https://${project.cloudflare.domain}/api/health`
  );
  const [pauseWebhookUrl, setPauseWebhookUrl] = useState(
    project.siteApi?.pauseWebhookUrl || `https://${project.cloudflare.domain}/api/pause`
  );
  const [analyticsApiUrl, setAnalyticsApiUrl] = useState(
    project.siteApi?.analyticsApiUrl || `https://${project.cloudflare.domain}/api/analytics`
  );
  const [apiKey, setApiKey] = useState(
    project.siteApi?.apiKey || `goolo_live_${Math.random().toString(36).substring(2, 12)}`
  );
  const [isGeneratingKey, setIsGeneratingKey] = useState(false);

  const handleGenerateKey = () => {
    setIsGeneratingKey(true);
    setTimeout(() => {
      const newKey = `goolo_live_${Math.random().toString(36).substring(2, 10)}_${Math.random().toString(36).substring(2, 10)}`;
      setApiKey(newKey);
      setIsGeneratingKey(false);
      showToast('Nueva API Key de integración generada.', 'info');
    }, 400);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProjectApiConfig(project.id, {
      healthCheckEndpoint: healthCheckEndpoint.trim(),
      pauseWebhookUrl: pauseWebhookUrl.trim(),
      analyticsApiUrl: analyticsApiUrl.trim(),
      apiKey: apiKey.trim(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#38A5F8]/10 text-[#1d8fe6]">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Configuración de API & Webhooks</h2>
              <p className="text-xs text-slate-500 font-mono">{project.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
          <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-3.5 text-blue-900 flex items-start gap-2.5">
            <Shield className="w-4 h-4 text-[#1d8fe6] shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              Integra tus endpoints HTTP o microservicios para permitir a este dashboard
              <strong> consultar la salud</strong>, <strong>pausar o reanudar el sitio</strong> y <strong>obtener métricas de visitas en tiempo real</strong>.
            </p>
          </div>

          {/* Health Check Endpoint */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-700 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-emerald-600" />
                <span>Endpoint de Salud del Sitio (Health Check GET)</span>
              </label>
              <span className="text-[10px] text-slate-400 font-mono">Retorna HTTP 200</span>
            </div>
            <input
              type="url"
              required
              value={healthCheckEndpoint}
              onChange={e => setHealthCheckEndpoint(e.target.value)}
              placeholder="https://tudominio.com/api/health"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono text-[11px] focus:bg-white focus:border-[#38A5F8] focus:outline-hidden"
            />
          </div>

          {/* Pause Webhook URL */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-700 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                <span>Webhook de Pausa / Killswitch (POST)</span>
              </label>
              <span className="text-[10px] text-slate-400 font-mono">Payload: &#123; action: 'pause' | 'resume' &#125;</span>
            </div>
            <input
              type="url"
              required
              value={pauseWebhookUrl}
              onChange={e => setPauseWebhookUrl(e.target.value)}
              placeholder="https://tudominio.com/api/v1/system/status-toggle"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono text-[11px] focus:bg-white focus:border-[#38A5F8] focus:outline-hidden"
            />
          </div>

          {/* Analytics / Real-time Traffic API */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-700 flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-blue-600" />
                <span>Endpoint de Analítica & Visitas (GET)</span>
              </label>
              <span className="text-[10px] text-slate-400 font-mono">Visitas & Tráfico</span>
            </div>
            <input
              type="url"
              value={analyticsApiUrl}
              onChange={e => setAnalyticsApiUrl(e.target.value)}
              placeholder="https://tudominio.com/api/telemetry/traffic"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono text-[11px] focus:bg-white focus:border-[#38A5F8] focus:outline-hidden"
            />
          </div>

          {/* API Bearer Secret Key */}
          <div className="space-y-1 pt-1">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-700 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-slate-600" />
                <span>API Secret Key (Bearer Authentication)</span>
              </label>
              <button
                type="button"
                onClick={handleGenerateKey}
                disabled={isGeneratingKey}
                className="text-[11px] text-[#1d8fe6] font-bold hover:underline flex items-center gap-1"
              >
                <RefreshCw className={`w-3 h-3 ${isGeneratingKey ? 'animate-spin' : ''}`} />
                <span>Regenerar Clave</span>
              </button>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                required
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono text-[11px] focus:bg-white focus:border-[#38A5F8] focus:outline-hidden"
              />
              <CopyButton textToCopy={apiKey} label="Copiar" />
            </div>
          </div>

          {/* Implementation Example Snippet */}
          <div className="p-3 bg-slate-900 text-slate-200 rounded-xl font-mono text-[10px] space-y-1.5 overflow-x-auto">
            <div className="flex items-center justify-between text-slate-400 text-[10px]">
              <span>Ejemplo cURL para Pausa Remota:</span>
              <CopyButton
                textToCopy={`curl -X POST ${pauseWebhookUrl} -H "Authorization: Bearer ${apiKey}" -H "Content-Type: application/json" -d '{"action":"pause","reason":"Maintenance"}'`}
              />
            </div>
            <p className="text-emerald-400 truncate">
              curl -X POST {pauseWebhookUrl} \
            </p>
            <p className="text-slate-400 truncate">
              &nbsp;&nbsp;-H "Authorization: Bearer {apiKey}" \
            </p>
            <p className="text-amber-300 truncate">
              &nbsp;&nbsp;-d '{`{"action":"pause"}`}'
            </p>
          </div>

          {/* Footer actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-[#38A5F8] hover:bg-[#1d8fe6] rounded-xl transition-all shadow-md flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Guardar Configuración</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
