import React, { useState } from 'react';
import { 
  X, 
  Wrench, 
  ShieldCheck, 
  Calendar, 
  CalendarDays,
  User, 
  Plus, 
  Trash2, 
  Repeat, 
  Clock, 
  Sparkles, 
  CheckCircle2,
  AlertCircle,
  Database,
  Globe,
  GitBranch,
  Shield,
  Zap
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ReviewInterval, ReviewStatus, ReviewTask } from '../../types';

export const NewReviewModal: React.FC = () => {
  const { isNewReviewModalOpen, setIsNewReviewModalOpen, projects, clients, addMaintenanceReview, showToast } = useApp();

  const [projectId, setProjectId] = useState(projects[0]?.id || '');
  const [title, setTitle] = useState('');
  
  // Date and Recurrence State
  const todayStr = new Date().toISOString().split('T')[0];
  const [startDate, setStartDate] = useState(todayStr);
  const [intervalDays, setIntervalDays] = useState<ReviewInterval>(60);
  const [auditorName, setAuditorName] = useState('Lead DevOps / Tech Lead');
  const [notes, setNotes] = useState('');

  // Default checklist tasks
  const [tasks, setTasks] = useState<Array<{ 
    id: string; 
    title: string; 
    category: 'supabase' | 'cloudflare' | 'github' | 'security' | 'performance';
    priority: 'critical' | 'high' | 'medium' | 'low';
  }>>([
    { id: '1', title: 'Supabase: Auditar almacenamiento, índices y políticas RLS', category: 'supabase', priority: 'high' },
    { id: '2', title: 'Cloudflare: Validar certificados SSL, WAF y registros DNS', category: 'cloudflare', priority: 'critical' },
    { id: '3', title: 'GitHub: Chequear alertas Dependabot y dependencias desactualizadas', category: 'github', priority: 'medium' },
  ]);

  if (!isNewReviewModalOpen) return null;

  const selectedProject = projects.find(p => p.id === projectId);

  // Quick Date presets
  const applyQuickDate = (daysToAdd: number) => {
    const d = new Date();
    d.setDate(d.getDate() + daysToAdd);
    setStartDate(d.toISOString().split('T')[0]);
  };

  const applyNextMonthFirstDay = () => {
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    setStartDate(nextMonth.toISOString().split('T')[0]);
  };

  // Preset checklist templates
  const applyPreset = (presetType: 'full' | 'security' | 'db') => {
    if (presetType === 'full') {
      setTasks([
        { id: Date.now() + '-1', title: 'Supabase: Verificar límites de cuota, RLS y latencia de queries', category: 'supabase', priority: 'high' },
        { id: Date.now() + '-2', title: 'Cloudflare: Validar estado de proxy DNS, expiración SSL y reglas WAF', category: 'cloudflare', priority: 'critical' },
        { id: Date.now() + '-3', title: 'GitHub: Revisar ramas protegidas, secrets de CI/CD y Dependabot', category: 'github', priority: 'medium' },
        { id: Date.now() + '-4', title: 'Performance: Verificar Core Web Vitals y tiempos de respuesta en Edge', category: 'performance', priority: 'medium' }
      ]);
      showToast('Plantilla de Auditoría Completa cargada', 'info');
    } else if (presetType === 'security') {
      setTasks([
        { id: Date.now() + '-1', title: 'Cloudflare: Renovar reglas de bloqueo IP y protección DDoS', category: 'cloudflare', priority: 'critical' },
        { id: Date.now() + '-2', title: 'Supabase: Revisar permisos de Service Role y accesos anónimos', category: 'supabase', priority: 'critical' },
        { id: Date.now() + '-3', title: 'GitHub: Rotación preventiva de API Keys y tokens de despliegue', category: 'github', priority: 'high' },
        { id: Date.now() + '-4', title: 'Seguridad: Análisis de vulnerabilidades y endpoints expuestos', category: 'security', priority: 'high' }
      ]);
      showToast('Plantilla de Seguridad & SSL cargada', 'info');
    } else if (presetType === 'db') {
      setTasks([
        { id: Date.now() + '-1', title: 'Supabase: Optimizar índices lentos en tablas transaccionales', category: 'supabase', priority: 'high' },
        { id: Date.now() + '-2', title: 'Supabase: Depurar backups automáticos y políticas de retención', category: 'supabase', priority: 'medium' },
        { id: Date.now() + '-3', title: 'Cloudflare: Purgar caché obsoleta y revisar hit ratio de assets', category: 'cloudflare', priority: 'low' },
        { id: Date.now() + '-4', title: 'Performance: Simular carga concurrente y verificar latencia p95', category: 'performance', priority: 'medium' }
      ]);
      showToast('Plantilla de Rendimiento y Base de Datos cargada', 'info');
    }
  };

  // Compute calculated upcoming recurring review dates
  const calculateUpcomingDates = () => {
    const base = new Date(startDate || todayStr);
    const dates = [];
    for (let i = 1; i <= 3; i++) {
      const nextD = new Date(base);
      nextD.setDate(nextD.getDate() + (intervalDays * i));
      dates.push(nextD.toISOString().split('T')[0]);
    }
    return dates;
  };

  const upcomingDates = calculateUpcomingDates();

  const handleAddTask = () => {
    const id = Date.now().toString();
    setTasks(prev => [...prev, { 
      id, 
      title: 'Nueva verificación de control técnico', 
      category: 'supabase',
      priority: 'medium' 
    }]);
  };

  const handleRemoveTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const handleTaskTitleChange = (id: string, text: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, title: text } : t));
  };

  const handleTaskCategoryChange = (id: string, cat: 'supabase' | 'cloudflare' | 'github' | 'security' | 'performance') => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, category: cat } : t));
  };

  const handleTaskPriorityChange = (id: string, priority: 'critical' | 'high' | 'medium' | 'low') => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, priority } : t));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectId) {
      showToast('Selecciona un proyecto a auditar', 'error');
      return;
    }

    // Determine next review date based on startDate and interval
    const selectedStart = new Date(startDate || todayStr);
    const nextDate = new Date(selectedStart);
    nextDate.setDate(nextDate.getDate() + intervalDays);

    const formattedNextDate = nextDate.toISOString().split('T')[0];
    const formattedLastDate = startDate;

    const autoTitle = title.trim() || `Plan de Auditoría Recurrente (${intervalDays}d): ${selectedProject?.name || 'Proyecto'}`;

    addMaintenanceReview({
      projectId,
      clientId: selectedProject?.clientId || 'cli-001',
      title: autoTitle,
      intervalDays,
      lastReviewDate: formattedLastDate,
      nextReviewDate: formattedNextDate,
      status: 'Al Día',
      auditorName: auditorName.trim() || 'Lead DevOps / Tech Lead',
      notes: notes.trim() || 'Auditoría recurrente de infraestructura programada desde el calendario.',
      tasks: tasks.map(t => ({
        id: t.id,
        title: t.title,
        category: t.category,
        completed: false,
        priority: t.priority,
        status: 'todo',
        assignedTo: auditorName.trim() || 'DevOps Team'
      }))
    });

    showToast(`Plan de auditoría programado para el ${formattedNextDate}`, 'success');
    setIsNewReviewModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        className="fixed inset-0" 
        onClick={() => setIsNewReviewModalOpen(false)} 
      />

      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-5 sm:px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 border border-purple-200/60 shadow-2xs">
              <CalendarDays className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Programar Auditoría Técnica Recurrente</h2>
              <p className="text-xs text-slate-500">Configura el calendario, intervalo de frecuencia y tareas para Supabase, Cloudflare y GitHub</p>
            </div>
          </div>
          <button
            onClick={() => setIsNewReviewModalOpen(false)}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 text-xs">
          {/* Project & Frequency Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                Proyecto / Sitio Web *
              </label>
              <select
                value={projectId}
                onChange={e => setProjectId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold focus:bg-white focus:border-[#38A5F8] focus:outline-hidden"
              >
                {projects.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.deliveryType})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                <span>Frecuencia Recurrente *</span>
                <span className="text-[10px] font-normal text-purple-600 font-mono">Cada {intervalDays} días</span>
              </label>
              <select
                value={intervalDays}
                onChange={e => setIntervalDays(Number(e.target.value) as ReviewInterval)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-[#38A5F8] focus:outline-hidden font-bold"
              >
                <option value={30}>Cada 30 días (Mensual)</option>
                <option value={60}>Cada 60 días (Bimestral)</option>
                <option value={90}>Cada 90 días (Trimestral)</option>
                <option value={180}>Cada 180 días (Semestral)</option>
              </select>
            </div>
          </div>

          {/* CALENDAR PICKER & SCHEDULE TIMELINE */}
          <div className="p-4 bg-purple-50/50 rounded-2xl border border-purple-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-600" />
                <span className="font-bold text-slate-900 text-xs">Fecha de Inicio / Próxima Auditoría</span>
              </div>
              <span className="text-[11px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Repeat className="w-3 h-3" />
                Recurrente cada {intervalDays} días
              </span>
            </div>

            {/* Interactive Date Input */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Seleccionar en Calendario:
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-purple-300 rounded-xl text-xs font-mono font-bold text-slate-800 shadow-2xs focus:ring-2 focus:ring-purple-400 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Quick Presets Chips */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Accesos Rápidos de Fecha:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => applyQuickDate(0)}
                    className="px-2 py-1 bg-white hover:bg-purple-100 border border-purple-200 rounded-lg text-[10px] font-bold text-purple-800 transition-colors"
                  >
                    Hoy
                  </button>
                  <button
                    type="button"
                    onClick={() => applyQuickDate(7)}
                    className="px-2 py-1 bg-white hover:bg-purple-100 border border-purple-200 rounded-lg text-[10px] font-bold text-purple-800 transition-colors"
                  >
                    En 7 días
                  </button>
                  <button
                    type="button"
                    onClick={() => applyQuickDate(15)}
                    className="px-2 py-1 bg-white hover:bg-purple-100 border border-purple-200 rounded-lg text-[10px] font-bold text-purple-800 transition-colors"
                  >
                    En 15 días
                  </button>
                  <button
                    type="button"
                    onClick={() => applyQuickDate(30)}
                    className="px-2 py-1 bg-white hover:bg-purple-100 border border-purple-200 rounded-lg text-[10px] font-bold text-purple-800 transition-colors"
                  >
                    En 30 días
                  </button>
                  <button
                    type="button"
                    onClick={applyNextMonthFirstDay}
                    className="px-2 py-1 bg-white hover:bg-purple-100 border border-purple-200 rounded-lg text-[10px] font-bold text-purple-800 transition-colors"
                  >
                    1º del próx. mes
                  </button>
                </div>
              </div>
            </div>

            {/* Calculated Upcoming Recurring Schedule Preview */}
            <div className="pt-2 border-t border-purple-200/60">
              <p className="text-[11px] font-bold text-purple-900 mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-purple-600" />
                <span>Cronograma proyectado de auditorías en el sistema:</span>
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="p-2 bg-white/90 rounded-xl border border-purple-200 text-center">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">1ª Auditoría</span>
                  <span className="font-mono font-black text-xs text-purple-700">{startDate}</span>
                </div>
                <div className="p-2 bg-white/90 rounded-xl border border-purple-200 text-center">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">2ª Auditoría (+{intervalDays}d)</span>
                  <span className="font-mono font-black text-xs text-slate-800">{upcomingDates[0]}</span>
                </div>
                <div className="p-2 bg-white/90 rounded-xl border border-purple-200 text-center">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">3ª Auditoría (+{intervalDays * 2}d)</span>
                  <span className="font-mono font-black text-xs text-slate-800">{upcomingDates[1]}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Title & Auditor */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Título del Plan de Auditoría
              </label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder={`Auditoría ${intervalDays}d ${selectedProject?.name || ''}`}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:border-[#38A5F8] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Responsable / Auditor
              </label>
              <div className="relative">
                <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={auditorName}
                  onChange={e => setAuditorName(e.target.value)}
                  placeholder="Ej. Lead DevOps / Tech Lead"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-[#38A5F8] focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* CHECKLIST & TEMPLATES */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <label className="block font-bold text-slate-700">
                Tareas y Puntos de Control ({tasks.length})
              </label>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] text-slate-400 font-semibold">Plantillas:</span>
                <button
                  type="button"
                  onClick={() => applyPreset('full')}
                  className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-[10px] font-bold transition-colors"
                >
                  Completa
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset('security')}
                  className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-[10px] font-bold transition-colors"
                >
                  Seguridad
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset('db')}
                  className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-[10px] font-bold transition-colors"
                >
                  Base de Datos
                </button>
                <button
                  type="button"
                  onClick={handleAddTask}
                  className="ml-1 px-2.5 py-1 text-[11px] font-bold text-[#1d8fe6] bg-blue-50 hover:bg-blue-100 rounded-lg flex items-center gap-1 transition-colors"
                >
                  <Plus className="w-3 h-3" />
                  <span>Añadir Tarea</span>
                </button>
              </div>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {tasks.map((task) => (
                <div key={task.id} className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-200">
                  {/* Category */}
                  <select
                    value={task.category}
                    onChange={e => handleTaskCategoryChange(task.id, e.target.value as any)}
                    className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-[11px] font-bold text-slate-700 shrink-0"
                  >
                    <option value="supabase">Supabase</option>
                    <option value="cloudflare">Cloudflare</option>
                    <option value="github">GitHub</option>
                    <option value="security">Seguridad</option>
                    <option value="performance">Performance</option>
                  </select>

                  {/* Priority */}
                  <select
                    value={task.priority}
                    onChange={e => handleTaskPriorityChange(task.id, e.target.value as any)}
                    className="px-1.5 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600 shrink-0"
                  >
                    <option value="critical">Crítica</option>
                    <option value="high">Alta</option>
                    <option value="medium">Media</option>
                    <option value="low">Baja</option>
                  </select>

                  {/* Title */}
                  <input
                    type="text"
                    value={task.title}
                    onChange={e => handleTaskTitleChange(task.id, e.target.value)}
                    className="flex-1 px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-[11px] text-slate-800 focus:outline-hidden focus:border-[#38A5F8]"
                  />

                  {/* Remove */}
                  <button
                    type="button"
                    onClick={() => handleRemoveTask(task.id)}
                    className="p-1 text-slate-400 hover:text-red-500 rounded-lg transition-colors cursor-pointer"
                    title="Eliminar tarea"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Notas e Instrucciones del Plan
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Instrucciones específicas para el equipo técnico o checklist adicional..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:border-[#38A5F8] focus:outline-hidden resize-none"
            />
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setIsNewReviewModalOpen(false)}
              className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-sm shadow-purple-600/25 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Programar Auditoría Recurrente</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
