import React, { useState, useEffect } from 'react';
import { 
  X, 
  Building2, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Globe, 
  KeyRound, 
  GitBranch, 
  Database, 
  Cloud, 
  Eye, 
  EyeOff, 
  ShieldCheck,
  Save,
  Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ClientCategory, ClientStatus } from '../../types';

export const EditClientModal: React.FC = () => {
  const { 
    isEditClientModalOpen, 
    setIsEditClientModalOpen, 
    clientToEdit, 
    updateClient 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'general' | 'github' | 'supabase' | 'cloudflare'>('general');

  // General & Fiscal
  const [name, setName] = useState('');
  const [taxId, setTaxId] = useState('');
  const [domain, setDomain] = useState('');
  const [legalRepresentative, setLegalRepresentative] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [category, setCategory] = useState<ClientCategory>('Pyme');
  const [status, setStatus] = useState<ClientStatus>('Activo');
  const [notesSummary, setNotesSummary] = useState('');

  // GitHub Platform
  const [githubEmail, setGithubEmail] = useState('');
  const [githubLogin, setGithubLogin] = useState('');
  const [githubRepo, setGithubRepo] = useState('');
  const [githubPrivateKey, setGithubPrivateKey] = useState('');
  const [showGithubKey, setShowGithubKey] = useState(false);

  // Supabase Platform
  const [supabaseEmail, setSupabaseEmail] = useState('');
  const [supabaseLogin, setSupabaseLogin] = useState('');
  const [supabasePrivateKey, setSupabasePrivateKey] = useState('');
  const [showSupabaseKey, setShowSupabaseKey] = useState(false);

  // Cloudflare Platform
  const [cloudflareEmail, setCloudflareEmail] = useState('');
  const [cloudflareLogin, setCloudflareLogin] = useState('');
  const [cloudflarePrivateKey, setCloudflarePrivateKey] = useState('');
  const [showCloudflareKey, setShowCloudflareKey] = useState(false);

  useEffect(() => {
    if (clientToEdit) {
      setName(clientToEdit.name || '');
      setTaxId(clientToEdit.taxId || '');
      setDomain(clientToEdit.domain || '');
      setLegalRepresentative(clientToEdit.legalRepresentative || '');
      setPhone(clientToEdit.phone || '');
      setEmail(clientToEdit.email || '');
      setAddress(clientToEdit.address || '');
      setCategory(clientToEdit.category || 'Pyme');
      setStatus(clientToEdit.status || 'Activo');
      setNotesSummary(clientToEdit.notesSummary || '');

      setGithubEmail(clientToEdit.githubEmail || '');
      setGithubLogin(clientToEdit.githubLogin || '');
      setGithubRepo(clientToEdit.githubRepo || '');
      setGithubPrivateKey(clientToEdit.githubPrivateKey || '');

      setSupabaseEmail(clientToEdit.supabaseEmail || '');
      setSupabaseLogin(clientToEdit.supabaseLogin || '');
      setSupabasePrivateKey(clientToEdit.supabasePrivateKey || '');

      setCloudflareEmail(clientToEdit.cloudflareEmail || '');
      setCloudflareLogin(clientToEdit.cloudflareLogin || '');
      setCloudflarePrivateKey(clientToEdit.cloudflarePrivateKey || '');
    }
  }, [clientToEdit]);

  if (!isEditClientModalOpen || !clientToEdit) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !taxId.trim()) return;

    const cleanDomain = domain.trim().replace(/^https?:\/\//, '').replace(/\/$/, '') || `${name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`;

    updateClient(clientToEdit.id, {
      name: name.trim(),
      taxId: taxId.trim(),
      domain: cleanDomain,
      legalRepresentative: legalRepresentative.trim(),
      phone: phone.trim(),
      email: email.trim(),
      address: address.trim(),
      category,
      status,
      notesSummary: notesSummary.trim(),

      githubEmail: githubEmail.trim(),
      githubLogin: githubLogin.trim(),
      githubRepo: githubRepo.trim(),
      githubPrivateKey: githubPrivateKey.trim(),

      supabaseEmail: supabaseEmail.trim(),
      supabaseLogin: supabaseLogin.trim(),
      supabasePrivateKey: supabasePrivateKey.trim(),

      cloudflareEmail: cloudflareEmail.trim(),
      cloudflareLogin: cloudflareLogin.trim(),
      cloudflarePrivateKey: cloudflarePrivateKey.trim(),
    });

    setIsEditClientModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="fixed inset-0" 
        onClick={() => setIsEditClientModalOpen(false)} 
      />

      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 text-[#1d8fe6]">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Editar Ficha de Cliente</h2>
              <p className="text-xs text-slate-500">Actualizar datos fiscales, dominio, claves privadas y accesos</p>
            </div>
          </div>
          <button
            onClick={() => setIsEditClientModalOpen(false)}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 pt-3 bg-slate-50/50 border-b border-slate-200 flex items-center gap-2 shrink-0 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('general')}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'general'
                ? 'border-[#38A5F8] text-[#1d8fe6]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>1. Fiscal & Contacto</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('github')}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'github'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5" />
            <span>2. GitHub & Repositorio</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('supabase')}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'supabase'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>3. Supabase Backend</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('cloudflare')}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'cloudflare'
                ? 'border-amber-500 text-amber-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Cloud className="w-3.5 h-3.5" />
            <span>4. Cloudflare DNS & WAF</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          {/* TAB 1: GENERAL & FISCAL */}
          {activeTab === 'general' && (
            <div className="space-y-4 animate-in fade-in duration-100">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Empresa / Razón Social *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-[#38A5F8] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    RIF / ID Fiscal *
                  </label>
                  <input
                    type="text"
                    required
                    value={taxId}
                    onChange={e => setTaxId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-[#38A5F8] focus:outline-hidden font-mono uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-[#38A5F8]" />
                    Dominio del Cliente
                  </label>
                  <input
                    type="text"
                    value={domain}
                    onChange={e => setDomain(e.target.value)}
                    placeholder="cliente.com"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-[#38A5F8] focus:outline-hidden font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    Representante Legal
                  </label>
                  <input
                    type="text"
                    value={legalRepresentative}
                    onChange={e => setLegalRepresentative(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-[#38A5F8] focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    Teléfono & WhatsApp *
                  </label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-[#38A5F8] focus:outline-hidden font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-[#38A5F8] focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Categoría</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as ClientCategory)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-[#38A5F8] focus:outline-hidden"
                  >
                    <option value="Restaurante">Restaurante / Gastronomía</option>
                    <option value="E-commerce">E-commerce / Retail</option>
                    <option value="Startup">Startup / Fintech</option>
                    <option value="Enterprise">Enterprise / Corporativo</option>
                    <option value="Pyme">Pyme / Servicios</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Estado</label>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value as ClientStatus)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-[#38A5F8] focus:outline-hidden"
                  >
                    <option value="Activo">Activo</option>
                    <option value="En Onboarding">En Onboarding</option>
                    <option value="Inactivo">Inactivo</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Dirección</label>
                  <input
                    type="text"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-[#38A5F8] focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Notas Internas</label>
                <textarea
                  rows={2}
                  value={notesSummary}
                  onChange={e => setNotesSummary(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-[#38A5F8] focus:outline-hidden resize-none"
                />
              </div>
            </div>
          )}

          {/* TAB 2: GITHUB */}
          {activeTab === 'github' && (
            <div className="space-y-4 animate-in fade-in duration-100">
              <div className="p-3 bg-slate-900 text-white rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GitBranch className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold text-xs">Configuración de GitHub & Repositorio</span>
                </div>
                <span className="text-[10px] text-slate-400">Control de versiones</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Correo Asociado a GitHub
                  </label>
                  <input
                    type="email"
                    value={githubEmail}
                    onChange={e => setGithubEmail(e.target.value)}
                    placeholder="devops@cliente.com"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-slate-900 focus:outline-hidden font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Login / Usuario de GitHub
                  </label>
                  <input
                    type="text"
                    value={githubLogin}
                    onChange={e => setGithubLogin(e.target.value)}
                    placeholder="usuario-github"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-slate-900 focus:outline-hidden font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Nombre del Repositorio *</span>
                  <span className="text-[10px] text-slate-400 font-mono">ej. org/nombre-repositorio</span>
                </label>
                <input
                  type="text"
                  value={githubRepo}
                  onChange={e => setGithubRepo(e.target.value)}
                  placeholder="goolo-agency/proyecto-app"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-slate-900 focus:outline-hidden font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-amber-700">
                    <KeyRound className="w-3.5 h-3.5" />
                    Clave Privada / Personal Access Token (PAT)
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowGithubKey(!showGithubKey)}
                    className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center gap-1"
                  >
                    {showGithubKey ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    {showGithubKey ? 'Ocultar' : 'Mostrar'}
                  </button>
                </label>
                <input
                  type={showGithubKey ? 'text' : 'password'}
                  value={githubPrivateKey}
                  onChange={e => setGithubPrivateKey(e.target.value)}
                  placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-slate-900 focus:outline-hidden font-mono"
                />
              </div>
            </div>
          )}

          {/* TAB 3: SUPABASE */}
          {activeTab === 'supabase' && (
            <div className="space-y-4 animate-in fade-in duration-100">
              <div className="p-3 bg-emerald-900 text-white rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-emerald-300" />
                  <span className="font-bold text-xs">Credenciales Supabase Database & Auth</span>
                </div>
                <span className="text-[10px] text-emerald-200">Backend & PostgreSQL</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Correo de la Cuenta Supabase
                  </label>
                  <input
                    type="email"
                    value={supabaseEmail}
                    onChange={e => setSupabaseEmail(e.target.value)}
                    placeholder="db-admin@cliente.com"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-hidden font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Login / Project Ref Supabase
                  </label>
                  <input
                    type="text"
                    value={supabaseLogin}
                    onChange={e => setSupabaseLogin(e.target.value)}
                    placeholder="sb-proyecto-prod-1234"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-hidden font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-emerald-800">
                    <KeyRound className="w-3.5 h-3.5" />
                    Clave Privada / Service Role Key / DB Password
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowSupabaseKey(!showSupabaseKey)}
                    className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center gap-1"
                  >
                    {showSupabaseKey ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    {showSupabaseKey ? 'Ocultar' : 'Mostrar'}
                  </button>
                </label>
                <textarea
                  rows={2}
                  value={supabasePrivateKey}
                  onChange={e => setSupabasePrivateKey(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-hidden font-mono text-[11px] resize-none"
                />
              </div>
            </div>
          )}

          {/* TAB 4: CLOUDFLARE */}
          {activeTab === 'cloudflare' && (
            <div className="space-y-4 animate-in fade-in duration-100">
              <div className="p-3 bg-amber-900 text-white rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cloud className="w-4 h-4 text-amber-300" />
                  <span className="font-bold text-xs">Credenciales Cloudflare DNS & Proxy</span>
                </div>
                <span className="text-[10px] text-amber-200">DNS, SSL & WAF</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Correo Asociado a Cloudflare
                  </label>
                  <input
                    type="email"
                    value={cloudflareEmail}
                    onChange={e => setCloudflareEmail(e.target.value)}
                    placeholder="dns@cliente.com"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-amber-500 focus:outline-hidden font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Login / Account ID de Cloudflare
                  </label>
                  <input
                    type="text"
                    value={cloudflareLogin}
                    onChange={e => setCloudflareLogin(e.target.value)}
                    placeholder="cf_acc_1a2b3c4d..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-amber-500 focus:outline-hidden font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-amber-800">
                    <KeyRound className="w-3.5 h-3.5" />
                    Clave Privada / Global API Key / API Token
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowCloudflareKey(!showCloudflareKey)}
                    className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center gap-1"
                  >
                    {showCloudflareKey ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    {showCloudflareKey ? 'Ocultar' : 'Mostrar'}
                  </button>
                </label>
                <input
                  type={showCloudflareKey ? 'text' : 'password'}
                  value={cloudflarePrivateKey}
                  onChange={e => setCloudflarePrivateKey(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-amber-500 focus:outline-hidden font-mono"
                />
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setIsEditClientModalOpen(false)}
              className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 font-bold text-white bg-[#38A5F8] hover:bg-[#1d8fe6] rounded-xl shadow-sm shadow-[#38A5F8]/25 transition-all flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Guardar Cambios</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
