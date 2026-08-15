import React, { useState } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  AlertCircle, 
  Calendar, 
  CreditCard, 
  CheckCircle2, 
  Plus, 
  Search, 
  Filter, 
  Receipt,
  ArrowUpRight,
  ShieldAlert,
  Clock,
  ExternalLink,
  History
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Breadcrumbs } from '../layout/Breadcrumbs';
import { WhatsAppButton } from '../common/WhatsAppButton';
import { FinanceRecord, PaymentType } from '../../types';

export const FinanceView: React.FC = () => {
  const { 
    financeRecords, 
    clients, 
    projects, 
    mrrTotal, 
    accountsReceivableTotal, 
    inMoraCount, 
    inMoraAmount,
    openPaymentModalForRecord,
    setIsRecordPaymentModalOpen
  } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'subscriptions' | 'one_time' | 'mora'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBillingDay, setSelectedBillingDay] = useState<string>('all');
  const [selectedRecordForHistory, setSelectedRecordForHistory] = useState<FinanceRecord | null>(null);

  const filteredRecords = financeRecords.filter(f => {
    const client = clients.find(c => c.id === f.clientId);
    const project = projects.find(p => p.id === f.projectId);

    const matchesSearch = 
      (client && client.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (project && project.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (f.notes && f.notes.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesTab = 
      activeTab === 'all' ? true :
      activeTab === 'subscriptions' ? f.paymentType === 'subscription' :
      activeTab === 'one_time' ? f.paymentType === 'one_time' :
      activeTab === 'mora' ? (f.subscriptionStatus === 'En Mora' || f.oneTimeStatus === 'En Mora') : true;

    const matchesDay = 
      selectedBillingDay === 'all' ? true :
      f.billingDay === Number(selectedBillingDay);

    return matchesSearch && matchesTab && matchesDay;
  });

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#F8FAFC]">
      <Breadcrumbs
        title="Finanzas, Suscripciones y Cobros"
        subtitle="Control de MRR, facturación mensual recurrente y conciliación de pagos únicos"
        badge={{
          text: `MRR: $${mrrTotal.toLocaleString()} USD`,
          variant: 'green'
        }}
        primaryAction={{
          label: 'Registrar Cobro',
          onClick: () => setIsRecordPaymentModalOpen(true),
          icon: <DollarSign className="w-3.5 h-3.5" />
        }}
      />

      <div className="p-3 sm:p-6 space-y-4 sm:space-y-6 max-w-7xl w-full mx-auto">
        {/* TOP FINANCIAL METRICS WIDGETS (Required) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* MRR Widget */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs odoo-card">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                MRR Acumulado
              </span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#1d8fe6] flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-slate-900">
                ${mrrTotal.toLocaleString()}
              </span>
              <span className="text-xs font-bold text-slate-500">
                USD / mes
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 font-medium">
              Ingreso mensual predecible por hosting & soporte
            </p>
          </div>

          {/* Cuentas por Cobrar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs odoo-card">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Cuentas por Cobrar Totales
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Receipt className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-slate-900">
                ${accountsReceivableTotal.toLocaleString()}
              </span>
              <span className="text-xs font-bold text-slate-500">
                USD
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 font-medium">
              Saldos restantes + cuotas del mes pendientes
            </p>
          </div>

          {/* En Mora Widget (Badge in Magenta) */}
          <div className={`p-4 rounded-xl border shadow-xs odoo-card ${
            inMoraCount > 0 
              ? 'bg-[#fff5f8] border-[#D81159]/40 ring-1 ring-[#D81159]/20' 
              : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center justify-between">
              <span className={`text-xs font-bold uppercase tracking-wider ${inMoraCount > 0 ? 'text-[#D81159]' : 'text-slate-500'}`}>
                Cartera en Mora
              </span>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${inMoraCount > 0 ? 'bg-[#ffe4ee] text-[#D81159]' : 'bg-slate-100 text-slate-500'}`}>
                <AlertCircle className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className={`text-2xl font-black ${inMoraCount > 0 ? 'text-[#D81159]' : 'text-slate-900'}`}>
                ${inMoraAmount}
              </span>
              <span className={`text-xs font-bold ${inMoraCount > 0 ? 'text-[#D81159]' : 'text-slate-500'}`}>
                USD ({inMoraCount} {inMoraCount === 1 ? 'cliente' : 'clientes'})
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 font-medium">
              {inMoraCount > 0 ? 'Cobro urgente recomendado vía WhatsApp' : 'Sin atrasos registrados'}
            </p>
          </div>

          {/* Proyección Anual (ARR) */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs odoo-card">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                ARR Proyectado
              </span>
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-slate-900">
                ${(mrrTotal * 12).toLocaleString()}
              </span>
              <span className="text-xs font-bold text-slate-500">
                USD / año
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 font-medium">
              12 meses de recurrencia base
            </p>
          </div>
        </div>

        {/* CONTROLS & TABS */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Tabs */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl w-full md:w-auto overflow-x-auto">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${
                activeTab === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Todos ({financeRecords.length})
            </button>
            <button
              onClick={() => setActiveTab('subscriptions')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${
                activeTab === 'subscriptions' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Suscripciones Mensuales
            </button>
            <button
              onClick={() => setActiveTab('one_time')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${
                activeTab === 'one_time' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Proyectos Pago Único
            </button>
            <button
              onClick={() => setActiveTab('mora')}
              className={`px-3 py-1.5 text-xs font-black rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'mora' ? 'bg-[#D81159] text-white shadow-2xs' : 'text-[#D81159] hover:bg-[#ffe4ee]'
              }`}
            >
              <span>En Mora</span>
              {inMoraCount > 0 && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeTab === 'mora' ? 'bg-white text-[#D81159]' : 'bg-[#ffe4ee] text-[#D81159]'}`}>
                  {inMoraCount}
                </span>
              )}
            </button>
          </div>

          {/* Search & Billing Day filter */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Buscar cliente, concepto..."
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-hidden"
              />
            </div>

            {/* Filter by Exact Billing Day (1 to 31) */}
            <select
              value={selectedBillingDay}
              onChange={e => setSelectedBillingDay(e.target.value)}
              className="px-2.5 py-1.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:bg-white focus:outline-hidden"
              title="Filtrar por día exacto de cobro del mes (1 al 31)"
            >
              <option value="all">Día Cobro: Todos</option>
              {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                <option key={day} value={day}>
                  Día {day} del mes
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* MAIN FINANCIAL RECORDS TABLE (Salesforce Lightning Density) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-[11px] uppercase tracking-wider font-extrabold text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Cliente / Empresa</th>
                  <th className="py-3.5 px-4">Proyecto</th>
                  <th className="py-3.5 px-4">Modalidad</th>
                  <th className="py-3.5 px-4">Monto / Recurrencia</th>
                  <th className="py-3.5 px-4">Día de Cobro</th>
                  <th className="py-3.5 px-4">Estado del Pago</th>
                  <th className="py-3.5 px-4">Próximo Vencimiento</th>
                  <th className="py-3.5 px-4 text-right">Gestión de Cobro</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-400 text-xs">
                      No se encontraron registros de cobro con los filtros seleccionados.
                    </td>
                  </tr>
                ) : (
                  filteredRecords.map(record => {
                    const client = clients.find(c => c.id === record.clientId);
                    const project = projects.find(p => p.id === record.projectId);

                    const isSubscription = record.paymentType === 'subscription';
                    const isMora = isSubscription 
                      ? record.subscriptionStatus === 'En Mora' 
                      : record.oneTimeStatus === 'En Mora';

                    const isPaid = isSubscription
                      ? record.subscriptionStatus === 'Pagado'
                      : record.oneTimeStatus === 'Pagado Total';

                    const amountDue = isSubscription ? record.monthlyAmount : record.remainingBalance;

                    return (
                      <tr 
                        key={record.id} 
                        className={`transition-colors ${isMora ? 'bg-[#fff9fb] hover:bg-[#fff0f4]' : 'hover:bg-slate-50/80'}`}
                      >
                        {/* Client */}
                        <td className="py-3.5 px-4 font-bold text-slate-900">
                          <div>
                            <span className="block truncate max-w-[180px]">{client?.name}</span>
                            <span className="text-[10px] text-slate-400 font-mono font-medium">{client?.taxId}</span>
                          </div>
                        </td>

                        {/* Project */}
                        <td className="py-3.5 px-4 font-medium text-slate-700">
                          <span className="truncate max-w-[180px] block">{project?.name}</span>
                        </td>

                        {/* Payment Type */}
                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isSubscription ? 'bg-blue-50 text-[#1d8fe6]' : 'bg-purple-50 text-purple-700'
                          }`}>
                            {isSubscription ? 'Suscripción Mensual' : 'Pago Único'}
                          </span>
                        </td>

                        {/* Amount */}
                        <td className="py-3.5 px-4 font-mono">
                          {isSubscription ? (
                            <div>
                              <span className="font-extrabold text-slate-900 text-sm">
                                ${record.monthlyAmount} USD
                              </span>
                              <span className="text-[10px] text-slate-400 block">/ mes recurrente</span>
                            </div>
                          ) : (
                            <div>
                              <span className="font-extrabold text-slate-900 text-sm">
                                Total: ${record.totalAmount} USD
                              </span>
                              <span className="text-[11px] text-slate-500 block">
                                Abono: ${record.initialDeposit} • <strong>Resta: ${record.remainingBalance}</strong>
                              </span>
                            </div>
                          )}
                        </td>

                        {/* Billing Day */}
                        <td className="py-3.5 px-4 font-semibold text-slate-700">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            <span>Día {record.billingDay} de cada mes</span>
                          </div>
                        </td>

                        {/* Status (Magenta for Mora) */}
                        <td className="py-3.5 px-4">
                          {isMora ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black bg-[#ffe4ee] text-[#D81159] border border-[#D81159]/20 shadow-2xs">
                              <AlertCircle className="w-3.5 h-3.5" />
                              <span>En Mora</span>
                            </span>
                          ) : isPaid ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Pagado</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                              <Clock className="w-3.5 h-3.5" />
                              <span>Pendiente</span>
                            </span>
                          )}
                        </td>

                        {/* Next Billing Date */}
                        <td className="py-3.5 px-4 font-mono font-medium text-slate-600 text-[11px]">
                          {record.nextBillingDate}
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* WhatsApp Button with prefilled amount & due date */}
                            {client?.phone && (
                              <WhatsAppButton
                                phone={client.phone}
                                clientName={client.name}
                                projectName={project?.name}
                                amountDue={amountDue}
                                dueDate={record.nextBillingDate}
                                variant="compact"
                              />
                            )}

                            {/* View History */}
                            <button
                              onClick={() => setSelectedRecordForHistory(record)}
                              className="p-1.5 text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                              title="Ver historial de transacciones"
                            >
                              <History className="w-3.5 h-3.5" />
                            </button>

                            {/* Record Payment Button */}
                            <button
                              onClick={() => openPaymentModalForRecord(record.id)}
                              className="px-2.5 py-1 text-xs font-bold text-white bg-[#38A5F8] hover:bg-[#1d8fe6] rounded-lg transition-colors shadow-2xs whitespace-nowrap"
                            >
                              + Cobrar
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* TRANSACTION HISTORY MODAL */}
      {selectedRecordForHistory && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div 
            className="fixed inset-0" 
            onClick={() => setSelectedRecordForHistory(null)} 
          />

          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Historial de Transacciones</h3>
                <p className="text-xs text-slate-500">Registro de cobros conciliados en Goolo System</p>
              </div>
              <button
                onClick={() => setSelectedRecordForHistory(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-3 text-xs max-h-80 overflow-y-auto">
              {selectedRecordForHistory.paymentHistory.length === 0 ? (
                <p className="text-center py-6 text-slate-400">Sin pagos registrados aún.</p>
              ) : (
                selectedRecordForHistory.paymentHistory.map(tx => (
                  <div key={tx.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">${tx.amount} USD</span>
                        <span className="px-1.5 py-0.5 rounded bg-blue-50 text-[#1d8fe6] text-[10px] font-bold">
                          {tx.method}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Ref: <span className="font-mono">{tx.reference}</span> • Fecha: {tx.date}
                      </p>
                      {tx.notes && (
                        <p className="text-[10px] text-slate-400 italic mt-0.5">{tx.notes}</p>
                      )}
                    </div>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  </div>
                ))
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedRecordForHistory(null)}
                className="px-4 py-2 bg-slate-900 text-white font-bold rounded-xl text-xs"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
