import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { 
  NavigationModule, 
  Client, 
  Project, 
  FinanceRecord, 
  MaintenanceReview, 
  ReviewTask,
  ReviewTaskStatus,
  ProjectNote, 
  NotificationItem,
  PaymentTransaction,
  ProjectApiIntegration,
  ProjectActivity,
  ProjectActivityType
} from '../types';
import { 
  initialClients, 
  initialProjects, 
  initialFinanceRecords, 
  initialMaintenanceReviews, 
  initialProjectNotes, 
  initialNotifications,
  initialProjectActivities
} from '../data/mockData';
import confetti from 'canvas-confetti';

interface Toast {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
}

interface AppContextType {
  currentModule: NavigationModule;
  setCurrentModule: (module: NavigationModule) => void;
  selectedClientId: string | null;
  setSelectedClientId: (id: string | null) => void;
  selectedProjectId: string | null;
  setSelectedProjectId: (id: string | null) => void;
  
  // Data lists
  clients: Client[];
  projects: Project[];
  financeRecords: FinanceRecord[];
  maintenanceReviews: MaintenanceReview[];
  projectNotes: ProjectNote[];
  notifications: NotificationItem[];
  projectActivities: ProjectActivity[];
  
  // Toast notifications
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;

  // Global search modal
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;

  // Mobile sidebar drawer
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (open: boolean) => void;

  // PWA install state
  isPwaInstallable: boolean;
  isInstalledPwa: boolean;
  promptPwaInstall: () => Promise<boolean>;

  // Modals state
  isNewClientModalOpen: boolean;
  setIsNewClientModalOpen: (open: boolean) => void;
  isEditClientModalOpen: boolean;
  setIsEditClientModalOpen: (open: boolean) => void;
  clientToEdit: Client | null;
  setClientToEdit: (client: Client | null) => void;
  openEditClientModal: (client: Client) => void;
  isNewProjectModalOpen: boolean;
  setIsNewProjectModalOpen: (open: boolean) => void;
  isRecordPaymentModalOpen: boolean;
  setIsRecordPaymentModalOpen: (open: boolean) => void;
  paymentModalDefaultRecordId: string | null;
  openPaymentModalForRecord: (recordId: string) => void;
  isNewReviewModalOpen: boolean;
  setIsNewReviewModalOpen: (open: boolean) => void;

  // CRUD actions
  addClient: (client: Omit<Client, 'id' | 'createdAt'>) => Client;
  updateClient: (id: string, updates: Partial<Client>) => void;
  deleteClient: (id: string) => void;

  addProject: (project: Omit<Project, 'id' | 'createdAt'>) => Project;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  toggleProjectPause: (projectId: string, reason?: string) => void;
  testProjectHealth: (projectId: string) => void;
  updateProjectApiConfig: (projectId: string, apiConfig: Partial<ProjectApiIntegration>) => void;

  recordPayment: (recordId: string, transaction: Omit<PaymentTransaction, 'id'>, newStatus?: string) => void;
  updateFinanceRecord: (id: string, updates: Partial<FinanceRecord>) => void;

  addMaintenanceReview: (review: Omit<MaintenanceReview, 'id'>) => MaintenanceReview;
  updateMaintenanceReview: (id: string, updates: Partial<MaintenanceReview>) => void;
  toggleReviewTask: (reviewId: string, taskId: string) => void;
  updateReviewTaskStatus: (reviewId: string, taskId: string, newStatus: ReviewTaskStatus) => void;
  addReviewTask: (reviewId: string, task: Omit<ReviewTask, 'id'>) => void;
  updateReviewTask: (reviewId: string, taskId: string, updates: Partial<ReviewTask>) => void;
  deleteReviewTask: (reviewId: string, taskId: string) => void;
  scheduleNextReview: (reviewId: string) => void;

  addProjectNote: (note: Omit<ProjectNote, 'id' | 'updatedAt'>) => ProjectNote;
  updateProjectNote: (id: string, updates: Partial<ProjectNote>) => void;
  deleteProjectNote: (id: string) => void;
  toggleChecklistItem: (noteId: string, itemId: string) => void;

  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  // Project Activity Feed actions
  addProjectActivity: (activity: Omit<ProjectActivity, 'id' | 'timestamp'> & { timestamp?: string }) => ProjectActivity;
  deleteProjectActivity: (id: string) => void;
  resolveActivityAlert: (activityId: string) => void;
  rollbackProjectDeployment: (projectId: string, commitHash: string, commitMessage?: string) => void;

