import React, { useState } from 'react';
import { 
  X, 
  Rocket, 
  Settings2, 
  AlertTriangle, 
  GitBranch, 
  Database, 
  Globe, 
  ShieldCheck, 
  Terminal,
  Plus
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ProjectActivityType, ProjectActivitySeverity, Project } from '../../types';

interface AddActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
}

export const AddActivityModal: React.FC<AddActivityModalProps> = ({ isOpen, onClose, project }) => {
  const { addProjectActivity, showToast } = useApp();

  const [type, setType] = useState<ProjectActivityType>('deployment');
  const [severity, setSeverity] = useState<ProjectActivitySeverity>('info');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [author, setAuthor] = useState('Lead DevOps');

  // Deployment specifics
  const [commitHash, setCommitHash] = useState('');
  const [commitMessage, setCommitMessage] = useState('');
  const [branch, setBranch] = useState(project.github.branch || 'main');
  const [deployDurationSec, setDeployDurationSec] = useState(35);
  const [environment, setEnvironment] = useState<'production' | 'staging' | 'preview'>('production');

  // Config change specifics
  const [configCategory, setConfigCategory] = useState<'cloudflare' | 'supabase' | 'github' | 'site_api' | 'security' | 'env_vars'>('cloudflare');
  const [changedField, setChangedField] = useState('');
  const [previousValue, setPreviousValue] = useState('');
  const [newValue, setNewValue] = useState('');

  // System alert specifics
  const [metricName, setMetricName] = useState('');
  const [metricValue, setMetricValue] = useState('');
  const [threshold, setThreshold] = useState('');
  const [isResolved, setIsResolved] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('Por favor introduce un título para el evento.', 'error');
      return;
    }

    const metadata: any = {};

    if (type === 'deployment') {
      const generatedHash = commitHash.trim() || Math.random().toString(36).substring(2, 9);
      metadata.commitHash = generatedHash;
      metadata.commitMessage = commitMessage || title;
      metadata.branch = branch;
      metadata.deployDurationSec = Number(deployDurationSec) || 30;
      metadata.deployStatus = 'success';
      metadata.environment = environment;
      metadata.rollbackAvailable = true;
      metadata.deployLogs = [
        `Deployment initiated on branch ${branch}...`,
        `Commit: ${generatedHash} - ${commitMessage || title}`,
        `Building ${environment} artifacts in ${deployDurationSec}s...`,
        'Edge assets deployed successfully',
        'Healthcheck 200 OK'
      ];
    } else if (type === 'config_change') {
      metadata.category = configCategory;
      metadata.changedField = changedField || 'Configuración general';
      metadata.previousValue = previousValue || 'Config anterior';
      metadata.newValue = newValue || 'Nuevo valor aplicado';
    } else if (type === 'system_alert') {
      metadata.metricName = metricName || 'Métrica del sistema';
      metadata.metricValue = metricValue || 'Alerta registrada';
      metadata.threshold = threshold || 'Límite SLA';
      metadata.resolved = isResolved;
      if (isResolved) {
        metadata.resolvedAt = new Date().toISOString().replace('T', ' ').slice(0, 16);
      }
    }

    addProjectActivity({
      projectId: project.id,
      type,
      title,
      description,
      severity,
      author: author || 'Lead DevOps',
      metadata
    });

    showToast('Evento registrado en el historial de actividad.', 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div 
        className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 text-[#1d8fe6]">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-900">Registrar Evento de Actividad</h2>
              <p className="text-[11px] text-slate-500">Proyecto: {project.name}</p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {/* Activity Type Selection */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Tipo de Evento
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  setType('deployment');
                  setSeverity('success');
                }}
                className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all ${
                  type === 'deployment' 
                    ? 'border-[#38A5F8] bg-blue-50/50 text-[#1d8fe6] font-bold shadow-2xs' 
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Rocket className="w-4 h-4 shrink-0 text-[#1d8fe6]" />
                <span className="truncate">Despliegue</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setType('config_change');
                  setSeverity('info');
                }}
                className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all ${
                  type === 'config_change' 
                    ? 'border-[#38A5F8] bg-blue-50/50 text-[#1d8fe6] font-bold shadow-2xs' 
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Settings2 className="w-4 h-4 shrink-0 text-indigo-600" />
                <span className="truncate">Configuración</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setType('system_alert');
                  setSeverity('warning');
                }}
                className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all ${
                  type === 'system_alert' 
                    ? 'border-[#38A5F8] bg-blue-50/50 text-[#1d8fe6] font-bold shadow-2xs' 
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
                <span className="truncate">Alerta Sistema</span>
              </button>
            </div>
          </div>

          {/* Title and Author */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Título del Evento *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder={
                  type === 'deployment' ? 'Deploy Producción v2.5.0' :
                  type === 'config_change' ? 'Actualización de Reglas WAF' :
                  'Latencia en Edge Elevada'
                }
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:outline-hidden focus:border-[#38A5F8]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Autor / Responsable
              </label>
              <input
                type="text"
                value={author}
                onChange={e => setAuthor(e.target.value)}
                placeholder="Carlos M. (DevOps), GitHub Actions, etc."
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:outline-hidden focus:border-[#38A5F8]"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Descripción Detallada
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Detalla los cambios implementados, causa de la alerta o motivo de la configuración..."
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:outline-hidden focus:border-[#38A5F8]"
            />
          </div>

          {/* Severity */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Nivel de Severidad
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'info', label: 'Info', color: 'bg-blue-50 text-blue-700 border-blue-200' },
                { id: 'success', label: 'Éxito', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
                { id: 'warning', label: 'Aviso', color: 'bg-amber-50 text-amber-700 border-amber-200' },
                { id: 'critical', label: 'Crítico', color: 'bg-[#ffe4ee] text-[#D81159] border-red-200' },
              ].map(s => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSeverity(s.id as ProjectActivitySeverity)}
                  className={`py-1.5 px-2 rounded-xl text-center font-bold border transition-all text-xs ${
                    severity === s.id ? `${s.color} ring-2 ring-slate-900/10 font-black` : 'bg-slate-50 text-slate-500 border-slate-200'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* TYPE-SPECIFIC FIELDS */}
          {type === 'deployment' && (
            <div className="p-3.5 bg-blue-50/50 rounded-xl border border-blue-100 space-y-3">
              <h4 className="text-[11px] font-bold text-[#1d8fe6] uppercase tracking-wider flex items-center gap-1.5">
                <GitBranch className="w-3.5 h-3.5" />
                Parámetros de Despliegue CI/CD
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">Commit Hash (7 dig):</label>
                  <input
                    type="text"
                    value={commitHash}
                    onChange={e => setCommitHash(e.target.value)}
                    placeholder="7f9c2a1"
                    maxLength={7}
                    className="w-full px-2.5 py-1.5 font-mono text-xs bg-white border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">Rama Git:</label>
                  <input
                    type="text"
                    value={branch}
                    onChange={e => setBranch(e.target.value)}
                    placeholder="main"
                    className="w-full px-2.5 py-1.5 font-mono text-xs bg-white border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">Entorno:</label>
                  <select
                    value={environment}
                    onChange={e => setEnvironment(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-800"
                  >
                    <option value="production">Production</option>
                    <option value="staging">Staging</option>
                    <option value="preview">Preview</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">Mensaje de Commit:</label>
                <input
                  type="text"
                  value={commitMessage}
                  onChange={e => setCommitMessage(e.target.value)}
                  placeholder="feat: optimize responsive layout and checkout form"
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-800"
                />
              </div>
            </div>
          )}

          {type === 'config_change' && (
            <div className="p-3.5 bg-indigo-50/50 rounded-xl border border-indigo-100 space-y-3">
              <h4 className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider flex items-center gap-1.5">
                <Settings2 className="w-3.5 h-3.5" />
                Detalle del Cambio de Configuración
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">Capa / Servicio:</label>
                  <select
                    value={configCategory}
                    onChange={e => setConfigCategory(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-800"
                  >
                    <option value="cloudflare">Cloudflare (DNS, SSL, WAF, Cache)</option>
                    <option value="supabase">Supabase (PostgreSQL, RLS, Storage)</option>
                    <option value="github">GitHub (Repo, Branch rules, CI/CD)</option>
                    <option value="site_api">Site API (Pausa remota, Webhooks)</option>
                    <option value="security">Seguridad & Llaves Secretas</option>
                    <option value="env_vars">Variables de Entorno (.env)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">Parámetro Modificado:</label>
                  <input
                    type="text"
                    value={changedField}
                    onChange={e => setChangedField(e.target.value)}
                    placeholder="SSL Encryption Mode, pgBouncer Pool, etc."
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">Valor Anterior:</label>
                  <input
                    type="text"
                    value={previousValue}
                    onChange={e => setPreviousValue(e.target.value)}
                    placeholder="Flexible / 20 poolers / false"
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">Nuevo Valor Aplicado:</label>
                  <input
                    type="text"
                    value={newValue}
                    onChange={e => setNewValue(e.target.value)}
                    placeholder="Full (Strict) / 50 poolers / true"
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 font-bold text-indigo-700"
                  />
                </div>
              </div>
            </div>
          )}

          {type === 'system_alert' && (
            <div className="p-3.5 bg-amber-50/50 rounded-xl border border-amber-100 space-y-3">
              <h4 className="text-[11px] font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                Métricas & Parámetros de Alerta
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">Métrica Afectada:</label>
                  <input
                    type="text"
                    value={metricName}
                    onChange={e => setMetricName(e.target.value)}
                    placeholder="Latencia Edge, Storage Cupo, etc."
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">Valor Detectado:</label>
                  <input
                    type="text"
                    value={metricValue}
                    onChange={e => setMetricValue(e.target.value)}
                    placeholder="480ms / 85% / 142 req"
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">Umbral SLA:</label>
                  <input
                    type="text"
                    value={threshold}
                    onChange={e => setThreshold(e.target.value)}
                    placeholder="200ms / 80% / 20 req"
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="modal-alert-resolved"
                  checked={isResolved}
                  onChange={e => setIsResolved(e.target.checked)}
                  className="rounded border-slate-300 text-[#38A5F8] focus:ring-[#38A5F8]"
                />
                <label htmlFor="modal-alert-resolved" className="text-xs font-semibold text-slate-700 cursor-pointer">
                  Marcar como alerta resuelta / estado normalizado
                </label>
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-black text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors shadow-xs flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Guardar Evento en Feed</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
