import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface CopyButtonProps {
  textToCopy: string;
  label?: string;
  successMessage?: string;
  className?: string;
  size?: 'sm' | 'md';
}

export const CopyButton: React.FC<CopyButtonProps> = ({
  textToCopy,
  label,
  successMessage = 'Copiado al portapapeles',
  className = '',
  size = 'sm',
}) => {
  const [copied, setCopied] = useState(false);
  const { showToast } = useApp();

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      showToast(successMessage, 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast('No se pudo copiar automáticamente', 'error');
    }
  };

  const isSmall = size === 'sm';

  return (
    <button
      id={`copy-btn-${Math.random().toString(36).substring(2, 7)}`}
      type="button"
      onClick={handleCopy}
      title={label || 'Copiar al portapapeles'}
      className={`inline-flex items-center gap-1.5 font-medium transition-all rounded-md select-none ${
        copied
          ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
          : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 border border-slate-200/80'
      } ${
        isSmall
          ? 'px-2 py-1 text-[11px]'
          : 'px-3 py-1.5 text-xs'
      } ${className}`}
    >
      {copied ? (
        <>
          <Check className={isSmall ? 'w-3 h-3 text-emerald-600' : 'w-3.5 h-3.5 text-emerald-600'} />
          <span>Copiado</span>
        </>
      ) : (
        <>
          <Copy className={isSmall ? 'w-3 h-3 text-slate-500' : 'w-3.5 h-3.5 text-slate-500'} />
          {label && <span>{label}</span>}
        </>
      )}
    </button>
  );
};
