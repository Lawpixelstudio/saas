import React, { useState } from 'react';
import { MessageCircle, ChevronDown, Send } from 'lucide-react';

interface WhatsAppButtonProps {
  phone: string;
  clientName: string;
  projectName?: string;
  amountDue?: number;
  dueDate?: string;
  variant?: 'primary' | 'compact' | 'outline';
  customMessage?: string;
  className?: string;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  phone,
  clientName,
  projectName,
  amountDue,
  dueDate,
  variant = 'primary',
  customMessage,
  className = '',
}) => {
  const [showTemplates, setShowTemplates] = useState(false);

  // Clean phone number: remove spaces, plus, hyphens for wa.me
  const cleanPhone = phone.replace(/[^0-9]/g, '');

  const templates = [
    {
      id: 'general',
      label: 'Contacto General',
      text: `Hola ${clientName}, le saludamos del equipo técnico de Goolo System respecto a su plataforma web ${projectName ? `(${projectName})` : ''}. ¿En qué podemos apoyarle hoy?`,
    },
    {
      id: 'payment_reminder',
      label: 'Recordatorio de Cobro',
      text: `Estimado(a) ${clientName}, le escribimos de Goolo System para recordarle su estado de cuenta${amountDue ? ` por un monto de $${amountDue} USD` : ''}${dueDate ? ` con fecha de vencimiento ${dueDate}` : ''}. Quedamos atentos para registrar su comprobante de pago. ¡Muchas gracias!`,
    },
    {
      id: 'maintenance_done',
      label: 'Auditoría Técnica Completada',
      text: `Hola ${clientName}, le informamos que completamos con éxito la auditoría periódica de infraestructura y seguridad de ${projectName || 'su proyecto'} (Cloudflare SSL, Supabase DB & GitHub). Todo el sistema opera con normalidad y óptimo rendimiento.`,
    },
    {
      id: 'mora_alert',
      label: 'Aviso de Pago en Mora',
      text: `Estimado(a) ${clientName}, le contactamos cordialmente de Goolo System para coordinar la regularización de la mensualidad pendiente de su plataforma${amountDue ? ` ($${amountDue} USD)` : ''}. Agradecemos su confirmación para mantener activos los servicios de hosting y soporte.`,
    }
  ];

  const getWaLink = (message: string) => {
    const encoded = encodeURIComponent(message);
    return `https://wa.me/${cleanPhone}?text=${encoded}`;
  };

  const defaultText = customMessage || templates[0].text;

  if (variant === 'compact') {
    return (
      <a
        id={`wa-btn-compact-${cleanPhone}`}
        href={getWaLink(defaultText)}
        target="_blank"
        rel="noopener noreferrer"
        title={`Abrir WhatsApp con ${clientName}`}
        className={`inline-flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all shadow-xs ${className}`}
      >
        <MessageCircle className="w-4 h-4" />
      </a>
    );
  }

  return (
    <div className="relative inline-block text-left">
      <div className="inline-flex rounded-lg shadow-xs">
        <a
          id={`wa-btn-primary-${cleanPhone}`}
          href={getWaLink(defaultText)}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-l-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors ${className}`}
        >
          <MessageCircle className="w-3.5 h-3.5" />
          <span>WhatsApp Directo</span>
        </a>
        <button
          id={`wa-dropdown-toggle-${cleanPhone}`}
          type="button"
          onClick={() => setShowTemplates(prev => !prev)}
          className="inline-flex items-center px-1.5 py-1.5 text-xs font-medium rounded-r-lg bg-emerald-700 text-white hover:bg-emerald-800 border-l border-emerald-800 transition-colors"
          title="Ver plantillas de mensaje"
        >
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
      </div>

      {showTemplates && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowTemplates(false)} 
          />
          <div className="absolute right-0 mt-2 w-72 origin-top-right rounded-xl bg-white shadow-xl ring-1 ring-black/5 divide-y divide-slate-100 z-50 animate-in fade-in zoom-in-95 duration-100 p-1">
            <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Plantillas de Chat
            </div>
            <div className="py-1">
              {templates.map(tmpl => (
                <a
                  key={tmpl.id}
                  href={getWaLink(tmpl.text)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setShowTemplates(false)}
                  className="flex items-start gap-2.5 px-3 py-2 text-xs text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 rounded-lg group transition-colors"
                >
                  <Send className="w-3.5 h-3.5 mt-0.5 text-emerald-600 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                  <div>
                    <p className="font-medium text-slate-900">{tmpl.label}</p>
                    <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">{tmpl.text}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