  // KPIs & Calculations
  mrrTotal: number;
  accountsReceivableTotal: number;
  inMoraCount: number;
  inMoraAmount: number;
  pendingReviewsCount: number;
  activeProjectsCount: number;

  // Reset to initial demo data
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CLIENTS: 'goolo_clients_v1',
  PROJECTS: 'goolo_projects_v1',
  FINANCES: 'goolo_finances_v1',
  REVIEWS: 'goolo_reviews_v1',
  NOTES: 'goolo_notes_v1',
  NOTIFICATIONS: 'goolo_notifications_v1',
  ACTIVITIES: 'goolo_activities_v1',
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentModule, setCurrentModule] = useState<NavigationModule>('dashboard');
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // PWA installation state
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isPwaInstallable, setIsPwaInstallable] = useState(false);
  const [isInstalledPwa, setIsInstalledPwa] = useState(false);

  // Modals
  const [isNewClientModalOpen, setIsNewClientModalOpen] = useState(false);
  const [isEditClientModalOpen, setIsEditClientModalOpen] = useState(false);
  const [clientToEdit, setClientToEdit] = useState<Client | null>(null);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [isRecordPaymentModalOpen, setIsRecordPaymentModalOpen] = useState(false);
  const [paymentModalDefaultRecordId, setPaymentModalDefaultRecordId] = useState<string | null>(null);
  const [isNewReviewModalOpen, setIsNewReviewModalOpen] = useState(false);

  // State with LocalStorage initialization & data migration
  const [clients, setClients] = useState<Client[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CLIENTS);
    if (!saved) return initialClients;
    try {
      const parsed: Client[] = JSON.parse(saved);
      // Migrate any missing fields from initialClients or default structure
      return parsed.map(c => {
        const defaultMatch = initialClients.find(init => init.id === c.id);
        return {
          ...c,
          domain: c.domain || defaultMatch?.domain || `${c.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
          githubEmail: c.githubEmail || defaultMatch?.githubEmail || c.email || 'devops@agency.com',
          githubLogin: c.githubLogin || defaultMatch?.githubLogin || 'goolo-dev',
          githubRepo: c.githubRepo || defaultMatch?.githubRepo || `goolo-agency/${c.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-app`,
          githubPrivateKey: c.githubPrivateKey || defaultMatch?.githubPrivateKey || 'ghp_sampleTokenSecretKey123456789',
          supabaseEmail: c.supabaseEmail || defaultMatch?.supabaseEmail || c.email || 'supabase@agency.com',
          supabaseLogin: c.supabaseLogin || defaultMatch?.supabaseLogin || `sb-${c.id}-prod`,
          supabasePrivateKey: c.supabasePrivateKey || defaultMatch?.supabasePrivateKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIn0.secret',
          cloudflareEmail: c.cloudflareEmail || defaultMatch?.cloudflareEmail || c.email || 'dns@agency.com',
          cloudflareLogin: c.cloudflareLogin || defaultMatch?.cloudflareLogin || `cf_${c.id}_acc`,
          cloudflarePrivateKey: c.cloudflarePrivateKey || defaultMatch?.cloudflarePrivateKey || 'cf_tok_secretApiKey987654321',
        };
      });
    } catch {
      return initialClients;
    }
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    if (!saved) return initialProjects;
    try {
      const parsed: Project[] = JSON.parse(saved);
      return parsed.map(p => {
        const defaultMatch = initialProjects.find(init => init.id === p.id);
        const siteApi = p.siteApi || defaultMatch?.siteApi || {
          isPaused: false,
          pauseReason: '',
          pauseWebhookUrl: `https://${p.cloudflare?.domain || 'app.com'}/api/pause`,
          apiKey: `goolo_live_${p.id}_token`,
          healthStatus: 'operational',
          httpStatusCode: 200,
          latencyMs: 45,
          uptimePercentage: 99.95,
          lastHealthCheck: new Date().toISOString().replace('T', ' ').slice(0, 19),
          healthCheckEndpoint: `https://${p.cloudflare?.domain || 'app.com'}/api/health`,
          sslDaysRemaining: 180,
          dbLatencyMs: 12,
          edgeCacheStatus: 'HIT',
          isFunctional: true,
          lastTestLog: 'Status 200 OK • Verificación automática completa',
          analyticsApiUrl: `https://${p.cloudflare?.domain || 'app.com'}/api/analytics`,
          liveActiveVisitors: 24,
          visitsToday: 1200,
          visitsThisWeek: 8500,
          visitsThisMonth: 34000,
          pageViewsToday: 3800,
          requestsPerMinute: 45,
          bandwidthMbToday: 210.5,
          avgResponseTimeMs: 48,
          errorRatePercent: 0.01,
          hourlyTraffic: [
            { hour: '00:00', visits: 20, requests: 60 },
            { hour: '04:00', visits: 10, requests: 30 },
            { hour: '08:00', visits: 80, requests: 240 },
            { hour: '11:00', visits: 220, requests: 700 },
            { hour: '13:00', visits: 310, requests: 980 },
            { hour: '15:00', visits: 280, requests: 890 },
            { hour: '18:00', visits: 190, requests: 620 },
            { hour: '20:00', visits: 140, requests: 450 },
          ],
          topPages: [
            { path: '/', views: 1600, percentage: 42 },
            { path: '/servicios', views: 980, percentage: 26 },
            { path: '/contacto', views: 640, percentage: 17 },
            { path: '/catalogo', views: 580, percentage: 15 },
          ],
          deviceBreakdown: {
            mobile: 75,
            desktop: 22,
            tablet: 3,
          }
        };
        return {
          ...p,
          siteApi
        };
      });
    } catch {
      return initialProjects;
    }
  });

  const [financeRecords, setFinanceRecords] = useState<FinanceRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.FINANCES);
    return saved ? JSON.parse(saved) : initialFinanceRecords;
  });

  const [maintenanceReviews, setMaintenanceReviews] = useState<MaintenanceReview[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.REVIEWS);
    return saved ? JSON.parse(saved) : initialMaintenanceReviews;
  });

  const [projectNotes, setProjectNotes] = useState<ProjectNote[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTES);
    return saved ? JSON.parse(saved) : initialProjectNotes;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    return saved ? JSON.parse(saved) : initialNotifications;
  });

  const [projectActivities, setProjectActivities] = useState<ProjectActivity[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
    return saved ? JSON.parse(saved) : initialProjectActivities;
  });

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FINANCES, JSON.stringify(financeRecords));
  }, [financeRecords]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(maintenanceReviews));
  }, [maintenanceReviews]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(projectNotes));
  }, [projectNotes]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(projectActivities));
  }, [projectActivities]);

  // Global shortcut for Search (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // PWA beforeinstallprompt detection
  useEffect(() => {
    // Check if already running in standalone display mode
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
      (window.navigator as any).standalone === true;
    if (isStandalone) {
      setIsInstalledPwa(true);
    }

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsPwaInstallable(true);
    };

    const handleAppInstalled = () => {
      setIsPwaInstallable(false);
      setDeferredPrompt(null);
      setIsInstalledPwa(true);
      showToast('¡Goolo System instalado exitosamente en tu dispositivo!', 'success');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const promptPwaInstall = async (): Promise<boolean> => {
    if (!deferredPrompt) {
      showToast('Para instalar en iOS: presiona Compartir y "Agregar a Inicio". En Android/PC: usa el menú del navegador.', 'info');
      return false;
    }
    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsPwaInstallable(false);
        setDeferredPrompt(null);
        showToast('Instalando Goolo System ERP...', 'info');
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  // Toast notification system
  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const openPaymentModalForRecord = (recordId: string) => {
    setPaymentModalDefaultRecordId(recordId);
    setIsRecordPaymentModalOpen(true);
  };

  const openEditClientModal = (client: Client) => {
    setClientToEdit(client);
    setIsEditClientModalOpen(true);
  };

  // KPIs Calculations
  const mrrTotal = useMemo(() => {
    return financeRecords
      .filter(f => f.paymentType === 'subscription')
      .reduce((sum, f) => sum + (f.monthlyAmount || 0), 0);
  }, [financeRecords]);

  const accountsReceivableTotal = useMemo(() => {
    return financeRecords.reduce((sum, f) => {
      if (f.paymentType === 'one_time') {
        return sum + (f.remainingBalance || 0);
      } else {
        if (f.subscriptionStatus === 'En Mora' || f.subscriptionStatus === 'Pendiente') {
          return sum + (f.monthlyAmount || 0);
        }
        return sum;
      }
    }, 0);
  }, [financeRecords]);

  const { inMoraCount, inMoraAmount } = useMemo(() => {
    let count = 0;
    let amount = 0;
    financeRecords.forEach(f => {
      if (f.paymentType === 'subscription' && f.subscriptionStatus === 'En Mora') {
        count++;
        amount += (f.monthlyAmount || 0);
      } else if (f.paymentType === 'one_time' && f.oneTimeStatus === 'En Mora') {
        count++;
        amount += (f.remainingBalance || 0);
      }
    });
    return { inMoraCount: count, inMoraAmount: amount };
  }, [financeRecords]);

  const pendingReviewsCount = useMemo(() => {
    return maintenanceReviews.filter(r => r.status === 'Revisión Pendiente' || r.status === 'Vencida').length;
  }, [maintenanceReviews]);

  const activeProjectsCount = useMemo(() => {
    return projects.filter(p => p.status === 'En Producción' || p.status === 'En Desarrollo').length;
  }, [projects]);

  // Actions
  const addClient = (data: Omit<Client, 'id' | 'createdAt'>): Client => {
    const id = `cli-${Date.now().toString().slice(-4)}`;
    const newClient: Client = {
      ...data,
      id,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setClients(prev => [newClient, ...prev]);
    showToast(`Cliente "${newClient.name}" creado con éxito.`, 'success');
    return newClient;
  };

  const updateClient = (id: string, updates: Partial<Client>) => {
    setClients(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
    showToast('Datos del cliente actualizados.', 'success');
  };

  const deleteClient = (id: string) => {
    setClients(prev => prev.filter(c => c.id !== id));
    showToast('Cliente eliminado del sistema.', 'info');
  };

  const addProject = (data: Omit<Project, 'id' | 'createdAt'>): Project => {
    const id = `proj-${Date.now().toString().slice(-4)}`;
    const newProject: Project = {
      ...data,
      id,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setProjects(prev => [newProject, ...prev]);

    // Create default finance record for project
    const finId = `fin-${Date.now().toString().slice(-4)}`;
    const defaultFin: FinanceRecord = {
      id: finId,
      clientId: newProject.clientId,
      projectId: newProject.id,
      paymentType: 'subscription',
      currency: 'USD',
      monthlyAmount: 200,
      billingDay: 15,
      subscriptionStatus: 'Pendiente',
      nextBillingDate: new Date().toISOString().split('T')[0],
      paymentHistory: []
    };
    setFinanceRecords(prev => [...prev, defaultFin]);

    // Create default maintenance review (60 days)
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + 60);
    const newReview: MaintenanceReview = {
      id: `rev-${Date.now().toString().slice(-4)}`,
      projectId: newProject.id,
      clientId: newProject.clientId,
      title: `Auditoría Bimestral de Infraestructura ${newProject.name}`,
      intervalDays: 60,
      lastReviewDate: new Date().toISOString().split('T')[0],
      nextReviewDate: nextDate.toISOString().split('T')[0],
      status: 'Al Día',
      auditorName: 'Lead DevOps',
      notes: 'Auditoría periódica programada de base de datos Supabase, reglas Cloudflare y repositorio.',
      tasks: [
        { id: 't-1', title: 'Verificar cuota de almacenamiento Supabase', category: 'supabase', completed: false },
        { id: 't-2', title: 'Auditar políticas de seguridad RLS', category: 'supabase', completed: false },
        { id: 't-3', title: 'Comprobar certificados SSL Cloudflare Full (Strict)', category: 'cloudflare', completed: false },
        { id: 't-4', title: 'Chequear alertas Dependabot en GitHub', category: 'github', completed: false }
      ]
    };
    setMaintenanceReviews(prev => [...prev, newReview]);

    showToast(`Proyecto "${newProject.name}" creado e inicializado con infraestructura.`, 'success');
    return newProject;
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    showToast('Infraestructura del proyecto actualizada.', 'success');
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    showToast('Proyecto eliminado.', 'info');
  };

  const toggleProjectPause = (projectId: string, reason?: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    const willBePaused = !project.siteApi.isPaused;
    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16);

    setProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p;
      return {
        ...p,
        status: willBePaused ? 'Mantenimiento' : 'En Producción',
        siteApi: {
          ...p.siteApi,
          isPaused: willBePaused,
          pauseReason: willBePaused ? (reason || 'Pausa manual solicitada por el administrador') : '',
          pausedAt: willBePaused ? nowStr : undefined,
          healthStatus: willBePaused ? 'maintenance' : 'operational',
          httpStatusCode: willBePaused ? 503 : 200,
          isFunctional: !willBePaused,
          lastTestLog: willBePaused 
            ? `[${nowStr}] Sitio pausado manualmente. Webhook invocado en ${p.siteApi.pauseWebhookUrl || '/api/pause'}. Respuesta: 503 Service Unavailable.` 
            : `[${nowStr}] Sitio reanudado y en línea. Tráfico normal restablecido. Respuesta: 200 OK.`,
        }
      };
    }));

    if (willBePaused) {
      showToast(`Página de "${project.name}" PAUSADA con éxito (Modo Mantenimiento 503 activo).`, 'warning');
      addProjectActivity({
        projectId,
        type: 'config_change',
        title: 'Modo Mantenimiento 503 Activado',
        description: `Sitio web pausado manualmente por administrador. Razón: "${reason || 'Pausa manual de emergencia'}".`,
        severity: 'warning',
        author: 'Lead Administrator',
        metadata: {
          category: 'site_api',
          changedField: 'isPaused (Site Status)',
          previousValue: 'false (200 OK)',
          newValue: 'true (503 Service Unavailable)'
        }
      });
    } else {
      showToast(`Página de "${project.name}" REANUDADA. El sitio web está 100% operativo y en producción.`, 'success');
      addProjectActivity({
        projectId,
        type: 'config_change',
        title: 'Sitio Web Reanudado y En Línea',
        description: 'Tráfico público restaurado y endpoints de producción 100% operativos (200 OK).',
        severity: 'success',
        author: 'Lead Administrator',
        metadata: {
          category: 'site_api',
          changedField: 'isPaused (Site Status)',
          previousValue: 'true (503 Service Unavailable)',
          newValue: 'false (200 OK Operational)'
        }
      });
    }
  };

  const testProjectHealth = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    const isCurrentlyPaused = project.siteApi.isPaused;
    const mockLatency = Math.floor(Math.random() * 45) + 30; // 30 - 75 ms
    const mockDbLatency = Math.floor(Math.random() * 12) + 8; // 8 - 20 ms
    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 19);

    setProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p;
      return {
        ...p,
        siteApi: {
          ...p.siteApi,
          latencyMs: mockLatency,
          dbLatencyMs: mockDbLatency,
          httpStatusCode: isCurrentlyPaused ? 503 : 200,
          healthStatus: isCurrentlyPaused ? 'maintenance' : 'operational',
          isFunctional: !isCurrentlyPaused,
          lastHealthCheck: nowStr,
          edgeCacheStatus: 'HIT',
          lastTestLog: isCurrentlyPaused
            ? `[${nowStr}] Test Ping completado: 503 Maintenance (Pausado) • Latencia: ${mockLatency}ms • Supabase DB: ${mockDbLatency}ms • Cloudflare Edge: Respondiendo aviso de mantenimiento`
            : `[${nowStr}] Test Ping completado: 200 OK • Latencia HTTP: ${mockLatency}ms (Óptima) • Supabase DB: ${mockDbLatency}ms • SSL Válido • Edge Cache: HIT (98%)`
        }
      };
    }));

    if (isCurrentlyPaused) {
      showToast(`Test de diagnóstico completado: Sitio en Mantenimiento (503). Latencia: ${mockLatency}ms.`, 'warning');
    } else {
      showToast(`¡Diagnóstico exitoso! ${project.name} está 100% operativo (200 OK, ${mockLatency}ms).`, 'success');
      addProjectActivity({
        projectId,
        type: 'system_alert',
        title: `Health Check 200 OK (${mockLatency}ms)`,
        description: `Verificación sintética exitosa: Latencia Edge ${mockLatency}ms, Supabase Postgres ${mockDbLatency}ms, SSL Válido.`,
        severity: 'success',
        author: 'Synthetic Health Monitor',
        metadata: {
          metricName: 'HTTP Health / Latencia Edge',
          metricValue: `200 OK / ${mockLatency}ms`,
          threshold: '< 200ms',
          resolved: true,
          resolvedAt: nowStr
        }
      });
    }
  };

  const updateProjectApiConfig = (projectId: string, apiConfig: Partial<ProjectApiIntegration>) => {
    setProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p;
      return {
        ...p,
        siteApi: {
          ...p.siteApi,
          ...apiConfig,
        }
      };
    }));
    showToast('Parámetros de API y telemetría actualizados correctamente.', 'success');
    addProjectActivity({
      projectId,
      type: 'config_change',
      title: 'Configuración de API & Webhooks Actualizada',
      description: 'Se modificaron parámetros del endpoint de salud o webhook de pausa remota.',
      severity: 'info',
      author: 'Lead Developer',
      metadata: {
        category: 'site_api',
        changedField: Object.keys(apiConfig).join(', '),
        newValue: 'Parámetros actualizados'
      }
    });
  };

  const addProjectActivity = (data: Omit<ProjectActivity, 'id' | 'timestamp'> & { timestamp?: string }): ProjectActivity => {
    const id = `act-${Date.now().toString().slice(-6)}`;
    const nowStr = data.timestamp || new Date().toISOString().replace('T', ' ').slice(0, 16);
    const newActivity: ProjectActivity = {
      ...data,
      id,
      timestamp: nowStr,
    };
    setProjectActivities(prev => [newActivity, ...prev]);
    return newActivity;
  };

  const deleteProjectActivity = (id: string) => {
    setProjectActivities(prev => prev.filter(a => a.id !== id));
    showToast('Evento eliminado del historial de actividad.', 'info');
  };

  const resolveActivityAlert = (activityId: string) => {
    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16);
    setProjectActivities(prev => prev.map(a => {
      if (a.id !== activityId) return a;
      return {
        ...a,
        severity: 'success' as const,
        metadata: {
          ...a.metadata,
          resolved: true,
          resolvedAt: nowStr
        }
      };
    }));
    showToast('Alerta marcada como resuelta.', 'success');
  };

  const rollbackProjectDeployment = (projectId: string, commitHash: string, commitMessage?: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    const rollbackCommit = commitHash.slice(0, 7);
    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16);

    // Update project github state
    setProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p;
      return {
        ...p,
        github: {
          ...p.github,
          commitHash: rollbackCommit,
          commitMessage: `rollback: revert production build to ${rollbackCommit} (${commitMessage || 'previous stable build'})`,
          lastDeployStatus: 'success',
          lastDeployAt: nowStr
        }
      };
    }));

    // Record rollback deployment in activity feed
    addProjectActivity({
      projectId,
      type: 'deployment',
      title: `Rollback Ejecutado a Commit ${rollbackCommit}`,
      description: `Reversión instantánea a versión previa estable: "${commitMessage || rollbackCommit}". Tráfico redirigido.`,
      severity: 'info',
      author: 'Lead DevOps (Manual Rollback)',
      metadata: {
        commitHash: rollbackCommit,
        commitMessage: `rollback to ${rollbackCommit}`,
        branch: project.github.branch || 'main',
        deployDurationSec: 18,
        deployStatus: 'rollback',
        environment: 'production',
        rollbackAvailable: true,
        deployLogs: [
          `Initiating emergency rollback sequence to commit ${rollbackCommit}...`,
          'Deploying previous static artifacts from edge cache snapshot...',
          'Invalidating edge CDN routers across 275+ PoPs...',
          'Health check passed: HTTP 200 OK (28ms)'
        ]
      }
    });

    confetti({
      particleCount: 30,
      spread: 60,
      origin: { y: 0.7 }
    });

    showToast(`Rollback exitoso a commit ${rollbackCommit}. Sitio web restaurado.`, 'success');
  };

  const recordPayment = (recordId: string, transaction: Omit<PaymentTransaction, 'id'>, newStatus?: string) => {
    const txId = `tx-${Date.now().toString().slice(-5)}`;
    const fullTx: PaymentTransaction = {
      ...transaction,
      id: txId,
    };

    setFinanceRecords(prev => prev.map(record => {
      if (record.id !== recordId) return record;

      const updatedHistory = [fullTx, ...record.paymentHistory];
      
      if (record.paymentType === 'subscription') {
        const nextMonthDate = new Date();
        nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);
        nextMonthDate.setDate(record.billingDay);

        return {
          ...record,
          subscriptionStatus: 'Pagado',
          lastPaidDate: transaction.date,
          nextBillingDate: nextMonthDate.toISOString().split('T')[0],
          paymentHistory: updatedHistory
        };
      } else {
        // One time
        const newDeposit = (record.initialDeposit || 0) + transaction.amount;
        const total = record.totalAmount || 0;
        const remaining = Math.max(0, total - newDeposit);
        const status = remaining === 0 ? 'Pagado Total' : 'Abono Parcial';

        return {
          ...record,
          initialDeposit: newDeposit,
          remainingBalance: remaining,
          oneTimeStatus: (newStatus as any) || status,
          lastPaidDate: transaction.date,
          paymentHistory: updatedHistory
        };
      }
    }));

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#38A5F8', '#D81159', '#10B981']
      });
    } catch {
      // ignore
    }

    showToast(`¡Pago de $${transaction.amount} USD registrado con éxito! Referencia: ${transaction.reference}`, 'success');
  };

  const updateFinanceRecord = (id: string, updates: Partial<FinanceRecord>) => {
    setFinanceRecords(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));
    showToast('Parámetros de facturación actualizados.', 'success');
  };

  const addMaintenanceReview = (data: Omit<MaintenanceReview, 'id'>): MaintenanceReview => {
    const id = `rev-${Date.now().toString().slice(-4)}`;
    const newReview: MaintenanceReview = {
      ...data,
      id,
    };
    setMaintenanceReviews(prev => [newReview, ...prev]);
    showToast('Revisión técnica programada.', 'success');
    return newReview;
  };

  const updateMaintenanceReview = (id: string, updates: Partial<MaintenanceReview>) => {
    setMaintenanceReviews(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
    showToast('Auditoría técnica actualizada.', 'success');
  };

  const toggleReviewTask = (reviewId: string, taskId: string) => {
    setMaintenanceReviews(prev => prev.map(review => {
      if (review.id !== reviewId) return review;
      const updatedTasks = review.tasks.map(t => {
        if (t.id !== taskId) return t;
        const newCompleted = !t.completed;
        const newStatus: ReviewTaskStatus = newCompleted ? 'completed' : 'todo';
        return { 
          ...t, 
          completed: newCompleted,
          status: newStatus,
          updatedAt: new Date().toISOString().split('T')[0]
        };
      });
      const allCompleted = updatedTasks.every(t => t.completed || t.status === 'completed');
      return {
        ...review,
        tasks: updatedTasks,
        status: allCompleted ? 'Al Día' : review.status
      };
    }));
  };

  const updateReviewTaskStatus = (reviewId: string, taskId: string, newStatus: ReviewTaskStatus) => {
    setMaintenanceReviews(prev => prev.map(review => {
      if (review.id !== reviewId) return review;
      const isCompleted = newStatus === 'completed';
      const updatedTasks = review.tasks.map(t => t.id === taskId ? { 
        ...t, 
        status: newStatus,
        completed: isCompleted,
        updatedAt: new Date().toISOString().split('T')[0]
      } : t);
      const allCompleted = updatedTasks.every(t => t.completed || t.status === 'completed');
      
      return {
        ...review,
        tasks: updatedTasks,
        status: allCompleted ? 'Al Día' : review.status
      };
    }));
    
    if (newStatus === 'completed') {
      try {
        confetti({
          particleCount: 40,
          spread: 50,
          origin: { y: 0.7 },
          colors: ['#10B981', '#38A5F8']
        });
      } catch {}
    }
  };

  const addReviewTask = (reviewId: string, taskData: Omit<ReviewTask, 'id'>) => {
    const id = `task-${Date.now().toString().slice(-4)}`;
    const newTask: ReviewTask = {
      ...taskData,
      id,
      completed: taskData.status === 'completed',
      status: taskData.status || (taskData.completed ? 'completed' : 'todo'),
      updatedAt: new Date().toISOString().split('T')[0],
    };
    setMaintenanceReviews(prev => prev.map(review => {
      if (review.id !== reviewId) return review;
      return {
        ...review,
        tasks: [...review.tasks, newTask]
      };
    }));
    showToast('Nueva tarea de auditoría agregada.', 'success');
  };

  const updateReviewTask = (reviewId: string, taskId: string, updates: Partial<ReviewTask>) => {
    setMaintenanceReviews(prev => prev.map(review => {
      if (review.id !== reviewId) return review;
      const updatedTasks = review.tasks.map(t => {
        if (t.id !== taskId) return t;
        const newCompleted = updates.status !== undefined 
          ? updates.status === 'completed' 
          : (updates.completed !== undefined ? updates.completed : t.completed);
        const newStatus = updates.status !== undefined
          ? updates.status
          : (updates.completed !== undefined ? (updates.completed ? 'completed' : 'todo') : t.status);
        return {
          ...t,
          ...updates,
          completed: newCompleted,
          status: newStatus,
          updatedAt: new Date().toISOString().split('T')[0],
        };
      });
      const allCompleted = updatedTasks.every(t => t.completed || t.status === 'completed');
      return {
        ...review,
        tasks: updatedTasks,
        status: allCompleted ? 'Al Día' : review.status
      };
    }));
    showToast('Tarea de auditoría actualizada.', 'success');
  };

  const deleteReviewTask = (reviewId: string, taskId: string) => {
    setMaintenanceReviews(prev => prev.map(review => {
      if (review.id !== reviewId) return review;
      return {
        ...review,
        tasks: review.tasks.filter(t => t.id !== taskId)
      };
    }));
    showToast('Tarea de auditoría eliminada.', 'info');
  };

  const scheduleNextReview = (reviewId: string) => {
    setMaintenanceReviews(prev => prev.map(review => {
      if (review.id !== reviewId) return review;
      const nextDate = new Date();
      nextDate.setDate(nextDate.getDate() + review.intervalDays);
      
      const resetTasks = review.tasks.map(t => ({ ...t, completed: false }));

      return {
        ...review,
        lastReviewDate: new Date().toISOString().split('T')[0],
        nextReviewDate: nextDate.toISOString().split('T')[0],
        status: 'Al Día',
        tasks: resetTasks
      };
    }));
    showToast('Ciclo de revisión renovado para la próxima fecha.', 'success');
  };

  const addProjectNote = (data: Omit<ProjectNote, 'id' | 'updatedAt'>): ProjectNote => {
    const id = `note-${Date.now().toString().slice(-4)}`;
    const newNote: ProjectNote = {
      ...data,
      id,
      updatedAt: new Date().toISOString().split('T')[0],
    };
    setProjectNotes(prev => [newNote, ...prev]);
    showToast('Nueva nota de documentación creada.', 'success');
    return newNote;
  };

  const updateProjectNote = (id: string, updates: Partial<ProjectNote>) => {
    setProjectNotes(prev => prev.map(n => n.id === id ? {
      ...n,
      ...updates,
      updatedAt: new Date().toISOString().split('T')[0],
    } : n));
    showToast('Documentación guardada.', 'success');
  };

  const deleteProjectNote = (id: string) => {
    setProjectNotes(prev => prev.filter(n => n.id !== id));
    showToast('Nota eliminada.', 'info');
  };

  const toggleChecklistItem = (noteId: string, itemId: string) => {
    setProjectNotes(prev => prev.map(note => {
      if (note.id !== noteId || !note.checklist) return note;
      return {
        ...note,
        checklist: note.checklist.map(item => item.id === itemId ? { ...item, checked: !item.checked } : item),
        updatedAt: new Date().toISOString().split('T')[0]
      };
    }));
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast('Todas las alertas marcadas como leídas.', 'info');
  };

  const resetDemoData = () => {
    setClients(initialClients);
    setProjects(initialProjects);
    setFinanceRecords(initialFinanceRecords);
    setMaintenanceReviews(initialMaintenanceReviews);
    setProjectNotes(initialProjectNotes);
    setNotifications(initialNotifications);
    setProjectActivities(initialProjectActivities);
    localStorage.clear();
    showToast('Datos de demostración restablecidos.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        currentModule,
        setCurrentModule,
        selectedClientId,
        setSelectedClientId,
        selectedProjectId,
        setSelectedProjectId,
        clients,
        projects,
        financeRecords,
        maintenanceReviews,
        projectNotes,
        notifications,
        projectActivities,
        toasts,
        showToast,
        removeToast,
        isSearchOpen,
        setIsSearchOpen,
        isMobileSidebarOpen,
        setIsMobileSidebarOpen,
        isPwaInstallable,
        isInstalledPwa,
        promptPwaInstall,
        isNewClientModalOpen,
        setIsNewClientModalOpen,
        isEditClientModalOpen,
        setIsEditClientModalOpen,
        clientToEdit,
        setClientToEdit,
        openEditClientModal,
        isNewProjectModalOpen,
        setIsNewProjectModalOpen,
        isRecordPaymentModalOpen,
        setIsRecordPaymentModalOpen,
        paymentModalDefaultRecordId,
        openPaymentModalForRecord,
        isNewReviewModalOpen,
        setIsNewReviewModalOpen,
        addClient,
        updateClient,
        deleteClient,
        addProject,
        updateProject,
        deleteProject,
        toggleProjectPause,
        testProjectHealth,
        updateProjectApiConfig,
        addProjectActivity,
        deleteProjectActivity,
        resolveActivityAlert,
        rollbackProjectDeployment,
        recordPayment,
        updateFinanceRecord,
        addMaintenanceReview,
        updateMaintenanceReview,
        toggleReviewTask,
        updateReviewTaskStatus,
        addReviewTask,
        updateReviewTask,
        deleteReviewTask,
        scheduleNextReview,
        addProjectNote,
        updateProjectNote,
        deleteProjectNote,
        toggleChecklistItem,
        markNotificationRead,
        markAllNotificationsRead,
        mrrTotal,
        accountsReceivableTotal,
        inMoraCount,
        inMoraAmount,
        pendingReviewsCount,
        activeProjectsCount,
        resetDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
