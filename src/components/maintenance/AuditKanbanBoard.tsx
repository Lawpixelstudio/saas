import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Database, 
  Globe, 
  GitBranch, 
  ShieldAlert, 
  Zap, 
  User, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  CheckSquare, 
  Square, 
  MoreVertical, 
  ArrowRight, 
  ArrowLeft, 
  GripVertical,
  Edit3,
  Trash2,
  Calendar,
  Sparkles,
  Layers
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ReviewTask, ReviewTaskStatus, TaskPriority, MaintenanceReview } from '../../types';
import { AuditTaskModal } from './AuditTaskModal';

export const AuditKanbanBoard: React.FC = () => {
  const { 
    maintenanceReviews, 
    projects, 
    clients, 
    updateReviewTaskStatus,
    toggleReviewTask,
    deleteReviewTask,
    showToast 
  } = useApp();

  // Filter & Search states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');

  // Drag and drop states
  const [draggedItem, setDraggedItem] = useState<{ reviewId: string; taskId: string } | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<ReviewTaskStatus | null>(null);

  // Modal states
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<{ reviewId: string; task: ReviewTask } | null>(null);
  const [modalDefaultStatus, setModalDefaultStatus] = useState<ReviewTaskStatus>('todo');
  const [modalDefaultReviewId, setModalDefaultReviewId] = useState<string | undefined>(undefined);

  // Flatten tasks with review and project context for the board
  const allTasksWithContext = maintenanceReviews.flatMap(review => {
    const project = projects.find(p => p.id === review.projectId);
    const client = clients.find(c => c.id === review.clientId);

    return review.tasks.map(task => {
      // Determine canonical status
      let canonicalStatus: ReviewTaskStatus = task.status || (task.completed ? 'completed' : 'todo');

      return {
        task,
        canonicalStatus,
        review,
        project,
        client,
      };
    });
  });

  // Apply filters
  const filteredTasks = allTasksWithContext.filter(({ task, canonicalStatus, review, project, client }) => {
    // Project filter
    if (selectedProjectId !== 'all' && review.projectId !== selectedProjectId) {
      return false;
    }

    // Category filter
    if (selectedCategory !== 'all' && task.category !== selectedCategory) {
      return false;
    }

    // Priority filter
    if (selectedPriority !== 'all' && task.priority !== selectedPriority) {
      return false;
    }

    // Search query
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchTitle = task.title.toLowerCase().includes(q);
      const matchDesc = task.description?.toLowerCase().includes(q);
      const matchProject = project?.name.toLowerCase().includes(q);
      const matchClient = client?.name.toLowerCase().includes(q);
      const matchAssignee = task.assignedTo?.toLowerCase().includes(q);
      return matchTitle || matchDesc || matchProject || matchClient || matchAssignee;
    }

    return true;
  });

  // Group into 3 columns
  const todoTasks = filteredTasks.filter(item => item.canonicalStatus === 'todo');
  const inProgressTasks = filteredTasks.filter(item => item.canonicalStatus === 'in_progress');
  const completedTasks = filteredTasks.filter(item => item.canonicalStatus === 'completed');

  const totalFiltered = filteredTasks.length;
  const completionPercentage = totalFiltered > 0 ? Math.round((completedTasks.length / totalFiltered) * 100) : 0;

  // Drag & drop handlers
  const handleDragStart = (e: React.DragEvent, reviewId: string, taskId: string) => {
    const payload = JSON.stringify({ reviewId, taskId });
    e.dataTransfer.setData('text/plain', payload);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedItem({ reviewId, taskId });
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverColumn(null);
  };

  const handleDragOver = (e: React.DragEvent, status: ReviewTaskStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverColumn !== status) {
      setDragOverColumn(status);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    // Only reset if leaving the column element itself
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setDragOverColumn(null);
  };

  const handleDrop = (e: React.DragEvent, targetStatus: ReviewTaskStatus) => {
    e.preventDefault();
    setDragOverColumn(null);

    try {
      const dataStr = e.dataTransfer.getData('text/plain');
      let parsed = draggedItem;
      if (dataStr) {
        try {
          parsed = JSON.parse(dataStr);
        } catch {
          // fallback to draggedItem
        }
      }

      if (parsed) {
        updateReviewTaskStatus(parsed.reviewId, parsed.taskId, targetStatus);
        const statusLabel = targetStatus === 'completed' ? 'Completada' : targetStatus === 'in_progress' ? 'En Progreso' : 'Por Hacer';
        showToast(`Tarea movida a "${statusLabel}".`, 'info');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDraggedItem(null);
    }
  };

  const handleOpenNewTaskModal = (defaultStatus: ReviewTaskStatus = 'todo', reviewId?: string) => {
    setEditingTask(null);
    setModalDefaultStatus(defaultStatus);
    setModalDefaultReviewId(reviewId || (selectedProjectId !== 'all' ? maintenanceReviews.find(r => r.projectId === selectedProjectId)?.id : undefined));
    setIsTaskModalOpen(true);
  };

  const handleOpenEditTaskModal = (reviewId: string, task: ReviewTask) => {
    setEditingTask({ reviewId, task });
    setIsTaskModalOpen(true);
  };

  // Helper config for categories
  const getCategoryConfig = (cat: ReviewTask['category']) => {
    switch (cat) {
      case 'supabase':
        return {
          label: 'Supabase',
          icon: <Database className="w-3 h-3 text-emerald-600" />,
          chipClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        };
      case 'cloudflare':
        return {
          label: 'Cloudflare',
          icon: <Globe className="w-3 h-3 text-amber-600" />,
          chipClass: 'bg-amber-50 text-amber-800 border-amber-200',
        };
      case 'github':
        return {
          label: 'GitHub',
          icon: <GitBranch className="w-3 h-3 text-slate-700" />,
          chipClass: 'bg-slate-100 text-slate-800 border-slate-200',
        };
      case 'security':
        return {
          label: 'Seguridad',
          icon: <ShieldAlert className="w-3 h-3 text-red-600" />,
          chipClass: 'bg-red-50 text-red-800 border-red-200',
        };
      case 'performance':
        return {
          label: 'Performance',
          icon: <Zap className="w-3 h-3 text-purple-600" />,
          chipClass: 'bg-purple-50 text-purple-800 border-purple-200',
        };
      default:
        return {
          label: 'Infraestructura',
          icon: <Database className="w-3 h-3 text-slate-600" />,
          chipClass: 'bg-slate-50 text-slate-700 border-slate-200',
        };
    }
  };

  // Helper config for priorities
  const getPriorityConfig = (priority?: TaskPriority) => {
    switch (priority) {
      case 'critical':
        return {
          label: 'Crítica',
          class: 'bg-red-100 text-red-800 border-red-200 font-black',
          dotClass: 'bg-red-500',
        };
      case 'high':
        return {
          label: 'Alta',
          class: 'bg-amber-100 text-amber-800 border-amber-200 font-bold',
          dotClass: 'bg-amber-500',
        };
      case 'medium':
        return {
          label: 'Media',
          class: 'bg-blue-100 text-blue-800 border-blue-200 font-semibold',
          dotClass: 'bg-blue-500',
        };
      case 'low':
        return {
          label: 'Baja',
          class: 'bg-slate-100 text-slate-600 border-slate-200',
          dotClass: 'bg-slate-400',
        };
      default:
        return {
          label: 'Media',
          class: 'bg-blue-50 text-blue-700 border-blue-200',
          dotClass: 'bg-blue-400',
        };
    }
  };

  // Column definitions
  const columns: Array<{
    id: ReviewTaskStatus;
    title: string;
    description: string;
    tasks: typeof filteredTasks;
    badgeBg: string;
    borderCol: string;
    hoverRing: string;
    icon: React.ReactNode;
  }> = [
    {
      id: 'todo',
      title: 'Por Hacer',
      description: 'Puntos de control pendientes de iniciar',
      tasks: todoTasks,
      badgeBg: 'bg-slate-100 text-slate-800 border-slate-300',
      borderCol: 'border-slate-200',
      hoverRing: 'ring-slate-400/40 bg-slate-50/70',
      icon: <Clock className="w-4 h-4 text-slate-500" />,
    },
    {
      id: 'in_progress',
      title: 'En Progreso',
      description: 'Auditorías técnicas activas en ejecución',
      tasks: inProgressTasks,
      badgeBg: 'bg-blue-100 text-blue-900 border-blue-300',
      borderCol: 'border-blue-200',
      hoverRing: 'ring-[#38A5F8]/50 bg-blue-50/60',
      icon: <Zap className="w-4 h-4 text-[#38A5F8] animate-pulse" />,
    },
    {
      id: 'completed',
      title: 'Completadas',
      description: 'Puntos verificados con éxito',
      tasks: completedTasks,
      badgeBg: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      borderCol: 'border-emerald-200',
      hoverRing: 'ring-emerald-500/50 bg-emerald-50/60',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
    },
  ];

  return (
    <div className="space-y-5">
      {/* KANBAN SUMMARY METRICS & PROGRESS BAR */}
      <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold shadow-2xs">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total de Tareas</p>
              <h4 className="text-lg font-black text-slate-900 leading-none mt-0.5">
                {totalFiltered} <span className="text-xs font-normal text-slate-500">en tablero</span>
              </h4>
            </div>
          </div>

          <div className="h-8 w-px bg-slate-200 hidden sm:block" />

          {/* Mini Counter Pills */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 flex items-center gap-2 text-xs">
              <span className="w-2 h-2 rounded-full bg-slate-400" />
              <span className="text-slate-600 font-medium">Por Hacer:</span>
              <strong className="font-mono text-slate-900">{todoTasks.length}</strong>
            </div>

            <div className="px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 flex items-center gap-2 text-xs">
              <span className="w-2 h-2 rounded-full bg-[#38A5F8] animate-ping" />
              <span className="text-blue-700 font-medium">En Progreso:</span>
              <strong className="font-mono text-blue-950">{inProgressTasks.length}</strong>
            </div>

            <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-emerald-700 font-medium">Completadas:</span>
              <strong className="font-mono text-emerald-950">{completedTasks.length}</strong>
            </div>
          </div>
        </div>

        {/* Global Completion Progress */}
        <div className="flex items-center gap-3 min-w-[240px]">
          <div className="flex-1">
            <div className="flex justify-between items-center text-[11px] font-bold mb-1">
              <span className="text-slate-500">Progreso Global</span>
              <span className="text-emerald-600 font-mono">{completionPercentage}%</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
              <div 
                className="h-full bg-linear-to-r from-[#38A5F8] to-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>

          <button
            onClick={() => handleOpenNewTaskModal('todo')}
            className="px-3.5 py-2 text-xs font-bold text-white bg-[#38A5F8] hover:bg-[#1d8fe6] rounded-xl shadow-xs transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Nueva Tarea</span>
          </button>
        </div>
      </div>

      {/* FILTER & SEARCH CONTROLS */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Buscar por tarea, proyecto, cliente o responsable..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-hidden"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
            >
              ✕
            </button>
          )}
        </div>

        {/* Project Selector */}
        <div className="flex items-center gap-2">
          <select
            value={selectedProjectId}
            onChange={e => setSelectedProjectId(e.target.value)}
            className="px-3 py-1.5 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:bg-white focus:outline-hidden"
          >
            <option value="all">🏢 Todos los Proyectos</option>
            {projects.map(p => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          {/* Category Chip Selector */}
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:bg-white focus:outline-hidden"
          >
            <option value="all">⚙️ Todas las Capas</option>
            <option value="supabase">🟢 Supabase</option>
            <option value="cloudflare">🟠 Cloudflare</option>
            <option value="github">⚫ GitHub</option>
            <option value="security">🛡️ Seguridad</option>
            <option value="performance">⚡ Performance</option>
          </select>

          {/* Priority Selector */}
          <select
            value={selectedPriority}
            onChange={e => setSelectedPriority(e.target.value)}
            className="px-3 py-1.5 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:bg-white focus:outline-hidden"
          >
            <option value="all">🔥 Todas las Prioridades</option>
            <option value="critical">🔴 Crítica</option>
            <option value="high">🟠 Alta</option>
            <option value="medium">🔵 Media</option>
            <option value="low">⚪ Baja</option>
          </select>
        </div>
      </div>

      {/* 3-COLUMN KANBAN BOARD */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
        {columns.map(column => {
          const isOverThisCol = dragOverColumn === column.id;

          return (
            <div
              key={column.id}
              onDragOver={e => handleDragOver(e, column.id)}
              onDragLeave={handleDragLeave}
              onDrop={e => handleDrop(e, column.id)}
              className={`bg-slate-100/70 rounded-2xl border transition-all duration-200 flex flex-col min-h-[550px] ${
                isOverThisCol 
                  ? `${column.hoverRing} border-blue-400 ring-2 shadow-md` 
                  : `${column.borderCol} hover:border-slate-300`
              }`}
            >
              {/* Column Header */}
              <div className="p-4 border-b border-slate-200/80 bg-white/70 backdrop-blur-xs rounded-t-2xl flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-white shadow-2xs">
                    {column.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-black text-slate-900">
                        {column.title}
                      </h3>
                      <span className={`text-[11px] font-mono font-black px-2 py-0.2 rounded-full border ${column.badgeBg}`}>
                        {column.tasks.length}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {column.description}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleOpenNewTaskModal(column.id)}
                  className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                  title={`Agregar tarea a ${column.title}`}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Tasks List / Drop Area */}
              <div className="p-3.5 space-y-3 flex-1 flex flex-col">
                {column.tasks.length === 0 ? (
                  <div 
                    onClick={() => handleOpenNewTaskModal(column.id)}
                    className="flex-1 flex flex-col items-center justify-center p-8 text-center border-2 border-dashed border-slate-200 rounded-xl hover:border-slate-300 hover:bg-white/40 cursor-pointer transition-colors"
                  >
                    <div className="p-2.5 rounded-full bg-slate-50 text-slate-400 mb-2">
                      <Plus className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-bold text-slate-600">No hay tareas en {column.title.toLowerCase()}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Arrastra una tarea aquí o haz clic para crear una
                    </p>
                  </div>
                ) : (
                  column.tasks.map(({ task, review, project, client }) => {
                    const catConfig = getCategoryConfig(task.category);
                    const prioConfig = getPriorityConfig(task.priority);
                    const isBeingDragged = draggedItem?.taskId === task.id;

                    return (
                      <div
                        key={task.id}
                        draggable
                        onDragStart={e => handleDragStart(e, review.id, task.id)}
                        onDragEnd={handleDragEnd}
                        onClick={() => handleOpenEditTaskModal(review.id, task)}
                        className={`bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs hover:shadow-md transition-all cursor-grab active:cursor-grabbing select-none group relative ${
                          isBeingDragged ? 'opacity-40 scale-95 border-dashed border-blue-400' : 'hover:border-slate-300'
                        } ${task.completed ? 'bg-slate-50/50' : ''}`}
                      >
                        {/* Top Chips Row */}
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border flex items-center gap-1 ${catConfig.chipClass}`}>
                              {catConfig.icon}
                              <span>{catConfig.label}</span>
                            </span>

                            <span className={`text-[9px] px-1.5 py-0.2 rounded-md border flex items-center gap-1 ${prioConfig.class}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${prioConfig.dotClass}`} />
                              <span>{prioConfig.label}</span>
                            </span>
                          </div>

                          <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                            <GripVertical className="w-3.5 h-3.5 text-slate-400 cursor-grab" />
                          </div>
                        </div>

                        {/* Task Title */}
                        <div className="flex items-start gap-2.5">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleReviewTask(review.id, task.id);
                            }}
                            className="mt-0.5 text-slate-400 hover:text-emerald-600 transition-colors shrink-0 cursor-pointer"
                            title={task.completed ? 'Marcar pendiente' : 'Marcar completada'}
                          >
                            {task.completed ? (
                              <CheckSquare className="w-4 h-4 text-emerald-600" />
                            ) : (
                              <Square className="w-4 h-4 text-slate-300 hover:text-slate-500" />
                            )}
                          </button>

                          <div className="flex-1 min-w-0">
                            <h4 className={`text-xs font-bold leading-snug ${
                              task.completed ? 'line-through text-slate-400' : 'text-slate-900'
                            }`}>
                              {task.title}
                            </h4>

                            {task.description && (
                              <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                                {task.description}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Project & Client Breadcrumb */}
                        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                          <div className="truncate pr-2 font-medium">
                            <span className="font-bold text-slate-700">{project?.name}</span>
                            {client && <span className="opacity-70"> • {client.name}</span>}
                          </div>

                          {task.assignedTo && (
                            <div className="flex items-center gap-1 shrink-0 bg-slate-100 px-1.5 py-0.5 rounded text-slate-700 font-mono text-[9px] font-bold">
                              <User className="w-2.5 h-2.5 text-slate-500" />
                              <span className="truncate max-w-[80px]">{task.assignedTo.split(' ')[0]}</span>
                            </div>
                          )}
                        </div>

                        {/* Quick Mobile / Desktop Column Transfer Buttons on Hover */}
                        <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                          {column.id !== 'todo' && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                const prevStatus = column.id === 'completed' ? 'in_progress' : 'todo';
                                updateReviewTaskStatus(review.id, task.id, prevStatus);
                              }}
                              className="px-2 py-0.5 text-[10px] font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded flex items-center gap-1 cursor-pointer transition-colors"
                              title="Mover a columna anterior"
                            >
                              <ArrowLeft className="w-3 h-3" />
                              <span>{column.id === 'completed' ? 'En Progreso' : 'Por Hacer'}</span>
                            </button>
                          )}

                          <div className="flex-1" />

                          {column.id !== 'completed' && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                const nextStatus = column.id === 'todo' ? 'in_progress' : 'completed';
                                updateReviewTaskStatus(review.id, task.id, nextStatus);
                              }}
                              className={`px-2 py-0.5 text-[10px] font-bold rounded flex items-center gap-1 cursor-pointer transition-colors ${
                                column.id === 'in_progress' 
                                  ? 'text-emerald-700 hover:bg-emerald-50 bg-emerald-50/60 font-black' 
                                  : 'text-blue-700 hover:bg-blue-50 bg-blue-50/60'
                              }`}
                              title="Mover a columna siguiente"
                            >
                              <span>{column.id === 'todo' ? 'En Progreso' : 'Completar'}</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}

                {/* Quick Add at bottom of column */}
                <button
                  type="button"
                  onClick={() => handleOpenNewTaskModal(column.id)}
                  className="w-full py-2 px-3 text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-white/80 border border-transparent hover:border-slate-200 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-auto"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Agregar tarea</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Task Edit / Creation Modal */}
      <AuditTaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        taskToEdit={editingTask}
        defaultStatus={modalDefaultStatus}
        reviewId={modalDefaultReviewId}
      />
    </div>
  );
};
