import React, { useState } from 'react';
import { 
  Wrench, 
  Calendar, 
  CheckSquare, 
  Square, 
  ShieldCheck, 
  RotateCw, 
  Plus, 
  Search, 
  Filter, 
  AlertTriangle, 
  Database, 
  Globe, 
  GitBranch, 
  Clock, 
  BellRing,
  User,
  ArrowRight,
  CheckCircle2,
  KanbanSquare,
  Layers,
  Sparkles,
  Zap
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Breadcrumbs } from '../layout/Breadcrumbs';
import { WhatsAppButton } from '../common/WhatsAppButton';
import { MaintenanceReview, ReviewInterval } from '../../types';
import { AuditKanbanBoard } from './AuditKanbanBoard';

export const MaintenanceView: React.FC = () => {
  const { 
    maintenanceReviews, 
    projects, 
    clients, 
    financeRecords,
    toggleReviewTask, 
    scheduleNextReview,
    setIsNewReviewModalOpen,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'kanban' | 'audits' | 'billing_alerts'>('kanban');
  const [selectedInterval, setSelectedInterval] = useState<string>('all');
  const [daysBeforeBillingAlert, setDaysBeforeBillingAlert] = useState<number>(3); // N days before

  const totalTasksCount = maintenanceReviews.reduce((sum, r) => sum + r.tasks.length, 0);
  const completedTasksCount = maintenanceReviews.reduce((sum, r) => sum + r.tasks.filter(t => t.completed || t.status === 'completed').length, 0);

  const filteredReviews = maintenanceReviews.filter(r => {
    return selectedInterval === 'all' || r.intervalDays === Number(selectedInterval);
  });

  // Calculate upcoming billing alerts (N days before due date)
  const billingAlertsList = financeRecords.map(f => {
    const client = clients.find(c => c.id === f.clientId);
    const project = projects.find(p => p.id === f.projectId);
    const dueDate = new Date(f.nextBillingDate);
    const today = new Date();
    
    // Difference in days
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const isUpcoming = diffDays >= 0 && diffDays <= daysBeforeBillingAlert;
    const isOverdue = diffDays < 0;

    return {
      record: f,
      client,
      project,
      diffDays,
      isUpcoming,
      isOverdue,
    };
  }).filter(item => item.isUpcoming || item.isOverdue);

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#F8FAFC]">
      <Breadcrumbs
        title="Mantenimiento & Auditorías Técnicas"
        subtitle="Tablero Kanban de control técnico (Supabase, Cloudflare, GitHub) y alertas automáticas de cobro"
        badge={{
          text: `${totalTasksCount} Tareas Técnicas (${completedTasksCount} completadas)`,
          variant: 'blue'
        }}
        primaryAction={{
          label: 'Programar Plan de Revisión',
          onClick: () => setIsNewReviewModalOpen(true),
          icon: <Plus className="w-3.5 h-3.5" />
        }}
      />

      <div className="p-3 sm:p-6 space-y-4 sm:space-y-6 max-w-7xl w-full mx-auto">
        {/* TOP TAB CONTROLS */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl w-full lg:w-auto overflow-x-auto">
            <button
              onClick={() => setActiveTab('kanban')}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'kanban' ? 'bg-white text-[#38A5F8] shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <KanbanSquare className="w-3.5 h-3.5 text-[#38A5F8]" />
              <span>Tablero Kanban (Drag & Drop)</span>
            </button>

            <button
              onClick={() => setActiveTab('audits')}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'audits' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Wrench className="w-3.5 h-3.5 text-slate-700" />
              <span>Planes Periódicos ({maintenanceReviews.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('billing_alerts')}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'billing_alerts' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <BellRing className="w-3.5 h-3.5 text-amber-500" />
              <span>Alertas de Cobro ({billingAlertsList.length})</span>
            </button>
          </div>

          {activeTab === 'audits' && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">Frecuencia:</span>
              <select
                value={selectedInterval}
                onChange={e => setSelectedInterval(e.target.value)}
                className="px-3 py-1.5 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:bg-white focus:outline-hidden"
              >
                <option value="all">Todas las Frecuencias</option>
                <option value="30">Cada 30 días (Mensual)</option>
                <option value="60">Cada 60 días (Bimestral)</option>
                <option value="90">Cada 90 días (Trimestral)</option>
                <option value="180">Cada 180 días (Semestral)</option>
              </select>
            </div>
          )}

          {activeTab === 'billing_alerts' && (
            <div className="flex items-center gap-2 text-xs">
              <span className="font-bold text-slate-500">Alertar con anticipación de:</span>
              <select
                value={daysBeforeBillingAlert}
                onChange={e => setDaysBeforeBillingAlert(Number(e.target.value))}
                className="px-3 py-1.5 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:bg-white focus:outline-hidden"
              >
                <option value={2}>2 días antes</option>
                <option value={3}>3 días antes</option>
                <option value={5}>5 días antes</option>
                <option value={7}>7 días antes</option>
              </select>
            </div>
          )}
        </div>

        {/* TAB 1: KANBAN DRAG & DROP BOARD */}
        {activeTab === 'kanban' && (
          <AuditKanbanBoard />
        )}

        {/* TAB 2: TECHNICAL AUDITS (30, 60, 90 DAYS) */}
        {activeTab === 'audits' && (
          <div className="space-y-6">
            {filteredReviews.map(review => {
              const project = projects.find(p => p.id === review.projectId);
              const client = clients.find(c => c.id === review.clientId);
              const isOverdue = review.status === 'Vencida' || review.status === 'Revisión Pendiente';
              const completedTasks = review.tasks.filter(t => t.completed || t.status === 'completed').length;
              const allTasksDone = completedTasks === review.tasks.length && review.tasks.length > 0;

              return (
                <div 
                  key={review.id} 
                  className={`bg-white rounded-2xl border shadow-xs overflow-hidden transition-all ${
                    isOverdue ? 'border-[#D81159]/40 ring-1 ring-[#D81159]/15' : 'border-slate-200'
                  }`}
                >
                  {/* Header */}
                  <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/40">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
                        <ShieldCheck className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <h3 className="text-base font-black text-slate-900">
                            {review.title}
                          </h3>
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-purple-50 text-purple-800 border border-purple-200">
                            Ciclo: Cada {review.intervalDays} días
                          </span>
                          <span className={`px-2 py-0.5 rounded-md text-[11px] font-black ${
                            review.status === 'Vencida'
                              ? 'bg-[#ffe4ee] text-[#D81159]'
                              : review.status === 'Revisión Pendiente'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {review.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          Proyecto: <strong className="text-slate-800">{project?.name}</strong> • Cliente: {client?.name} • Auditor asignado: <strong className="text-slate-700">{review.auditorName}</strong>
                        </p>
                      </div>
                    </div>

                    {/* Next Due Date & Reset Cycle Button */}
                    <div className="flex items-center gap-3 self-end md:self-center">
                      <div className="text-right">
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Próxima Revisión:</p>
                        <p className="text-xs font-black text-slate-900 font-mono">{review.nextReviewDate}</p>
                      </div>

                      <button
                        onClick={() => scheduleNextReview(review.id)}
                        className="px-3 py-1.5 text-xs font-bold text-[#1d8fe6] bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
                        title="Reiniciar checklist y programar siguiente ciclo de auditoría"
                      >
                        <RotateCw className="w-3.5 h-3.5" />
                        <span>Renovar Ciclo</span>
                      </button>
                    </div>
                  </div>

                  {/* Tasks Checklist Grid */}
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Checklist de Auditoría de Infraestructura ({completedTasks}/{review.tasks.length} completados)
                      </p>
                      {allTasksDone && (
                        <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>¡Auditoría 100% completada!</span>
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {review.tasks.map(task => {
                        let catIcon = <Database className="w-4 h-4 text-emerald-600" />;
                        let catLabel = 'Supabase';
                        let catBg = 'bg-emerald-50 text-emerald-800 border-emerald-200';

                        if (task.category === 'cloudflare') {
                          catIcon = <Globe className="w-4 h-4 text-amber-600" />;
                          catLabel = 'Cloudflare';
                          catBg = 'bg-amber-50 text-amber-800 border-amber-200';
                        } else if (task.category === 'github') {
                          catIcon = <GitBranch className="w-4 h-4 text-slate-700" />;
                          catLabel = 'GitHub';
                          catBg = 'bg-slate-100 text-slate-800 border-slate-200';
                        } else if (task.category === 'security') {
                          catIcon = <ShieldCheck className="w-4 h-4 text-red-600" />;
                          catLabel = 'Seguridad';
                          catBg = 'bg-red-50 text-red-800 border-red-200';
                        } else if (task.category === 'performance') {
                          catIcon = <Zap className="w-4 h-4 text-purple-600" />;
                          catLabel = 'Performance';
                          catBg = 'bg-purple-50 text-purple-800 border-purple-200';
                        }

                        const isDone = task.completed || task.status === 'completed';

                        return (
                          <div 
                            key={task.id}
                            onClick={() => toggleReviewTask(review.id, task.id)}
                            className={`p-3 rounded-xl border cursor-pointer select-none transition-all flex items-start gap-3 ${
                              isDone 
                                ? 'bg-emerald-50/40 border-emerald-200/80 text-slate-700' 
                                : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                            }`}
                          >
                            <div className="mt-0.5 shrink-0 text-[#38A5F8]">
                              {isDone ? (
                                <CheckSquare className="w-4 h-4 text-emerald-600" />
                              ) : (
                                <Square className="w-4 h-4 text-slate-400" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`text-[10px] font-black px-1.5 py-0.2 rounded border uppercase ${catBg}`}>
                                  {catLabel}
                                </span>
                                {task.priority && (
                                  <span className="text-[9px] font-bold text-slate-500 uppercase">
                                    • {task.priority}
                                  </span>
                                )}
                              </div>
                              <p className={`text-xs font-bold leading-snug ${isDone ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                                {task.title}
                              </p>
                              {task.description && (
                                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                                  {task.description}
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Notes & Client notification via WhatsApp */}
                    <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="text-slate-600">
                        <span className="font-bold text-slate-800">Observaciones: </span>
                        {review.notes}
                      </div>

                      {client?.phone && (
                        <WhatsAppButton
                          phone={client.phone}
                          clientName={client.name}
                          projectName={project?.name}
                          variant="primary"
                        />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 3: AUTOMATED BILLING ALERTS (N DAYS BEFORE DUE) */}
        {activeTab === 'billing_alerts' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Listado Automático de Facturas y Suscripciones Próximas a Vencer
                </h3>
                <p className="text-[11px] text-slate-500">
                  Detecta cobranzas que vencen en los próximos {daysBeforeBillingAlert} días o que ya están en mora.
                </p>
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {billingAlertsList.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs">
                  <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-500" />
                  <p className="font-bold text-slate-700">Sin alertas de cobro pendientes</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Todas las cuentas están al día o fuera del umbral de {daysBeforeBillingAlert} días.</p>
                </div>
              ) : (
                billingAlertsList.map(({ record, client, project, diffDays, isOverdue }) => {
                  const amountDue = record.paymentType === 'subscription' ? record.monthlyAmount : record.remainingBalance;

                  return (
                    <div key={record.id} className="p-4 hover:bg-slate-50/70 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className={`p-2.5 rounded-xl text-white shrink-0 ${isOverdue ? 'bg-[#D81159]' : 'bg-amber-500'}`}>
                          <BellRing className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-xs font-bold text-slate-900">
                              {client?.name}
                            </h4>
                            <span className="font-mono text-[10px] text-slate-400 font-bold bg-slate-100 px-1.5 py-0.5 rounded">
                              {client?.taxId}
                            </span>
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                              isOverdue ? 'bg-[#ffe4ee] text-[#D81159]' : 'bg-amber-50 text-amber-800'
                            }`}>
                              {isOverdue ? `En Mora (${Math.abs(diffDays)} días)` : `Vence en ${diffDays} días`}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-1">
                            Proyecto: {project?.name} • Cobro día {record.billingDay} de cada mes • Fecha límite: <strong className="text-slate-800 font-mono">{record.nextBillingDate}</strong>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end md:self-center shrink-0">
                        <div className="text-right">
                          <p className="text-xs font-black text-slate-900">${amountDue} USD</p>
                          <p className="text-[10px] text-slate-400">Total a liquidar</p>
                        </div>

                        {client?.phone && (
                          <WhatsAppButton
                            phone={client.phone}
                            clientName={client.name}
                            projectName={project?.name}
                            amountDue={amountDue}
                            dueDate={record.nextBillingDate}
                            variant="primary"
                          />
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
