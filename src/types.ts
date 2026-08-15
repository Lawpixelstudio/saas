export type NavigationModule = 
  | 'dashboard'
  | 'clients'
  | 'projects'
  | 'finance'
  | 'maintenance'
  | 'documentation';

export type DeliveryType = 
  | 'PWA'
  | 'E-commerce'
  | 'Menú Digital'
  | 'Landing Page'
  | 'Portal Web / Dashboard'
  | 'API / Backend';

export type ClientCategory = 'Enterprise' | 'Pyme' | 'Startup' | 'E-commerce' | 'Restaurante';

export type ClientStatus = 'Activo' | 'Inactivo' | 'En Onboarding';

export interface Client {
  id: string;
  name: string;
  taxId: string; // RIF / Tax ID
  domain: string; // Dominio web del cliente (ej. caracasgourmet.com)
  address: string;
  phone: string;
  email: string;
  legalRepresentative: string;
  category: ClientCategory;
  status: ClientStatus;
  createdAt: string;
  avatarColor: string;
  notesSummary?: string;

  // GitHub Platform
  githubEmail: string;
  githubLogin: string;
  githubRepo: string; // Nombre del repositorio (ej. goolo-agency/caracas-gourmet-app)
  githubPrivateKey: string; // Clave privada / Personal Access Token / Deploy Key

  // Supabase Platform
  supabaseEmail: string;
  supabaseLogin: string; // Login / Usuario / Project Ref
  supabasePrivateKey: string; // Clave privada / Service Role Key / DB Password

  // Cloudflare Platform
  cloudflareEmail: string;
  cloudflareLogin: string; // Login / Account ID / Usuario
  cloudflarePrivateKey: string; // Clave privada / Global API Key / API Token
}

export type GitHubDeployStatus = 'success' | 'failed' | 'building' | 'queued';
export type CloudflareDnsStatus = 'Proxied' | 'DNS Only' | 'Pending' | 'Error';
export type CloudflareSslStatus = 'Full (Strict)' | 'Flexible' | 'Off' | 'Expired';
export type SupabasePlan = 'Free' | 'Pro' | 'Team' | 'Enterprise';
export type SupabaseStatus = 'Healthy' | 'Paused' | 'High Load';
export type ProjectStatus = 'En Desarrollo' | 'En Producción' | 'En Revisión' | 'Mantenimiento';

export interface GitHubData {
  repo: string; // e.g. "goolo-dev/caracas-gourmet-pwa"
  branch: string; // e.g. "main"
  lastDeployStatus: GitHubDeployStatus;
  lastDeployAt: string;
  commitHash: string;
  commitMessage?: string;
}

export interface CloudflareData {
  zoneId: string;
  domain: string;
  dnsStatus: CloudflareDnsStatus;
  sslStatus: CloudflareSslStatus;
  sslExpiresAt: string;
  ipAddress?: string;
}

export interface SupabaseData {
  projectRef: string;
  projectUrl: string;
  anonApiKey: string;
  serviceRoleKey?: string;
  plan: SupabasePlan;
  dbSizeMb: number;
  storageSizeMb: number;
  status: SupabaseStatus;
}

export interface ProjectHourlyTraffic {
  hour: string; // '00:00', '04:00', etc.
  visits: number;
  requests: number;
}

export interface ProjectTopPage {
  path: string;
  views: number;
  percentage: number;
}

export interface ProjectApiIntegration {
  // Remote Control / Pause State
  isPaused: boolean;
  pauseReason?: string;
  pausedAt?: string;
  pauseWebhookUrl?: string;
  apiKey?: string;

  // Site Health & Functional Verification
  healthStatus: 'operational' | 'degraded' | 'down' | 'maintenance';
  httpStatusCode: number;
  latencyMs: number;
  uptimePercentage: number;
  lastHealthCheck: string;
  healthCheckEndpoint: string;
  sslDaysRemaining: number;
  dbLatencyMs: number;
  edgeCacheStatus: 'HIT' | 'MISS' | 'BYPASS';
  isFunctional: boolean;
  lastTestLog?: string;

  // Real-time Traffic & Visits
  analyticsApiUrl?: string;
  liveActiveVisitors: number;
  visitsToday: number;
  visitsThisWeek: number;
  visitsThisMonth: number;
  pageViewsToday: number;
  requestsPerMinute: number;
  bandwidthMbToday: number;
  avgResponseTimeMs: number;
  errorRatePercent: number;
  hourlyTraffic: ProjectHourlyTraffic[];
  topPages: ProjectTopPage[];
  deviceBreakdown: {
    mobile: number;
    desktop: number;
    tablet: number;
  };
}

export interface Project {
  id: string;
  clientId: string;
  name: string;
  deliveryType: DeliveryType;
  status: ProjectStatus;
  liveUrl: string;
  description: string;
  createdAt: string;
  targetLaunchDate?: string;
  github: GitHubData;
  cloudflare: CloudflareData;
  supabase: SupabaseData;
  siteApi: ProjectApiIntegration;
}

export type PaymentType = 'one_time' | 'subscription';
export type OneTimePaymentStatus = 'Pagado Total' | 'Abono Parcial' | 'Pendiente' | 'En Mora';
export type SubscriptionStatus = 'Pagado' | 'Pendiente' | 'En Mora';
export type PaymentMethod = 'Zelle' | 'Transferencia' | 'Stripe' | 'Efectivo' | 'Crypto (USDT)' | 'Pago Móvil';

