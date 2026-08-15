import React, { useState } from 'react';
import { 
  Building2, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  FileText, 
  Code2, 
  DollarSign, 
  Plus, 
  Search, 
  LayoutGrid, 
  Table as TableIcon,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Edit2,
  Trash2,
  X,
  Globe,
  GitBranch,
  Database,
  Cloud,
  KeyRound,
  Eye,
  EyeOff,
  Copy,
  Check,
  FileCode,
  Download,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Breadcrumbs } from '../layout/Breadcrumbs';
import { WhatsAppButton } from '../common/WhatsAppButton';
import { Client, ClientCategory } from '../../types';

export const ClientsView: React.FC = () => {
  const { 
    clients, 
    projects, 
    financeRecords, 
    selectedClientId, 
    setSelectedClientId,
    setIsNewClientModalOpen,
    openEditClientModal,
    setCurrentModule,
    setSelectedProjectId,
    deleteClient,
    showToast
  } = useApp();

  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [activeClientForDrawer, setActiveClientForDrawer] = useState<Client | null>(null);

  // Drawer Security Keys Reveal State
  const [showGithubKey, setShowGithubKey] = useState(false);
  const [showSupabaseKey, setShowSupabaseKey] = useState(false);
  const [showCloudflareKey, setShowCloudflareKey] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const filteredClients = clients.filter(c => {
    const q = searchTerm.toLowerCase();
    const matchesSearch = 
      c.name.toLowerCase().includes(q) ||
      c.taxId.toLowerCase().includes(q) ||
      (c.domain && c.domain.toLowerCase().includes(q)) ||
      (c.githubRepo && c.githubRepo.toLowerCase().includes(q)) ||
      (c.githubEmail && c.githubEmail.toLowerCase().includes(q)) ||
      (c.githubLogin && c.githubLogin.toLowerCase().includes(q)) ||
      (c.supabaseEmail && c.supabaseEmail.toLowerCase().includes(q)) ||
      (c.cloudflareEmail && c.cloudflareEmail.toLowerCase().includes(q)) ||
      c.legalRepresentative.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q);

    const matchesCategory = selectedCategory === 'all' || c.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleOpenDetail = (client: Client) => {
    setActiveClientForDrawer(client);
    setShowGithubKey(false);
    setShowSupabaseKey(false);
    setShowCloudflareKey(false);
    setIsDetailDrawerOpen(true);
  };

  const copyToClipboard = (text: string, label: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(label);
    showToast(`${label} copiado al portapapeles.`, 'info');
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const copyEnvFileTemplate = (client: Client) => {
    const envContent = `# === CREDENCIALES & INFRAESTRUCTURA: ${client.name} ===
# Dominio Oficial: https://${client.domain}
CLIENT_NAME="${client.name}"
CLIENT_DOMAIN="${client.domain}"
CLIENT_RIF="${client.taxId}"

# --- GITHUB PLATFORM ---
GITHUB_EMAIL="${client.githubEmail || ''}"
GITHUB_LOGIN="${client.githubLogin || ''}"
GITHUB_REPO="${client.githubRepo || ''}"
GITHUB_PRIVATE_KEY="${client.githubPrivateKey || ''}"

# --- SUPABASE PLATFORM ---
SUPABASE_EMAIL="${client.supabaseEmail || ''}"
SUPABASE_LOGIN="${client.supabaseLogin || ''}"
SUPABASE_SERVICE_ROLE_KEY="${client.supabasePrivateKey || ''}"

# --- CLOUDFLARE PLATFORM ---
CLOUDFLARE_EMAIL="${client.cloudflareEmail || ''}"
CLOUDFLARE_LOGIN="${client.cloudflareLogin || ''}"
CLOUDFLARE_PRIVATE_KEY="${client.cloudflarePrivateKey || ''}"
`;
    navigator.clipboard.writeText(envContent);
    showToast(`Archivo .env de "${client.name}" copiado al portapapeles.`, 'success');
  };

  // Sync drawer client if updated in background
  const currentClient = activeClientForDrawer 
    ? (clients.find(c => c.id === activeClientForDrawer.id) || activeClientForDrawer)
    : null;

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#F8FAFC]">
      <Breadcrumbs
        title="Directorio de Clientes & Fichas de Infraestructura"
        subtitle="Fichas fiscales, dominios, repositorios y credenciales privadas de GitHub, Supabase y Cloudflare"
        badge={{
          text: `${clients.length} Clientes Registrados`,
          variant: 'blue'
        }}
        primaryAction={{
          label: 'Nuevo Cliente',
          onClick: () => setIsNewClientModalOpen(true),
          icon: <Plus className="w-3.5 h-3.5" />
        }}
      />

      <div className="p-3 sm:p-6 space-y-4 max-w-7xl w-full mx-auto">
        {/* Control Toolbar (Salesforce Lightning style) */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search */}
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Buscar por cliente, dominio, repo, RIF, correo o login..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-[#38A5F8] focus:outline-hidden"
            />
          </div>

          {/* Filter Pills & View Switcher */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="px-3 py-1.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:bg-white focus:outline-hidden"
            >
              <option value="all">Todas las Categorías</option>
              <option value="Restaurante">Restaurantes / Gastronomía</option>
              <option value="E-commerce">E-commerce / Retail</option>
              <option value="Startup">Startups / Fintech</option>
              <option value="Enterprise">Enterprise</option>
              <option value="Pyme">Pymes</option>
            </select>

            <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === 'grid' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Vista de Tarjetas (Odoo Grid)"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === 'table' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Vista de Tabla Densa (Salesforce Lightning)"
              >
                <TableIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* VIEW 1: ODOO-STYLE CARD GRID */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredClients.map(client => {
              const clientProjects = projects.filter(p => p.clientId === client.id);
              const clientFinances = financeRecords.filter(f => f.clientId === client.id);
              const hasMora = clientFinances.some(
                f => f.subscriptionStatus === 'En Mora' || f.oneTimeStatus === 'En Mora'
              );

              return (
                <div
                  key={client.id}
                  className={`bg-white rounded-2xl border shadow-xs odoo-card overflow-hidden flex flex-col justify-between transition-all hover:shadow-md ${
                    hasMora ? 'border-[#D81159]/40 ring-1 ring-[#D81159]/20' : 'border-slate-200'
                  }`}
                >
                  {/* Card Top */}
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className={`w-11 h-11 rounded-2xl ${client.avatarColor || 'bg-[#38A5F8]'} text-white flex items-center justify-center font-black text-sm shadow-md shrink-0`}>
                          {client.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h3 
                            onClick={() => handleOpenDetail(client)}
                            className="font-extrabold text-slate-900 text-sm hover:text-[#1d8fe6] cursor-pointer line-clamp-1"
                          >
                            {client.name}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="font-mono text-[11px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                              {client.taxId}
                            </span>
                            <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                              {client.category}
                            </span>
                          </div>
                        </div>
                      </div>

                      {hasMora ? (
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-[#ffe4ee] text-[#D81159]">
                          En Mora
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700">
                          {client.status}
                        </span>
                      )}
                    </div>

                    {/* Dominio & Repo Badge */}
                    <div className="mt-3.5 grid grid-cols-1 gap-1.5 bg-slate-50 p-2.5 rounded-xl border border-slate-200/70">
                      {/* Domain */}
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500 flex items-center gap-1">
                          <Globe className="w-3.5 h-3.5 text-[#38A5F8]" />
                          Dominio:
                        </span>
                        <a
                          href={`https://${client.domain}`}
                          target="_blank"
                          rel="noreferrer"
                          className="font-mono text-slate-800 font-bold hover:text-[#1d8fe6] flex items-center gap-1 truncate max-w-[170px]"
                        >
                          <span>{client.domain || 'No asignado'}</span>
                          <ExternalLink className="w-3 h-3 text-slate-400" />
                        </a>
                      </div>

                      {/* GitHub Repo */}
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500 flex items-center gap-1">
                          <GitBranch className="w-3.5 h-3.5 text-slate-700" />
                          Repo:
                        </span>
                        <span className="font-mono text-slate-700 font-semibold text-[11px] truncate max-w-[170px]">
                          {client.githubRepo || 'Sin repo'}
                        </span>
                      </div>
                    </div>

                    {/* Infrastructure Credentials Preview Pills */}
                    <div className="mt-3 flex items-center gap-1.5 text-[10px]">
                      <span className="px-2 py-0.5 bg-slate-900 text-white rounded-md font-mono flex items-center gap-1">
                        <GitBranch className="w-2.5 h-2.5 text-emerald-400" />
                        GitHub: {client.githubLogin || 'Config'}
                      </span>
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md font-mono flex items-center gap-1">
                        <Database className="w-2.5 h-2.5 text-emerald-600" />
                        Supabase
                      </span>
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded-md font-mono flex items-center gap-1">
                        <Cloud className="w-2.5 h-2.5 text-amber-600" />
                        Cloudflare
                      </span>
                    </div>

                    {/* Details List */}
                    <div className="mt-3.5 space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-3">
                      <div className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="text-slate-800 font-medium truncate">
                          {client.legalRepresentative}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="text-slate-600 truncate">{client.email}</span>
                      </div>
                    </div>

                    {/* Related Projects Badges */}
                    <div className="mt-3 pt-2.5 border-t border-slate-100">
                      <div className="flex items-center justify-between mb-1.5">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Proyectos ({clientProjects.length})
                        </p>
                        <button
                          onClick={() => openEditClientModal(client)}
                          className="text-[11px] text-[#1d8fe6] hover:underline font-bold flex items-center gap-1"
                        >
                          <Edit2 className="w-3 h-3" />
                          Editar Ficha
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {clientProjects.length === 0 ? (
                          <span className="text-[11px] text-slate-400 italic">Sin proyectos activos</span>
                        ) : (
                          clientProjects.map(p => (
                            <button
                              key={p.id}
                              onClick={() => {
                                setSelectedProjectId(p.id);
                                setCurrentModule('projects');
                              }}
                              className="text-[11px] px-2 py-0.5 bg-blue-50 text-[#1d8fe6] hover:bg-blue-100 rounded-md font-medium transition-colors flex items-center gap-1"
                            >
                              <Code2 className="w-3 h-3" />
                              <span className="truncate max-w-[140px]">{p.name}</span>
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card Action Footer with WhatsApp Direct */}
                  <div className="p-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-2">
                    <WhatsAppButton
                      phone={client.phone}
                      clientName={client.name}
                      variant="primary"
                    />

                    <button
                      onClick={() => handleOpenDetail(client)}
                      className="px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-white hover:text-slate-900 rounded-lg transition-colors border border-slate-200/80"
                    >
                      Ver Ficha Completa
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* VIEW 2: SALESFORCE LIGHTNING DENSE TABLE */}
        {viewMode === 'table' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-[11px] uppercase tracking-wider font-extrabold text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Empresa / Razón Social</th>
                    <th className="py-3 px-4">Dominio Web</th>
                    <th className="py-3 px-4">Repo GitHub</th>
                    <th className="py-3 px-4">RIF Fiscal</th>
                    <th className="py-3 px-4">Representante</th>
                    <th className="py-3 px-4">Teléfono & WhatsApp</th>
                    <th className="py-3 px-4">Plataformas</th>
                    <th className="py-3 px-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredClients.map(client => {
                    const clientProjects = projects.filter(p => p.clientId === client.id);

                    return (
                      <tr key={client.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 font-bold text-slate-900">
                          <button
                            onClick={() => handleOpenDetail(client)}
                            className="hover:text-[#1d8fe6] text-left block"
                          >
                            {client.name}
                          </button>
                          <span className="text-[10px] text-slate-400 font-normal">{client.category}</span>
                        </td>
                        <td className="py-3 px-4 font-mono font-medium text-slate-700">
                          <a 
                            href={`https://${client.domain}`} 
                            target="_blank" 
                            rel="noreferrer"
                            className="hover:text-[#1d8fe6] flex items-center gap-1"
                          >
                            <span>{client.domain}</span>
                            <ExternalLink className="w-3 h-3 text-slate-400" />
                          </a>
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-600 text-[11px]">
                          <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-800 font-medium">
                            {client.githubRepo}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono font-medium text-slate-600">
                          {client.taxId}
                        </td>
                        <td className="py-3 px-4 text-slate-700">
                          {client.legalRepresentative}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-slate-600">{client.phone}</span>
                            <WhatsAppButton
                              phone={client.phone}
                              clientName={client.name}
                              variant="compact"
                            />
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1">
                            <span className="p-1 rounded bg-slate-900 text-white text-[10px]" title={`GitHub: ${client.githubLogin}`}>
                              <GitBranch className="w-3 h-3 text-emerald-400" />
                            </span>
                            <span className="p-1 rounded bg-emerald-100 text-emerald-800 text-[10px]" title={`Supabase: ${client.supabaseLogin}`}>
                              <Database className="w-3 h-3" />
                            </span>
                            <span className="p-1 rounded bg-amber-100 text-amber-800 text-[10px]" title={`Cloudflare: ${client.cloudflareLogin}`}>
                              <Cloud className="w-3 h-3" />
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right space-x-1">
                          <button
                            onClick={() => openEditClientModal(client)}
                            className="px-2 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Editar Ficha"
                          >
                            <Edit2 className="w-3.5 h-3.5 inline" />
                          </button>
                          <button
                            onClick={() => handleOpenDetail(client)}
                            className="px-2.5 py-1 text-xs font-bold text-[#1d8fe6] hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            Ver Ficha
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* DETAIL SLIDE-OVER DRAWER (Salesforce Record Page: Ficha de Cliente) */}
      {isDetailDrawerOpen && currentClient && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end">
          <div 
            className="fixed inset-0" 
            onClick={() => setIsDetailDrawerOpen(false)} 
          />

          <div className="relative w-full max-w-2xl bg-white h-full shadow-2xl z-10 flex flex-col animate-in slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-start justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl ${currentClient.avatarColor || 'bg-[#38A5F8]'} text-white flex items-center justify-center font-black text-base shadow-md shrink-0`}>
                  {currentClient.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">{currentClient.name}</h2>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-slate-500 font-mono">RIF: {currentClient.taxId}</span>
                    <span className="text-slate-300">•</span>
                    <a
                      href={`https://${currentClient.domain}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-[#1d8fe6] font-mono hover:underline flex items-center gap-1"
                    >
                      <span>{currentClient.domain}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEditClientModal(currentClient)}
                  className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-all flex items-center gap-1.5 shadow-2xs"
                >
                  <Edit2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>Editar</span>
                </button>
                <button
                  onClick={() => setIsDetailDrawerOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 p-6 space-y-6 overflow-y-auto text-xs">
              {/* Top Quick Actions Bar (WhatsApp & .env export) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200/80 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-emerald-900 text-xs">WhatsApp Directo</p>
                    <p className="text-[11px] text-emerald-700 font-mono">{currentClient.phone}</p>
                  </div>
                  <WhatsAppButton
                    phone={currentClient.phone}
                    clientName={currentClient.name}
                    variant="primary"
                  />
                </div>

                <div className="p-3 bg-slate-900 text-white rounded-2xl flex items-center justify-between">
                  <div>
                    <p className="font-bold text-xs">Entorno de Desarrollo</p>
                    <p className="text-[11px] text-slate-400">Exportar credenciales</p>
                  </div>
                  <button
                    onClick={() => copyEnvFileTemplate(currentClient)}
                    className="px-3 py-1.5 bg-[#38A5F8] hover:bg-[#1d8fe6] text-white font-bold rounded-xl text-xs flex items-center gap-1 transition-all"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar .env</span>
                  </button>
                </div>
              </div>

              {/* SECCIÓN 1: GITHUB & REPOSITORIO */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-slate-900 text-white rounded-lg">
                      <GitBranch className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-xs">Ficha GitHub & Repositorio</h3>
                      <p className="text-[10px] text-slate-500">Repositorio del proyecto y clave de despliegue</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[10px] font-mono font-bold">
                    GitHub
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  {/* Repo Name */}
                  <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-slate-500">Nombre del Repositorio:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900">{currentClient.githubRepo}</span>
                      <button
                        onClick={() => copyToClipboard(currentClient.githubRepo, 'Nombre de repositorio')}
                        className="p-1 text-slate-400 hover:text-slate-700 rounded"
                        title="Copiar repositorio"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* GitHub Email & Login */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center justify-between">
                      <span className="text-slate-500">Correo GitHub:</span>
                      <span className="font-mono font-semibold text-slate-800">{currentClient.githubEmail}</span>
                    </div>

                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center justify-between">
                      <span className="text-slate-500">Login / Usuario:</span>
                      <span className="font-mono font-semibold text-slate-800">{currentClient.githubLogin}</span>
                    </div>
                  </div>

                  {/* Private Key / Token */}
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 flex items-center gap-1 font-medium">
                        <KeyRound className="w-3.5 h-3.5 text-amber-600" />
                        Clave Privada / Personal Access Token:
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setShowGithubKey(!showGithubKey)}
                          className="text-[11px] text-slate-600 hover:text-slate-900 font-semibold flex items-center gap-1"
                        >
                          {showGithubKey ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                          {showGithubKey ? 'Ocultar' : 'Ver Clave'}
                        </button>
                        <button
                          onClick={() => copyToClipboard(currentClient.githubPrivateKey, 'Clave privada GitHub')}
                          className="px-2 py-0.5 bg-white border border-slate-200 hover:bg-slate-100 rounded text-[11px] font-bold text-slate-700 flex items-center gap-1"
                        >
                          {copiedKey === 'Clave privada GitHub' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          {copiedKey === 'Clave privada GitHub' ? '¡Copiado!' : 'Copiar'}
                        </button>
                      </div>
                    </div>
                    <div className="font-mono text-[11px] text-slate-800 bg-white p-2 rounded-lg border border-slate-200 break-all select-all">
                      {showGithubKey ? currentClient.githubPrivateKey : '••••••••••••••••••••••••••••••••••••••••'}
                    </div>
                  </div>
                </div>
              </div>

              {/* SECCIÓN 2: SUPABASE */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-emerald-800 text-white rounded-lg">
                      <Database className="w-4 h-4 text-emerald-300" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-xs">Ficha Supabase Database & Auth</h3>
                      <p className="text-[10px] text-slate-500">Credenciales del backend y clave Service Role</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-md text-[10px] font-mono font-bold">
                    Supabase
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  {/* Supabase Email & Login */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center justify-between">
                      <span className="text-slate-500">Correo Supabase:</span>
                      <span className="font-mono font-semibold text-slate-800">{currentClient.supabaseEmail}</span>
                    </div>

                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center justify-between">
                      <span className="text-slate-500">Login / Project Ref:</span>
                      <span className="font-mono font-semibold text-slate-800">{currentClient.supabaseLogin}</span>
                    </div>
                  </div>

                  {/* Supabase Private Key */}
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 flex items-center gap-1 font-medium">
                        <KeyRound className="w-3.5 h-3.5 text-emerald-600" />
                        Clave Privada / Service Role Key (JWT):
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setShowSupabaseKey(!showSupabaseKey)}
                          className="text-[11px] text-slate-600 hover:text-slate-900 font-semibold flex items-center gap-1"
                        >
                          {showSupabaseKey ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                          {showSupabaseKey ? 'Ocultar' : 'Ver Clave'}
                        </button>
                        <button
                          onClick={() => copyToClipboard(currentClient.supabasePrivateKey, 'Clave privada Supabase')}
                          className="px-2 py-0.5 bg-white border border-slate-200 hover:bg-slate-100 rounded text-[11px] font-bold text-slate-700 flex items-center gap-1"
                        >
                          {copiedKey === 'Clave privada Supabase' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          {copiedKey === 'Clave privada Supabase' ? '¡Copiado!' : 'Copiar'}
                        </button>
                      </div>
                    </div>
                    <div className="font-mono text-[11px] text-slate-800 bg-white p-2 rounded-lg border border-slate-200 break-all select-all">
                      {showSupabaseKey ? currentClient.supabasePrivateKey : '••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••'}
                    </div>
                  </div>
                </div>
              </div>

              {/* SECCIÓN 3: CLOUDFLARE */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-amber-800 text-white rounded-lg">
                      <Cloud className="w-4 h-4 text-amber-300" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-xs">Ficha Cloudflare DNS & Proxy</h3>
                      <p className="text-[10px] text-slate-500">Gestión de dominio, WAF y Global API Key</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 bg-amber-50 text-amber-700 rounded-md text-[10px] font-mono font-bold">
                    Cloudflare
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  {/* Cloudflare Email & Login */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center justify-between">
                      <span className="text-slate-500">Correo Cloudflare:</span>
                      <span className="font-mono font-semibold text-slate-800">{currentClient.cloudflareEmail}</span>
                    </div>

                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center justify-between">
                      <span className="text-slate-500">Login / Account ID:</span>
                      <span className="font-mono font-semibold text-slate-800">{currentClient.cloudflareLogin}</span>
                    </div>
                  </div>

                  {/* Cloudflare Private Key */}
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 flex items-center gap-1 font-medium">
                        <KeyRound className="w-3.5 h-3.5 text-amber-600" />
                        Clave Privada / API Key / Token:
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setShowCloudflareKey(!showCloudflareKey)}
                          className="text-[11px] text-slate-600 hover:text-slate-900 font-semibold flex items-center gap-1"
                        >
                          {showCloudflareKey ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                          {showCloudflareKey ? 'Ocultar' : 'Ver Clave'}
                        </button>
                        <button
                          onClick={() => copyToClipboard(currentClient.cloudflarePrivateKey, 'Clave privada Cloudflare')}
                          className="px-2 py-0.5 bg-white border border-slate-200 hover:bg-slate-100 rounded text-[11px] font-bold text-slate-700 flex items-center gap-1"
                        >
                          {copiedKey === 'Clave privada Cloudflare' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          {copiedKey === 'Clave privada Cloudflare' ? '¡Copiado!' : 'Copiar'}
                        </button>
                      </div>
                    </div>
                    <div className="font-mono text-[11px] text-slate-800 bg-white p-2 rounded-lg border border-slate-200 break-all select-all">
                      {showCloudflareKey ? currentClient.cloudflarePrivateKey : '••••••••••••••••••••••••••••••••••••••••'}
                    </div>
                  </div>
                </div>
              </div>

              {/* SECCIÓN 4: DATOS FISCALES & CONTACTO */}
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Datos Fiscales y de Contacto
                </h3>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Dominio Principal:</span>
                    <a 
                      href={`https://${currentClient.domain}`}
                      target="_blank"
                      rel="noreferrer"
                      className="font-bold text-[#1d8fe6] font-mono hover:underline flex items-center gap-1"
                    >
                      <span>https://{currentClient.domain}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Representante Legal:</span>
                    <span className="font-bold text-slate-900">{currentClient.legalRepresentative}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Correo Corporativo General:</span>
                    <span className="font-bold text-slate-900">{currentClient.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Dirección Sede:</span>
                    <span className="font-medium text-slate-900">{currentClient.address}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Categoría:</span>
                    <span className="font-bold text-[#1d8fe6]">{currentClient.category}</span>
                  </div>
                </div>
              </div>

              {/* Proyectos Vinculados */}
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Proyectos Web & Aplicaciones
                </h3>
                <div className="space-y-2">
                  {projects.filter(p => p.clientId === currentClient.id).map(p => (
                    <div key={p.id} className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-slate-900">{p.name}</p>
                        <p className="text-[11px] text-slate-500">{p.deliveryType} • {p.cloudflare.domain}</p>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedProjectId(p.id);
                          setCurrentModule('projects');
                          setIsDetailDrawerOpen(false);
                        }}
                        className="px-2.5 py-1 bg-blue-50 text-[#1d8fe6] font-bold rounded-lg hover:bg-blue-100"
                      >
                        Ver Infra →
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              {currentClient.notesSummary && (
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Notas Internas
                  </h3>
                  <p className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 leading-relaxed">
                    {currentClient.notesSummary}
                  </p>
                </div>
              )}
            </div>

            {/* Drawer Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
              <button
                onClick={() => {
                  if (confirm(`¿Estás seguro de eliminar el cliente ${currentClient.name}?`)) {
                    deleteClient(currentClient.id);
                    setIsDetailDrawerOpen(false);
                  }
                }}
                className="text-xs text-red-600 hover:underline flex items-center gap-1 font-semibold"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Eliminar Cliente</span>
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEditClientModal(currentClient)}
                  className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl text-xs hover:bg-slate-100 transition-colors"
                >
                  Editar Ficha
                </button>
                <button
                  onClick={() => setIsDetailDrawerOpen(false)}
                  className="px-4 py-2 bg-slate-900 text-white font-bold rounded-xl text-xs"
                >
                  Cerrar Ficha
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
