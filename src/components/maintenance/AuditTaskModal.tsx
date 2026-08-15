import React, { useState, useEffect } from 'react';
import { 
  X, 
  CheckSquare, 
  Database, 
  Globe, 
  GitBranch, 
  ShieldAlert, 
  Zap, 
  User, 
  Clock, 
  Tag, 
  AlertCircle,
  Trash2,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ReviewTask, ReviewTaskStatus, TaskPriority } from '../../types';

interface AuditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  reviewId?: string;
  taskToEdit?: { reviewId: string; task: ReviewTask } | null;
  defaultStatus?: ReviewTaskStatus;
}

export const AuditTaskModal: React.FC<AuditTaskModalProps> = ({
  isOpen,
  onClose,
  reviewId: initialReviewId,
  taskToEdit,
  defaultStatus = 'todo'
}) => {
  const { 
    maintenanceReviews, 
    projects, 
    addReviewTask, 
    updateReviewTask, 
    deleteReviewTask 
  } = useApp();

  const isEditing = !!taskToEdit;

  const [selectedReviewId, setSelectedReviewId] = useState(
    taskToEdit?.reviewId || initialReviewId || maintenanceReviews[0]?.id || ''
  );
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'supabase' | 'cloudflare' | 'github' | 'security' | 'performance'>('supabase');
  const [status, setStatus] = useState<ReviewTaskStatus>(defaultStatus);
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [assignedTo, setAssignedTo] = useState('Carlos M. (DevOps)');
  const [estimatedHours, setEstimatedHours] = useState<number>(2);
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (taskToEdit) {
      setSelectedReviewId(taskToEdit.reviewId);
      setTitle(taskToEdit.task.title);
      setCategory(taskToEdit.task.category);
      setStatus(taskToEdit.task.status || (taskToEdit.task.completed ? 'completed' : 'todo'));
      setPriority(taskToEdit.task.priority || 'medium');
      setAssignedTo(taskToEdit.task.assignedTo || 'Carlos M. (DevOps)');
      setEstimatedHours(taskToEdit.task.estimatedHours || 2);
      setDescription(taskToEdit.task.description || '');
    } else {
      setSelectedReviewId(initialReviewId || maintenanceReviews[0]?.id || '');
      setTitle('');
      setCategory('supabase');
      setStatus(defaultStatus);
      setPriority('medium');
      setAssignedTo('Carlos M. (DevOps)');
      setEstimatedHours(2);
      setDescription('');
    }
  }, [taskToEdit, initialReviewId, defaultStatus, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !selectedReviewId) return;

    if (isEditing && taskToEdit) {
      updateReviewTask(taskToEdit.reviewId, taskToEdit.task.id, {
        title: title.trim(),
        category,
        status,
        completed: status === 'completed',
        priority,
        assignedTo,
        estimatedHours,
        description: description.trim()
      });
    } else {
      addReviewTask(selectedReviewId, {
        title: title.trim(),
        category,
        status,
        completed: status === 'completed',
        priority,
        assignedTo,
        estimatedHours,
        description: description.trim()
      });
    }

    onClose();
  };

  const handleDelete = () => {
    if (isEditing && taskToEdit) {
      deleteReviewTask(taskToEdit.reviewId, taskToEdit.task.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl text-white ${
              status === 'completed' 
                ? 'bg-emerald-600' 
                : status === 'in_progress' 
                ? 'bg-[#38A5F8]' 
                : 'bg-slate-700'
            }`}>
              <CheckSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {isEditing ? 'Editar Tarea de Auditoría' : 'Nueva Tarea de Auditoría'}
              </h2>
              <p className="text-xs text-slate-500">
                {isEditing ? 'Actualiza los parámetros de control técnico' : 'Agrega un nuevo punto de verificación al tablero Kanban'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Plan / Project Selector */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Plan de Auditoría Asociado *
            </label>
            <select
              value={selectedReviewId}
              onChange={e => setSelectedReviewId(e.target.value)}
              disabled={isEditing}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold focus:bg-white focus:border-[#38A5F8] focus:outline-hidden disabled:opacity-75"
            >
              {maintenanceReviews.map(rev => {
                const proj = projects.find(p => p.id === rev.projectId);
                return (
                  <option key={rev.id} value={rev.id}>
                    {proj ? `[${proj.name}] ` : ''}{rev.title} (Cada {rev.intervalDays}d)
                  </option>
                );
              })}
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Título de la Tarea de Control *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Ej: Supabase: Revisar logs de poolers y backups diarios..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:border-[#38A5F8] focus:outline-hidden font-medium"
            />
          </div>

          {/* Status & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Estado Kanban *
              </label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as ReviewTaskStatus)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold focus:bg-white focus:border-[#38A5F8] focus:outline-hidden"
              >
                <option value="todo">📋 Por Hacer (Todo)</option>
                <option value="in_progress">⚡ En Progreso (In Progress)</option>
                <option value="completed">✅ Completada (Completed)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Prioridad *
              </label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as TaskPriority)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold focus:bg-white focus:border-[#38A5F8] focus:outline-hidden"
              >
                <option value="critical">🔴 Crítica / Urgente</option>
                <option value="high">🟠 Alta</option>
                <option value="medium">🔵 Media</option>
                <option value="low">⚪ Baja</option>
              </select>
            </div>
          </div>

          {/* Category & Assignee */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Capa Técnica / Categoría *
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold focus:bg-white focus:border-[#38A5F8] focus:outline-hidden"
              >
                <option value="supabase">🟢 Supabase (DB & Storage)</option>
                <option value="cloudflare">🟠 Cloudflare (SSL & DNS)</option>
                <option value="github">⚫ GitHub (CI/CD & Code)</option>
                <option value="security">🛡️ Seguridad & RLS</option>
                <option value="performance">⚡ Performance & Cache</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Responsable Técnico
              </label>
              <input
                type="text"
                value={assignedTo}
                onChange={e => setAssignedTo(e.target.value)}
                placeholder="Ej: Carlos M. (DevOps)"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-[#38A5F8] focus:outline-hidden"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Detalles y Criterios de Aceptación
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Instrucciones paso a paso para completar la auditoría técnica..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:border-[#38A5F8] focus:outline-hidden resize-none"
            />
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
            {isEditing ? (
              <button
                type="button"
                onClick={handleDelete}
                className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-xl font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Eliminar Tarea</span>
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 font-bold text-white bg-[#38A5F8] hover:bg-[#1d8fe6] rounded-xl shadow-sm shadow-[#38A5F8]/25 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isEditing ? 'Guardar Cambios' : 'Crear Tarea'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