export interface PaymentTransaction {
  id: string;
  date: string;
  amount: number;
  method: PaymentMethod;
  reference: string;
  notes?: string;
}

export interface FinanceRecord {
  id: string;
  clientId: string;
  projectId: string;
  paymentType: PaymentType;
  currency: 'USD' | 'EUR';
  
  // For one-time projects
  totalAmount?: number;
  initialDeposit?: number;
  remainingBalance?: number;
  oneTimeStatus?: OneTimePaymentStatus;
  
  // For subscriptions
  monthlyAmount?: number;
  billingDay: number; // 1 to 31
  subscriptionStatus?: SubscriptionStatus;
  nextBillingDate: string;
  lastPaidDate?: string;
  
  notes?: string;
  paymentHistory: PaymentTransaction[];
}

export type ReviewInterval = 30 | 60 | 90 | 180;
export type ReviewStatus = 'Al Día' | 'Próxima a Vencer' | 'Revisión Pendiente' | 'Vencida';
export type ReviewTaskStatus = 'todo' | 'in_progress' | 'completed';
export type TaskPriority = 'critical' | 'high' | 'medium' | 'low';

export interface ReviewTask {
  id: string;
  title: string;
  category: 'supabase' | 'cloudflare' | 'github' | 'security' | 'performance';
  completed: boolean;
  status?: ReviewTaskStatus;
  priority?: TaskPriority;
  description?: string;
  assignedTo?: string;
  estimatedHours?: number;
  updatedAt?: string;
}

export interface MaintenanceReview {
  id: string;
  projectId: string;
  clientId: string;
  title: string;
  intervalDays: ReviewInterval;
  lastReviewDate: string;
  nextReviewDate: string;
  status: ReviewStatus;
  auditorName: string;
  notes: string;
  tasks: ReviewTask[];
}

export interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
  category: 'SEO & Indexing' | 'Security & Keys' | 'Performance & Assets' | 'Forms & Webhooks' | 'DNS & SSL';
}

export interface ProjectNote {
  id: string;
  projectId: string;
  title: string;
  category: 'minuta' | 'credenciales' | 'env_vars' | 'pre_launch' | 'arquitectura';
  markdownContent: string;
  updatedAt: string;
  checklist?: ChecklistItem[];
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  type: 'mora' | 'review_pending' | 'ssl_warning' | 'deploy_failed' | 'payment_received';
  timestamp: string;
  read: boolean;
  linkModule?: NavigationModule;
  referenceId?: string;
}

export type ProjectActivityType = 'deployment' | 'config_change' | 'system_alert';
export type ProjectActivitySeverity = 'info' | 'success' | 'warning' | 'critical';

export interface ProjectActivity {
  id: string;
  projectId: string;
  type: ProjectActivityType;
  title: string;
  description: string;
  timestamp: string;
  severity: ProjectActivitySeverity;
  author?: string;
  metadata?: {
    // Deployments
    commitHash?: string;
    commitMessage?: string;
    branch?: string;
    deployDurationSec?: number;
    deployStatus?: 'success' | 'failed' | 'building' | 'queued' | 'rollback';
    environment?: 'production' | 'staging' | 'preview';
    deployLogs?: string[];
    rollbackAvailable?: boolean;

    // Config Changes
    changedField?: string;
    previousValue?: string;
    newValue?: string;
    category?: 'cloudflare' | 'supabase' | 'github' | 'site_api' | 'security' | 'env_vars';

    // System Alerts
    metricName?: string;
    metricValue?: string | number;
    threshold?: string | number;
    resolved?: boolean;
    resolvedAt?: string;
  };
}

export type UserRole = 
  | 'Super Admin' 
  | 'Lead DevOps' 
  | 'Auditor Técnico' 
  | 'Director Financiero';

export type SecurityLevel = 'Máxima (Blindada)' | 'Alta (2FA Activo)' | 'Estándar';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  passwordHash: string; // Simulated SHA-256 / bcrypt hash
  twoFactorEnabled: boolean;
  twoFactorSecret?: string;
  twoFactorBackupCodes?: string[];
  lastLogin: string;
  lastLoginIp: string;
  lastLoginDevice: string;
  securityLevel: SecurityLevel;
  failedAttempts: number;
  lockedUntil?: number | null; // Timestamp ms
  pinCode: string; // 4 or 6 digit PIN for fast Screen Lock unlock
  createdAt: string;
}

export type AuthAuditEventType = 
  | 'login_success' 
  | 'login_failed' 
  | '2fa_success' 
  | '2fa_failed' 
  | 'passkey_login'
  | 'account_locked' 
  | 'password_changed' 
  | '2fa_enabled'
  | '2fa_disabled'
  | 'session_locked' 
  | 'session_unlocked' 
  | 'logout' 
  | 'security_anomaly';

export interface AuthAuditLog {
  id: string;
  timestamp: string;
  userEmail: string;
  userName: string;
  eventType: AuthAuditEventType;
  ip: string;
  location: string;
  device: string;
  status: 'success' | 'warning' | 'blocked';
  details: string;
}

export interface SecuritySettings {
  autoLockMinutes: number; // 0 = disabled, 5, 15, 30, 60
  require2FAForSensitiveActions: boolean;
  maxFailedAttemptsBeforeLock: number; // e.g. 3
  lockoutDurationSeconds: number; // e.g. 30, 60, 300
  enforceStrongPasswordEntropy: boolean;
  notifyOnNewDeviceLogin: boolean;
  allowBiometricPasskeys: boolean;
}

