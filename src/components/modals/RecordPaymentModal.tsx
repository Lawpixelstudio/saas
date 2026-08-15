import React, { useState, useEffect } from 'react';
import { X, DollarSign, CreditCard, Calendar, CheckCircle2, ShieldCheck, FileCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PaymentMethod } from '../../types';

export const RecordPaymentModal: React.FC = () => {
  const { 
    isRecordPaymentModalOpen, 
    setIsRecordPaymentModalOpen, 
    paymentModalDefaultRecordId,
    financeRecords,
    clients,
    projects,
    recordPayment 
  } = useApp();

  const [selectedRecordId, setSelectedRecordId] = useState<string>('');
  const [amount, setAmount] = useState<number>(0);
  const [method, setMethod] = useState<PaymentMethod>('Zelle');
  const [reference, setReference] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  // When modal opens, set the target record
  useEffect(() => {
    if (paymentModalDefaultRecordId && financeRecords.some(f => f.id === paymentModalDefaultRecordId)) {
      setSelectedRecordId(paymentModalDefaultRecordId);
    } else if (financeRecords.length > 0) {
      setSelectedRecordId(financeRecords[0].id);
    }
  }, [paymentModalDefaultRecordId, financeRecords, isRecordPaymentModalOpen]);

  // When selectedRecordId changes, auto-populate amount with current due
  useEffect(() => {
    const record = financeRecords.find(f => f.id === selectedRecordId);
    if (record) {
      if (record.paymentType === 'subscription') {
        setAmount(record.monthlyAmount || 0);
        setNotes(`Mensualidad de suscripción (${record.billingDay} de cada mes)`);
      } else {
        setAmount(record.remainingBalance || 0);
        setNotes(`Abono / Liquidación saldo de desarrollo`);
      }
    }
  }, [selectedRecordId, financeRecords]);

  if (!isRecordPaymentModalOpen) return null;

  const currentRecord = financeRecords.find(f => f.id === selectedRecordId);
  const currentClient = clients.find(c => c.id === currentRecord?.clientId);
  const currentProject = projects.find(p => p.id === currentRecord?.projectId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecordId || amount <= 0) return;

    recordPayment(selectedRecordId, {
      date,
      amount: Number(amount),
      method,
      reference: reference.trim() || `REF-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      notes: notes.trim(),
    });

    setIsRecordPaymentModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="fixed inset-0" 
        onClick={() => setIsRecordPaymentModalOpen(false)} 
      />

      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Registrar Cobro / Pago</h2>
              <p className="text-xs text-slate-500">Goolo System • Conciliación Financiera Inmediata</p>
            </div>
          </div>
          <button
            onClick={() => setIsRecordPaymentModalOpen(false)}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Select Account / Project */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Cuenta / Cliente a Liquidar *
            </label>
            <select
              value={selectedRecordId}
              onChange={e => setSelectedRecordId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium focus:bg-white focus:border-[#38A5F8] focus:outline-hidden"
            >
              {financeRecords.map(f => {
                const c = clients.find(cl => cl.id === f.clientId);
                const p = projects.find(pr => pr.id === f.projectId);
                const label = f.paymentType === 'subscription'
                  ? `${c?.name || 'Cliente'} • Suscripción ($${f.monthlyAmount}/mes) • ${f.subscriptionStatus}`
                  : `${c?.name || 'Cliente'} • Pago Único (${p?.name}) • Saldo: $${f.remainingBalance}`;
                return (
                  <option key={f.id} value={f.id}>
                    {label}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Current Status Box */}
          {currentRecord && (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <p className="text-[11px] text-slate-500">Cliente & Proyecto</p>
                <p className="font-bold text-slate-900 text-xs">{currentClient?.name}</p>
                <p className="text-[11px] text-slate-500">{currentProject?.name}</p>
              </div>
              <div className="text-right">
                <p className="text-[11px] text-slate-500">Modalidad</p>
                <p className="font-bold text-slate-800 text-xs">
                  {currentRecord.paymentType === 'subscription' ? 'Suscripción Mensual' : 'Pago Único'}
                </p>
                <span className={`inline-block mt-0.5 text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                  currentRecord.subscriptionStatus === 'En Mora' || currentRecord.oneTimeStatus === 'En Mora'
                    ? 'bg-[#ffe4ee] text-[#D81159]'
                    : 'bg-amber-50 text-amber-700'
                }`}>
                  {currentRecord.paymentType === 'subscription' ? currentRecord.subscriptionStatus : currentRecord.oneTimeStatus}
                </span>
              </div>
            </div>
          )}

          {/* Amount & Method */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Monto Recibido ($ USD) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 font-bold text-slate-400">$</span>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  required
                  value={amount}
                  onChange={e => setAmount(Number(e.target.value))}
                  className="w-full pl-7 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-bold focus:bg-white focus:border-[#38A5F8] focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Método de Pago *
              </label>
              <select
                value={method}
                onChange={e => setMethod(e.target.value as PaymentMethod)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:border-[#38A5F8] focus:outline-hidden"
              >
                <option value="Zelle">Zelle (USD)</option>
                <option value="Transferencia">Transferencia Bancaria Internacional</option>
                <option value="Pago Móvil">Pago Móvil (BCV)</option>
                <option value="Crypto (USDT)">Crypto (USDT / Binance Pay)</option>
                <option value="Stripe">Stripe / Tarjeta de Crédito</option>
                <option value="Efectivo">Efectivo (USD Cash)</option>
              </select>
            </div>
          </div>

          {/* Reference & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Nro. de Referencia / Comprobante
              </label>
              <input
                type="text"
                value={reference}
                onChange={e => setReference(e.target.value)}
                placeholder="Ej. ZLL-991823 / 0x489f..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:bg-white focus:border-[#38A5F8] focus:outline-hidden font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Fecha del Pago
              </label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:border-[#38A5F8] focus:outline-hidden"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Notas / Descripción de Conciliación
            </label>
            <input
              type="text"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Ej. Mensualidad Agosto + Soporte adicional"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:bg-white focus:border-[#38A5F8] focus:outline-hidden"
            />
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setIsRecordPaymentModalOpen(false)}
              className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm shadow-emerald-600/25 transition-all flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirmar y Conciliar Pago</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
