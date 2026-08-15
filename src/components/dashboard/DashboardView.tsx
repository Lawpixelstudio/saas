import React from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  AlertCircle, 
  Wrench, 
  Code2, 
  Building2, 
  ShieldAlert, 
  ArrowUpRight, 
  ExternalLink,
  CheckCircle2,
  Clock,
  Globe,
  Database,
  GitBranch,
  MessageCircle,
  Plus,
  Activity,
  Users
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Breadcrumbs } from '../layout/Breadcrumbs';
import { WhatsAppButton } from '../common/WhatsAppButton';
import { SiteStatusBadge } from '../common/SiteStatusBadge';

export const DashboardView: React.FC = () => {
  const { 
    mrrTotal, 
    accountsReceivableTotal, 
    inMoraCount, 
    inMoraAmount,
    pendingReviewsCount,
    clients,
    projects,
    financeRecords,
    maintenanceReviews,
    setCurrentModule,
    setSelectedClientId,
    setSelectedProjectId,
    setIsNewClientModalOpen,
    setIsNewProjectModalOpen,
    setIsRecordPaymentModalOpen,
    openPaymentModalForRecord
  } = useApp();

  const moraRecords = financeRecords.filter(
    f => (f.paymentType === 'subscription' && f.subscriptionStatus === 'En Mora') ||
         (f.paymentType === 'one_time' && f.oneTimeStatus === 'En Mora')
  );

  const upcomingBillingRecords = financeRecords.filter(f => {
    if (f.paymentType === 'subscription') {
      return f.subscriptionStatus === 'Pendiente' || f.subscriptionStatus === 'En Mora';
    }
    return f.remainingBalance && f.remainingBalance > 0;
  });

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#F8FAFC]">
      {/* Salesforce-Style Record Header */}
      <Breadcrumbs
        title="Dashboard General"
        subtitle="Monitoreo en tiempo real de infraestructura, ingresos recurrentes y estado de clientes"
        badge={{
          text: 'Producción Activa',
          variant: 'blue'
        }}
        primaryAction={{
          label: 'Registrar Cobro',
          onClick: () => setIsRecordPaymentModalOpen(true),
          icon: <DollarSign className="w-3.5 h-3.5" />
        }}
        secondaryAction={{
          label: 'Nuevo Cliente',
          onClick: () => setIsNewClientModalOpen(true),
          icon: <Building2 className="w-3.5 h-3.5" />
        }}
      />

      {/* Main Content Area */}
      <div className="p-3 sm:p-6 space-y-4 sm:space-y-6 max-w-7xl w-full mx-auto">
        {/* KEY METRICS RIBBON (Salesforce Lightning Design System style) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: MRR */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs odoo-card">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                MRR (Ingreso Recurrente)
              </span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#1d8fe6] flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">
                ${mrrTotal.toLocaleString()}
              </span>
              <span className="text-xs font-bold text-emerald-600">
                USD / mes
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 font-medium">
              Suscripciones activas de hosting & soporte
            </p>
          </div>

          {/* Card 2: Cuentas por Cobrar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs odoo-card">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Cuentas por Cobrar
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">
                ${accountsReceivableTotal.toLocaleString()}
              </span>
              <span className="text-xs font-bold text-slate-500">
                USD Total
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 font-medium">
              Saldos pendientes + mensualidades
            </p>
          </div>

          {/* Card 3: Clientes en Mora (Magenta Alert) */}
          <div className={`p-4 rounded-xl border shadow-xs odoo-card transition-all ${
            inMoraCount > 0 
              ? 'bg-gradient-to-br from-[#FFFFFF] to-[#fff1f5] border-[#D81159]/40 ring-1 ring-[#D81159]/20' 
              : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center justify-between">
              <span className={`text-xs font-bold uppercase tracking-wider ${inMoraCount > 0 ? 'text-[#D81159]' : 'text-slate-500'}`}>
                Clientes en Mora
              </span>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${inMoraCount > 0 ? 'bg-[#ffe4ee] text-[#D81159]' : 'bg-slate-100 text-slate-500'}`}>
                <AlertCircle className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className={`text-2xl font-black ${inMoraCount > 0 ? 'text-[#D81159]' : 'text-slate-900'}`}>
                {inMoraCount} {inMoraCount === 1 ? 'cliente' : 'clientes'}
              </span>
              {inMoraCount > 0 && (
                <span className="text-xs font-black text-[#D81159]">
                  (${inMoraAmount} USD)
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 mt-1 font-medium">
              {inMoraCount > 0 ? 'Alerta activa de cobro vía WhatsApp' : 'Cartera 100% al día'}
            </p>
          </div>

          {/* Card 4: Revisiones Técnicas */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs odoo-card">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Auditorías Técnicas
              </span>
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                <Wrench className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">
                {pendingReviewsCount}
              </span>
              <span className="text-xs font-bold text-amber-600">
                Pendientes
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 font-medium">
              Supabase, Cloudflare & GitHub (30/60/90d)
            </p>
          </div>
        </div>

        {/* MORA ALERT BANNER (If any client in Mora) */}
        {inMoraCount > 0 && (
          <div className="p-4 bg-[#ffe4ee] border border-[#D81159]/30 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-in slide-in-from-top-2 duration-200">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#D81159] text-white rounded-xl shadow-xs shrink-0">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-black text-[#D81159]">
                  Atención: Hay {inMoraCount} cuenta(s) con mensualidad vencida
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-700 mt-0.5">
                  Monto total en mora: <strong className="text-[#D81159] font-black">${inMoraAmount} USD</strong>. Se recomienda enviar recordatorio por WhatsApp directo.
                </p>
              </div>
            </div>

            <button
              onClick={() => setCurrentModule('finance')}
              className="px-4 py-2 text-xs font-bold bg-[#D81159] text-white hover:bg-[#b80c49] rounded-xl shadow-sm transition-all whitespace-nowrap"
            >
              Gestionar Cobros en Mora →
            </button>
          </div>
        )}

        {/* MODULAR WIDGETS GRID (Odoo Style) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Widget 1: Proyectos & Estado de Infraestructura (Col Span 2) */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-[#38A5F8]" />
                <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                  Proyectos e Infraestructura en Vivo
                </h3>
              </div>
              <button
                onClick={() => setCurrentModule('projects')}
                className="text-xs font-bold text-[#1d8fe6] hover:underline flex items-center gap-1"
              >
                <span>Ver Todos ({projects.length})</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {projects.slice(0, 4).map(project => {
                const client = clients.find(c => c.id === project.clientId);
                return (
                  <div 
                    key={project.id} 
                    className="p-4 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-black text-xs shrink-0">
                        {project.deliveryType === 'PWA' ? 'PWA' : project.deliveryType === 'E-commerce' ? 'ECO' : 'WEB'}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 
                            onClick={() => {
                              setSelectedProjectId(project.id);
                              setCurrentModule('projects');
                            }}
                            className="text-xs font-bold text-slate-900 hover:text-[#1d8fe6] cursor-pointer truncate"
                          >
                            {project.name}
                          </h4>
                          <span className="text-[10px] px-2 py-0.5 font-bold rounded-md bg-slate-100 text-slate-600">
                            {project.deliveryType}
                          </span>
                          <SiteStatusBadge 
                            project={project} 
                            variant="badge" 
                            showUptime={true} 
                            interactive={true} 
                          />
                          <span className="text-[10px] font-mono font-bold text-blue-600 bg-blue-50 px-1.5 py-0.2 rounded">
                            {project.siteApi?.visitsToday.toLocaleString() || 0} visitas hoy
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">
                          {client?.name} • <a href={project.liveUrl} target="_blank" rel="noreferrer" className="text-[#1d8fe6] hover:underline font-mono">{project.cloudflare.domain}</a>
                        </p>

                        {/* Tech Stack & Health Chips */}
                        <div className="flex items-center gap-2 mt-2 text-[10px] text-slate-600 font-mono flex-wrap">
                          <span className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                            <Clock className="w-3 h-3 text-slate-500" />
                            {project.siteApi?.latencyMs || 45}ms
                          </span>
                          <span className="flex items-center gap-1 bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded">
                            <Activity className="w-3 h-3 text-emerald-600" />
                            Uptime {project.siteApi?.uptimePercentage || 99.9}%
                          </span>
                          <span className="flex items-center gap-1 bg-blue-50 text-blue-800 px-2 py-0.5 rounded">
                            <Users className="w-3 h-3 text-blue-600" />
                            {project.siteApi?.isPaused ? 0 : project.siteApi?.liveActiveVisitors || 0} en vivo
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1"
                      >
                        <span>Visitar</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Widget 2: Alertas de Cobro y Próximos Vencimientos */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                  Próximos Cobros
                </h3>
              </div>
              <button
                onClick={() => setCurrentModule('finance')}
                className="text-xs font-bold text-[#1d8fe6] hover:underline"
              >
                Ver Finanzas
              </button>
            </div>

            <div className="p-3 divide-y divide-slate-100 flex-1 overflow-y-auto max-h-96">
              {upcomingBillingRecords.map(record => {
                const client = clients.find(c => c.id === record.clientId);
                const isMora = record.subscriptionStatus === 'En Mora' || record.oneTimeStatus === 'En Mora';
                const dueAmount = record.paymentType === 'subscription' ? record.monthlyAmount : record.remainingBalance;

                return (
                  <div key={record.id} className="py-3 first:pt-1 last:pb-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-xs font-bold text-slate-900 truncate">
                          {client?.name}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {record.paymentType === 'subscription' 
                            ? `Cobro recurrente: Día ${record.billingDay}` 
                            : 'Saldo pendiente contra entrega'}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className={`text-xs font-black ${isMora ? 'text-[#D81159]' : 'text-slate-900'}`}>
                          ${dueAmount} USD
                        </span>
                        <span className={`block text-[9px] font-black uppercase px-1.5 py-0.2 rounded mt-0.5 ${
                          isMora ? 'bg-[#ffe4ee] text-[#D81159]' : 'bg-amber-50 text-amber-700'
                        }`}>
                          {record.paymentType === 'subscription' ? record.subscriptionStatus : record.oneTimeStatus}
                        </span>
                      </div>
                    </div>

                    {/* Actions: WhatsApp Direct or Record Payment */}
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                      {client?.phone && (
                        <WhatsAppButton
                          phone={client.phone}
                          clientName={client.name}
                          amountDue={dueAmount}
                          dueDate={record.nextBillingDate}
                          variant="compact"
                        />
                      )}
                      <button
                        onClick={() => openPaymentModalForRecord(record.id)}
                        className="px-2.5 py-1 text-[11px] font-bold text-white bg-[#38A5F8] hover:bg-[#1d8fe6] rounded-md transition-colors shadow-2xs"
                      >
                        Registrar Pago
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* SECOND ROW: REVISIONES DE MANTENIMIENTO (30/60/90 DÍAS) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2">
              <Wrench className="w-4 h-4 text-purple-600" />
              <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                Revisiones Periódicas de Sistema & Auditorías Programadas
              </h3>
            </div>
            <button
              onClick={() => setCurrentModule('maintenance')}
              className="text-xs font-bold text-[#1d8fe6] hover:underline"
            >
              Ir a Mantenimiento ({maintenanceReviews.length})
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
            {maintenanceReviews.map(review => {
              const project = projects.find(p => p.id === review.projectId);
              const isVencida = review.status === 'Vencida' || review.status === 'Revisión Pendiente';
              const completedTasksCount = review.tasks.filter(t => t.completed).length;

              return (
                <div 
                  key={review.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    isVencida 
                      ? 'bg-red-50/30 border-[#D81159]/30 ring-1 ring-[#D81159]/10' 
                      : 'bg-slate-50/60 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-purple-100 text-purple-800">
                      Cada {review.intervalDays} días
                    </span>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                      review.status === 'Vencida'
                        ? 'bg-[#ffe4ee] text-[#D81159]'
                        : review.status === 'Revisión Pendiente'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {review.status}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 mt-2 line-clamp-1">
                    {project?.name || review.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Próxima: <strong className="text-slate-800">{review.nextReviewDate}</strong>
                  </p>

                  <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Checklist:</span>
                    <span className="font-bold text-slate-800">
                      {completedTasksCount}/{review.tasks.length} verificados
                    </span>
                  </div>

                  <button
                    onClick={() => setCurrentModule('maintenance')}
                    className="w-full mt-2.5 py-1 text-[11px] font-bold text-[#1d8fe6] bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                  >
                    Abrir Auditoría
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
