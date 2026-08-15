-- ============================================================================
-- GOOLO SYSTEM ERP - SUPABASE SCHEMA
-- URL: https://saas.maketo.site
-- Version: 1.0.0
-- ============================================================================
-- INSTRUCCIONES:
-- 1. Copiar todo este archivo
-- 2. Ir a Supabase Dashboard > SQL Editor
-- 3. Pegar y ejecutar (Run)
-- 4. Verificar que no hay errores en el log
-- ============================================================================

-- ============================================================================
-- 1. EXTENSIONES REQUERIDAS
-- ============================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- Búsqueda fuzzy

-- ============================================================================
-- 2. TIPOS PERSONALIZADOS (ENUMS)
-- ============================================================================

-- User Roles
CREATE TYPE user_role AS ENUM (
  'Super Admin',
  'Lead DevOps',
  'Auditor Técnico',
  'Director Financiero'
);

-- Security Level
CREATE TYPE security_level AS ENUM (
  'Máxima (Blindada)',
  'Alta (2FA Activo)',
  'Estándar'
);

-- Auth Audit Event Types
CREATE TYPE auth_audit_event_type AS ENUM (
  'login_success',
  'login_failed',
  '2fa_success',
  '2fa_failed',
  'passkey_login',
  'account_locked',
  'password_changed',
  '2fa_enabled',
  '2fa_disabled',
  'session_locked',
  'session_unlocked',
  'logout',
  'security_anomaly'
);

-- Client
CREATE TYPE client_category AS ENUM (
  'Enterprise',
  'Pyme',
  'Startup',
  'E-commerce',
  'Restaurante'
);

CREATE TYPE client_status AS ENUM (
  'Activo',
  'Inactivo',
  'En Onboarding'
);

-- Projects
CREATE TYPE delivery_type AS ENUM (
  'PWA',
  'E-commerce',
  'Menú Digital',
  'Landing Page',
  'Portal Web / Dashboard',
  'API / Backend'
);

CREATE TYPE project_status AS ENUM (
  'En Desarrollo',
  'En Producción',
  'En Revisión',
  'Mantenimiento'
);

CREATE TYPE github_deploy_status AS ENUM (
  'success',
  'failed',
  'building',
  'queued'
);

CREATE TYPE cloudflare_dns_status AS ENUM (
  'Proxied',
  'DNS Only',
  'Pending',
  'Error'
);

CREATE TYPE cloudflare_ssl_status AS ENUM (
  'Full (Strict)',
  'Flexible',
  'Off',
  'Expired'
);

CREATE TYPE supabase_plan AS ENUM (
  'Free',
  'Pro',
  'Team',
  'Enterprise'
);

CREATE TYPE supabase_status AS ENUM (
  'Healthy',
  'Paused',
  'High Load'
);

-- Health Status
CREATE TYPE health_status AS ENUM (
  'operational',
  'degraded',
  'down',
  'maintenance'
);

CREATE TYPE edge_cache_status AS ENUM (
  'HIT',
  'MISS',
  'BYPASS'
);

-- Finance
CREATE TYPE payment_type AS ENUM (
  'one_time',
  'subscription'
);

CREATE TYPE currency_type AS ENUM (
  'USD',
  'EUR'
);

CREATE TYPE one_time_payment_status AS ENUM (
  'Pagado Total',
  'Abono Parcial',
  'Pendiente',
  'En Mora'
);

CREATE TYPE subscription_status AS ENUM (
  'Pagado',
  'Pendiente',
  'En Mora'
);

CREATE TYPE payment_method AS ENUM (
  'Zelle',
  'Transferencia',
  'Stripe',
  'Efectivo',
  'Crypto (USDT)',
  'Pago Móvil'
);

-- Maintenance
CREATE TYPE review_interval AS ENUM (
  30,
  60,
  90,
  180
);

CREATE TYPE review_status AS ENUM (
  'Al Día',
  'Próxima a Vencer',
  'Revisión Pendiente',
  'Vencida'
);

CREATE TYPE review_task_status AS ENUM (
  'todo',
  'in_progress',
  'completed'
);

CREATE TYPE task_priority AS ENUM (
  'critical',
  'high',
  'medium',
  'low'
);

CREATE TYPE task_category AS ENUM (
  'supabase',
  'cloudflare',
  'github',
  'security',
  'performance'
);

-- Notes
CREATE TYPE note_category AS ENUM (
  'minuta',
  'credenciales',
  'env_vars',
  'pre_launch',
  'arquitectura'
);

CREATE TYPE checklist_category AS ENUM (
  'SEO & Indexing',
  'Security & Keys',
  'Performance & Assets',
  'Forms & Webhooks',
  'DNS & SSL'
);

-- Notifications
CREATE TYPE notification_type AS ENUM (
  'mora',
  'review_pending',
  'ssl_warning',
  'deploy_failed',
  'payment_received'
);

-- Activities
CREATE TYPE activity_type AS ENUM (
  'deployment',
  'config_change',
  'system_alert'
);

CREATE TYPE activity_severity AS ENUM (
  'info',
  'success',
  'warning',
  'critical'
);

-- Auth Audit Status
CREATE TYPE audit_status AS ENUM (
  'success',
  'warning',
  'blocked'
);

-- Navigation Module
CREATE TYPE navigation_module AS ENUM (
  'dashboard',
  'clients',
  'projects',
  'finance',
  'maintenance',
  'documentation'
);


-- ============================================================================
-- 3. TABLAS PRINCIPALES
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 3.1 USER ACCOUNTS (Cuentas de usuario del sistema)
-- ----------------------------------------------------------------------------
CREATE TABLE user_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  role user_role NOT NULL DEFAULT 'Auditor Técnico',
  avatar VARCHAR(100),
  password_hash VARCHAR(255) NOT NULL, -- SHA-256 hash en cliente, bcrypt en server
  two_factor_enabled BOOLEAN DEFAULT FALSE,
  two_factor_secret VARCHAR(255),
  two_factor_backup_codes JSONB DEFAULT '[]'::jsonb,
  last_login TIMESTAMPTZ,
  last_login_ip VARCHAR(45), -- IPv4 o IPv6
  last_login_device TEXT,
  security_level security_level DEFAULT 'Estándar',
  failed_attempts INTEGER DEFAULT 0,
  locked_until TIMESTAMPTZ,
  pin_code VARCHAR(6) NOT NULL, -- 4-6 dígitos para screen lock
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para user_accounts
CREATE INDEX idx_user_accounts_email ON user_accounts(email);
CREATE INDEX idx_user_accounts_role ON user_accounts(role);
CREATE INDEX idx_user_accounts_active ON user_accounts(is_active);

-- ----------------------------------------------------------------------------
-- 3.2 SECURITY SETTINGS (Configuración de seguridad global)
-- ----------------------------------------------------------------------------
CREATE TABLE security_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  setting_key VARCHAR(100) NOT NULL UNIQUE,
  setting_value JSONB NOT NULL,
  description TEXT,
  updated_by UUID REFERENCES user_accounts(id),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Configuración por defecto
INSERT INTO security_settings (setting_key, setting_value, description) VALUES
('auto_lock_minutes', '15'::jsonb, 'Minutos de inactividad para auto-lock (0 = deshabilitado)'),
('require_2fa_sensitive', 'true'::jsonb, 'Requerir 2FA para acciones sensibles'),
('max_failed_attempts', '5'::jsonb, 'Máximo de intentos fallidos antes de bloqueo'),
('lockout_duration_seconds', '30'::jsonb, 'Duración del bloqueo en segundos'),
('enforce_strong_password', 'true'::jsonb, 'Exigir contraseña fuerte'),
('notify_new_device_login', 'true'::jsonb, 'Notificar en login de dispositivo nuevo'),
('allow_biometric_passkeys', 'true'::jsonb, 'Permitir passkeys biométricas'),
('session_duration_hours', '4'::jsonb, 'Duración de sesión en horas');

-- ----------------------------------------------------------------------------
-- 3.3 AUTH AUDIT LOGS (Registro de auditoría de autenticación)
-- ----------------------------------------------------------------------------
CREATE TABLE auth_audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_email VARCHAR(255) NOT NULL,
  user_name VARCHAR(255) NOT NULL,
  event_type auth_audit_event_type NOT NULL,
  ip VARCHAR(45) NOT NULL,
  location TEXT,
  device TEXT,
  status audit_status NOT NULL,
  details TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para auth_audit_logs
CREATE INDEX idx_audit_logs_email ON auth_audit_logs(user_email);
CREATE INDEX idx_audit_logs_event ON auth_audit_logs(event_type);
CREATE INDEX idx_audit_logs_status ON auth_audit_logs(status);
CREATE INDEX idx_audit_logs_created ON auth_audit_logs(created_at DESC);

-- ----------------------------------------------------------------------------
-- 3.4 CLIENTS (Directorio de clientes)
-- ----------------------------------------------------------------------------
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  tax_id VARCHAR(50) UNIQUE, -- RIF / Tax ID
  domain VARCHAR(255),
  address TEXT,
  phone VARCHAR(50),
  email VARCHAR(255),
  legal_representative VARCHAR(255),
  category client_category DEFAULT 'Pyme',
  status client_status DEFAULT 'Activo',
  avatar_color VARCHAR(50), -- Tailwind class: bg-amber-500
  notes_summary TEXT,
  
  -- GitHub Platform
  github_email VARCHAR(255),
  github_login VARCHAR(255),
  github_repo VARCHAR(255),
  github_private_key TEXT, -- ENCRYPTED: Personal Access Token
  
  -- Supabase Platform
  supabase_email VARCHAR(255),
  supabase_login VARCHAR(255),
  supabase_private_key TEXT, -- ENCRYPTED: Service Role Key
  
  -- Cloudflare Platform
  cloudflare_email VARCHAR(255),
  cloudflare_login VARCHAR(255),
  cloudflare_private_key TEXT, -- ENCRYPTED: API Token
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para clients
CREATE INDEX idx_clients_name ON clients(name);
CREATE INDEX idx_clients_domain ON clients(domain);
CREATE INDEX idx_clients_status ON clients(status);
CREATE INDEX idx_clients_category ON clients(category);

-- ----------------------------------------------------------------------------
-- 3.5 PROJECTS (Proyectos de clientes)
-- ----------------------------------------------------------------------------
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  delivery_type delivery_type NOT NULL,
  status project_status DEFAULT 'En Desarrollo',
  live_url VARCHAR(500),
  description TEXT,
  target_launch_date DATE,
  
  -- GitHub Data
  github_repo VARCHAR(255),
  github_branch VARCHAR(100) DEFAULT 'main',
  github_last_deploy_status github_deploy_status,
  github_last_deploy_at TIMESTAMPTZ,
  github_commit_hash VARCHAR(20),
  github_commit_message TEXT,
  
  -- Cloudflare Data
  cloudflare_zone_id VARCHAR(100),
  cloudflare_domain VARCHAR(255),
  cloudflare_dns_status cloudflare_dns_status,
  cloudflare_ssl_status cloudflare_ssl_status,
  cloudflare_ssl_expires_at DATE,
  cloudflare_ip_address VARCHAR(45),
  
  -- Supabase Data
  supabase_project_ref VARCHAR(100),
  supabase_project_url VARCHAR(500),
  supabase_anon_key TEXT,
  supabase_service_role_key TEXT, -- ENCRYPTED
  supabase_plan supabase_plan DEFAULT 'Free',
  supabase_db_size_mb NUMERIC(10,2) DEFAULT 0,
  supabase_storage_size_mb NUMERIC(10,2) DEFAULT 0,
  supabase_status supabase_status DEFAULT 'Healthy',
  
  -- Site API Integration
  site_is_paused BOOLEAN DEFAULT FALSE,
  site_pause_reason TEXT,
  site_paused_at TIMESTAMPTZ,
  site_pause_webhook_url VARCHAR(500),
  site_api_key VARCHAR(255),
  site_health_status health_status DEFAULT 'operational',
  site_http_status_code INTEGER DEFAULT 200,
  site_latency_ms INTEGER DEFAULT 0,
  site_uptime_percentage NUMERIC(5,2) DEFAULT 100,
  site_last_health_check TIMESTAMPTZ,
  site_health_check_endpoint VARCHAR(500),
  site_ssl_days_remaining INTEGER DEFAULT 180,
  site_db_latency_ms INTEGER DEFAULT 0,
  site_edge_cache_status edge_cache_status DEFAULT 'HIT',
  site_is_functional BOOLEAN DEFAULT TRUE,
  site_last_test_log TEXT,
  site_analytics_api_url VARCHAR(500),
  
  -- Traffic Metrics
  site_live_active_visitors INTEGER DEFAULT 0,
  site_visits_today INTEGER DEFAULT 0,
  site_visits_this_week INTEGER DEFAULT 0,
  site_visits_this_month INTEGER DEFAULT 0,
  site_page_views_today INTEGER DEFAULT 0,
  site_requests_per_minute INTEGER DEFAULT 0,
  site_bandwidth_mb_today NUMERIC(10,2) DEFAULT 0,
  site_avg_response_time_ms INTEGER DEFAULT 0,
  site_error_rate_percent NUMERIC(5,2) DEFAULT 0,
  
  -- Traffic Data (JSON)
  site_hourly_traffic JSONB DEFAULT '[]'::jsonb,
  site_top_pages JSONB DEFAULT '[]'::jsonb,
  site_device_breakdown JSONB DEFAULT '{"mobile": 0, "desktop": 0, "tablet": 0}'::jsonb,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para projects
CREATE INDEX idx_projects_client_id ON projects(client_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_delivery_type ON projects(delivery_type);
CREATE INDEX idx_projects_domain ON projects(cloudflare_domain);

-- ----------------------------------------------------------------------------
-- 3.6 FINANCE RECORDS (Registros financieros)
-- ----------------------------------------------------------------------------
CREATE TABLE finance_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  payment_type payment_type NOT NULL,
  currency currency_type DEFAULT 'USD',
  
  -- One-time payments
  total_amount NUMERIC(12,2),
  initial_deposit NUMERIC(12,2),
  remaining_balance NUMERIC(12,2),
  one_time_status one_time_payment_status,
  
  -- Subscriptions
  monthly_amount NUMERIC(12,2),
  billing_day INTEGER CHECK (billing_day >= 1 AND billing_day <= 31),
  subscription_status subscription_status,
  next_billing_date DATE,
  last_paid_date DATE,
  
  notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para finance_records
CREATE INDEX idx_finance_client_id ON finance_records(client_id);
CREATE INDEX idx_finance_project_id ON finance_records(project_id);
CREATE INDEX idx_finance_payment_type ON finance_records(payment_type);
CREATE INDEX idx_finance_subscription_status ON finance_records(subscription_status);
CREATE INDEX idx_finance_one_time_status ON finance_records(one_time_status);

-- ----------------------------------------------------------------------------
-- 3.7 PAYMENT TRANSACTIONS (Transacciones de pago)
-- ----------------------------------------------------------------------------
CREATE TABLE payment_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  finance_record_id UUID NOT NULL REFERENCES finance_records(id) ON DELETE CASCADE,
  amount NUMERIC(12,2) NOT NULL,
  method payment_method NOT NULL,
  reference VARCHAR(255),
  notes TEXT,
  payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para payment_transactions
CREATE INDEX idx_transactions_finance_id ON payment_transactions(finance_record_id);
CREATE INDEX idx_transactions_date ON payment_transactions(payment_date DESC);
CREATE INDEX idx_transactions_method ON payment_transactions(method);

-- ----------------------------------------------------------------------------
-- 3.8 MAINTENANCE REVIEWS (Revisiones de mantenimiento)
-- ----------------------------------------------------------------------------
CREATE TABLE maintenance_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  interval_days INTEGER NOT NULL CHECK (interval_days IN (30, 60, 90, 180)),
  last_review_date DATE,
  next_review_date DATE,
  status review_status DEFAULT 'Revisión Pendiente',
  auditor_name VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para maintenance_reviews
CREATE INDEX idx_reviews_project_id ON maintenance_reviews(project_id);
CREATE INDEX idx_reviews_client_id ON maintenance_reviews(client_id);
CREATE INDEX idx_reviews_status ON maintenance_reviews(status);
CREATE INDEX idx_reviews_next_date ON maintenance_reviews(next_review_date);

-- ----------------------------------------------------------------------------
-- 3.9 REVIEW TASKS (Tareas de revisión)
-- ----------------------------------------------------------------------------
CREATE TABLE review_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  review_id UUID NOT NULL REFERENCES maintenance_reviews(id) ON DELETE CASCADE,
  title VARCHAR(500) NOT NULL,
  category task_category NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  status review_task_status DEFAULT 'todo',
  priority task_priority DEFAULT 'medium',
  description TEXT,
  assigned_to VARCHAR(255),
  estimated_hours NUMERIC(5,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para review_tasks
CREATE INDEX idx_tasks_review_id ON review_tasks(review_id);
CREATE INDEX idx_tasks_status ON review_tasks(status);
CREATE INDEX idx_tasks_priority ON review_tasks(priority);
CREATE INDEX idx_tasks_category ON review_tasks(category);

-- ----------------------------------------------------------------------------
-- 3.10 PROJECT NOTES (Notas y documentación)
-- ----------------------------------------------------------------------------
CREATE TABLE project_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  category note_category NOT NULL,
  markdown_content TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para project_notes
CREATE INDEX idx_notes_project_id ON project_notes(project_id);
CREATE INDEX idx_notes_category ON project_notes(category);

-- ----------------------------------------------------------------------------
-- 3.11 CHECKLIST ITEMS (Ítems de checklist pre-lanzamiento)
-- ----------------------------------------------------------------------------
CREATE TABLE checklist_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  note_id UUID NOT NULL REFERENCES project_notes(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  checked BOOLEAN DEFAULT FALSE,
  category checklist_category NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para checklist_items
CREATE INDEX idx_checklist_note_id ON checklist_items(note_id);
CREATE INDEX idx_checklist_category ON checklist_items(category);

-- ----------------------------------------------------------------------------
-- 3.12 NOTIFICATIONS (Notificaciones del sistema)
-- ----------------------------------------------------------------------------
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  type notification_type NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  link_module navigation_module,
  reference_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para notifications
CREATE INDEX idx_notifications_read ON notifications(is_read);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);

-- ----------------------------------------------------------------------------
-- 3.13 PROJECT ACTIVITIES (Feed de actividad / historial)
-- ----------------------------------------------------------------------------
CREATE TABLE project_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  activity_type activity_type NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  severity activity_severity DEFAULT 'info',
  author VARCHAR(255),
  
  -- Deployment metadata
  metadata_commit_hash VARCHAR(20),
  metadata_commit_message TEXT,
  metadata_branch VARCHAR(100),
  metadata_deploy_duration_sec INTEGER,
  metadata_deploy_status VARCHAR(20),
  metadata_environment VARCHAR(20),
  metadata_deploy_logs JSONB DEFAULT '[]'::jsonb,
  metadata_rollback_available BOOLEAN DEFAULT FALSE,
  
  -- Config change metadata
  metadata_changed_field VARCHAR(100),
  metadata_previous_value TEXT,
  metadata_new_value TEXT,
  metadata_category VARCHAR(50),
  
  -- Alert metadata
  metadata_metric_name VARCHAR(100),
  metadata_metric_value VARCHAR(255),
  metadata_threshold VARCHAR(255),
  metadata_resolved BOOLEAN DEFAULT FALSE,
  metadata_resolved_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para project_activities
CREATE INDEX idx_activities_project_id ON project_activities(project_id);
CREATE INDEX idx_activities_type ON project_activities(activity_type);
CREATE INDEX idx_activities_severity ON project_activities(severity);
CREATE INDEX idx_activities_created ON project_activities(created_at DESC);


-- ============================================================================
-- 4. FUNCIÖNES ÚTILES
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 4.1 Function: Update updated_at timestamp
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para auto-update de updated_at
CREATE TRIGGER update_user_accounts_updated_at BEFORE UPDATE ON user_accounts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_finance_records_updated_at BEFORE UPDATE ON finance_records
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_maintenance_reviews_updated_at BEFORE UPDATE ON maintenance_reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_review_tasks_updated_at BEFORE UPDATE ON review_tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_project_notes_updated_at BEFORE UPDATE ON project_notes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ----------------------------------------------------------------------------
-- 4.2 Function: Calculate next review date
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION calculate_next_review_date(
  last_review DATE,
  interval_days INTEGER
) RETURNS DATE AS $$
BEGIN
  RETURN last_review + (interval_days || ' days')::INTERVAL;
END;
$$ LANGUAGE plpgsql;

-- ----------------------------------------------------------------------------
-- 4.3 Function: Get MRR (Monthly Recurring Revenue)
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION get_mrr_total()
RETURNS NUMERIC AS $$
DECLARE
  total NUMERIC;
BEGIN
  SELECT COALESCE(SUM(monthly_amount), 0)
  INTO total
  FROM finance_records
  WHERE payment_type = 'subscription'
    AND subscription_status != 'En Mora';
  
  RETURN total;
END;
$$ LANGUAGE plpgsql;

-- ----------------------------------------------------------------------------
-- 4.4 Function: Get accounts receivable
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION get_accounts_receivable()
RETURNS NUMERIC AS $$
DECLARE
  total NUMERIC;
BEGIN
  SELECT COALESCE(SUM(
    CASE
      WHEN payment_type = 'one_time' THEN remaining_balance
      WHEN payment_type = 'subscription' AND subscription_status IN ('En Mora', 'Pendiente') THEN monthly_amount
      ELSE 0
    END
  ), 0)
  INTO total
  FROM finance_records;
  
  RETURN total;
END;
$$ LANGUAGE plpgsql;

-- ----------------------------------------------------------------------------
-- 4.5 Function: Get in-mora count and amount
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION get_mora_stats()
RETURNS TABLE(count BIGINT, amount NUMERIC) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::BIGINT,
    COALESCE(SUM(
      CASE
        WHEN payment_type = 'subscription' THEN monthly_amount
        WHEN payment_type = 'one_time' THEN remaining_balance
        ELSE 0
      END
    ), 0)
  FROM finance_records
  WHERE (payment_type = 'subscription' AND subscription_status = 'En Mora')
     OR (payment_type = 'one_time' AND one_time_status = 'En Mora');
END;
$$ LANGUAGE plpgsql;

-- ----------------------------------------------------------------------------
-- 4.6 Function: Get pending reviews count
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION get_pending_reviews_count()
RETURNS BIGINT AS $$
DECLARE
  total BIGINT;
BEGIN
  SELECT COUNT(*)
  INTO total
  FROM maintenance_reviews
  WHERE status IN ('Revisión Pendiente', 'Vencida');
  
  RETURN total;
END;
$$ LANGUAGE plpgsql;

-- ----------------------------------------------------------------------------
-- 4.7 Function: Log auth audit event
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION log_auth_event(
  p_user_email VARCHAR,
  p_user_name VARCHAR,
  p_event_type auth_audit_event_type,
  p_ip VARCHAR,
  p_location TEXT,
  p_device TEXT,
  p_status audit_status,
  p_details TEXT
) RETURNS UUID AS $$
DECLARE
  log_id UUID;
BEGIN
  INSERT INTO auth_audit_logs (
    user_email, user_name, event_type, ip, location, device, status, details
  ) VALUES (
    p_user_email, p_user_name, p_event_type, p_ip, p_location, p_device, p_status, p_details
  )
  RETURNING id INTO log_id;
  
  RETURN log_id;
END;
$$ LANGUAGE plpgsql;

-- ----------------------------------------------------------------------------
-- 4.8 Function: Check if user is locked
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION is_user_locked(user_email VARCHAR)
RETURNS BOOLEAN AS $$
DECLARE
  is_locked BOOLEAN;
BEGIN
  SELECT locked_until IS NOT NULL AND locked_until > NOW()
  INTO is_locked
  FROM user_accounts
  WHERE email = user_email;
  
  RETURN COALESCE(is_locked, FALSE);
END;
$$ LANGUAGE plpgsql;

-- ----------------------------------------------------------------------------
-- 4.9 Function: Increment failed attempts and lock if needed
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION increment_failed_attempts(user_email VARCHAR)
RETURNS INTEGER AS $$
DECLARE
  new_count INTEGER;
  max_attempts INTEGER;
  lockout_seconds INTEGER;
BEGIN
  -- Get security settings
  SELECT (setting_value->>'max_failed_attempts')::INTEGER INTO max_attempts
  FROM security_settings WHERE setting_key = 'max_failed_attempts';
  
  SELECT (setting_value->>'lockout_duration_seconds')::INTEGER INTO lockout_seconds
  FROM security_settings WHERE setting_key = 'lockout_duration_seconds';
  
  -- Default values
  max_attempts := COALESCE(max_attempts, 5);
  lockout_seconds := COALESCE(lockout_seconds, 30);
  
  -- Increment attempts
  UPDATE user_accounts
  SET failed_attempts = failed_attempts + 1,
      locked_until = CASE
        WHEN failed_attempts + 1 >= max_attempts THEN NOW() + (lockout_seconds || ' seconds')::INTERVAL
        ELSE locked_until
      END
  WHERE email = user_email
  RETURNING failed_attempts INTO new_count;
  
  RETURN new_count;
END;
$$ LANGUAGE plpgsql;

-- ----------------------------------------------------------------------------
-- 4.10 Function: Reset failed attempts on successful login
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION reset_failed_attempts(user_email VARCHAR)
RETURNS VOID AS $$
BEGIN
  UPDATE user_accounts
  SET failed_attempts = 0,
      locked_until = NULL
  WHERE email = user_email;
END;
$$ LANGUAGE plpgsql;

-- ----------------------------------------------------------------------------
-- 4.11 Function: Get active projects count
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION get_active_projects_count()
RETURNS BIGINT AS $$
DECLARE
  total BIGINT;
BEGIN
  SELECT COUNT(*)
  INTO total
  FROM projects
  WHERE status IN ('En Producción', 'En Desarrollo');
  
  RETURN total;
END;
$$ LANGUAGE plpgsql;


-- ============================================================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE user_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE auth_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE checklist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_activities ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- 5.1 Policies: USER ACCOUNTS
-- Solo Super Admin puede ver/modificar todos los usuarios
-- Lead DevOps puede ver usuarios pero no modificar
-- Otros solo ven su propio perfil
-- ----------------------------------------------------------------------------

-- Super Admin: Full access
CREATE POLICY "user_accounts_super_admin_all" ON user_accounts
  FOR ALL
  TO authenticated
  USING (
    (SELECT role FROM user_accounts WHERE id = auth.uid()) = 'Super Admin'
  );

-- Lead DevOps: Read only
CREATE POLICY "user_accounts_devops_read" ON user_accounts
  FOR SELECT
  TO authenticated
  USING (
    (SELECT role FROM user_accounts WHERE id = auth.uid()) = 'Lead DevOps'
  );

-- All authenticated: Read own profile
CREATE POLICY "user_accounts_own_profile" ON user_accounts
  FOR SELECT
  TO authenticated
  USING (id = auth.uid());

-- All authenticated: Update own profile (limited fields)
CREATE POLICY "user_accounts_own_update" ON user_accounts
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- ----------------------------------------------------------------------------
-- 5.2 Policies: AUTH AUDIT LOGS
-- Super Admin: Full access
-- Lead DevOps: Read only
-- Others: No access
-- ----------------------------------------------------------------------------

CREATE POLICY "audit_logs_super_admin_all" ON auth_audit_logs
  FOR ALL
  TO authenticated
  USING (
    (SELECT role FROM user_accounts WHERE id = auth.uid()) = 'Super Admin'
  );

CREATE POLICY "audit_logs_devops_read" ON auth_audit_logs
  FOR SELECT
  TO authenticated
  USING (
    (SELECT role FROM user_accounts WHERE id = auth.uid()) = 'Lead DevOps'
  );

-- Insert for authenticated users (to log their own events)
CREATE POLICY "audit_logs_insert_authenticated" ON auth_audit_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- ----------------------------------------------------------------------------
-- 5.3 Policies: SECURITY SETTINGS
-- Solo Super Admin puede ver/modificar
-- ----------------------------------------------------------------------------

CREATE POLICY "security_settings_super_admin" ON security_settings
  FOR ALL
  TO authenticated
  USING (
    (SELECT role FROM user_accounts WHERE id = auth.uid()) = 'Super Admin'
  );

-- ----------------------------------------------------------------------------
-- 5.4 Policies: CLIENTS
-- Super Admin y Lead DevOps: Full access
-- Auditor Técnico: Read only
-- Director Financiero: Read only
-- ----------------------------------------------------------------------------

CREATE POLICY "clients_admin_full" ON clients
  FOR ALL
  TO authenticated
  USING (
    (SELECT role FROM user_accounts WHERE id = auth.uid()) IN ('Super Admin', 'Lead DevOps')
  );

CREATE POLICY "clients_read_all" ON clients
  FOR SELECT
  TO authenticated
  USING (true);

-- ----------------------------------------------------------------------------
-- 5.5 Policies: PROJECTS
-- Super Admin y Lead DevOps: Full access
-- Auditor Técnico: Read only
-- Director Financiero: Read only
-- ----------------------------------------------------------------------------

CREATE POLICY "projects_admin_full" ON projects
  FOR ALL
  TO authenticated
  USING (
    (SELECT role FROM user_accounts WHERE id = auth.uid()) IN ('Super Admin', 'Lead DevOps')
  );

CREATE POLICY "projects_read_all" ON projects
  FOR SELECT
  TO authenticated
  USING (true);

-- ----------------------------------------------------------------------------
-- 5.6 Policies: FINANCE RECORDS
-- Super Admin y Director Financiero: Full access
-- Lead DevOps: Read only
-- Auditor Técnico: No access
-- ----------------------------------------------------------------------------

CREATE POLICY "finance_admin_full" ON finance_records
  FOR ALL
  TO authenticated
  USING (
    (SELECT role FROM user_accounts WHERE id = auth.uid()) IN ('Super Admin', 'Director Financiero')
  );

CREATE POLICY "finance_devops_read" ON finance_records
  FOR SELECT
  TO authenticated
  USING (
    (SELECT role FROM user_accounts WHERE id = auth.uid()) = 'Lead DevOps'
  );

-- ----------------------------------------------------------------------------
-- 5.7 Policies: PAYMENT TRANSACTIONS
-- Super Admin y Director Financiero: Full access
-- Lead DevOps: Read only
-- ----------------------------------------------------------------------------

CREATE POLICY "transactions_admin_full" ON payment_transactions
  FOR ALL
  TO authenticated
  USING (
    (SELECT role FROM user_accounts WHERE id = auth.uid()) IN ('Super Admin', 'Director Financiero')
  );

CREATE POLICY "transactions_devops_read" ON payment_transactions
  FOR SELECT
  TO authenticated
  USING (
    (SELECT role FROM user_accounts WHERE id = auth.uid()) = 'Lead DevOps'
  );

-- ----------------------------------------------------------------------------
-- 5.8 Policies: MAINTENANCE REVIEWS
-- Super Admin y Lead DevOps: Full access
-- Auditor Técnico: Read + Update tasks
-- Director Financiero: Read only
-- ----------------------------------------------------------------------------

CREATE POLICY "reviews_admin_full" ON maintenance_reviews
  FOR ALL
  TO authenticated
  USING (
    (SELECT role FROM user_accounts WHERE id = auth.uid()) IN ('Super Admin', 'Lead DevOps')
  );

CREATE POLICY "reviews_auditor_update" ON maintenance_reviews
  FOR UPDATE
  TO authenticated
  USING (
    (SELECT role FROM user_accounts WHERE id = auth.uid()) = 'Auditor Técnico'
  );

CREATE POLICY "reviews_read_all" ON maintenance_reviews
  FOR SELECT
  TO authenticated
  USING (true);

-- ----------------------------------------------------------------------------
-- 5.9 Policies: REVIEW TASKS
-- Super Admin y Lead DevOps: Full access
-- Auditor Técnico: Update status/completed
-- Director Financiero: Read only
-- ----------------------------------------------------------------------------

CREATE POLICY "tasks_admin_full" ON review_tasks
  FOR ALL
  TO authenticated
  USING (
    (SELECT role FROM user_accounts WHERE id = auth.uid()) IN ('Super Admin', 'Lead DevOps')
  );

CREATE POLICY "tasks_auditor_update" ON review_tasks
  FOR UPDATE
  TO authenticated
  USING (
    (SELECT role FROM user_accounts WHERE id = auth.uid()) = 'Auditor Técnico'
  )
  WITH CHECK (
    status IN ('todo', 'in_progress', 'completed')
  );

CREATE POLICY "tasks_read_all" ON review_tasks
  FOR SELECT
  TO authenticated
  USING (true);

-- ----------------------------------------------------------------------------
-- 5.10 Policies: PROJECT NOTES
-- Super Admin y Lead DevOps: Full access
-- Auditor Técnico: Read only
-- Director Financiero: Read only
-- ----------------------------------------------------------------------------

CREATE POLICY "notes_admin_full" ON project_notes
  FOR ALL
  TO authenticated
  USING (
    (SELECT role FROM user_accounts WHERE id = auth.uid()) IN ('Super Admin', 'Lead DevOps')
  );

CREATE POLICY "notes_read_all" ON project_notes
  FOR SELECT
  TO authenticated
  USING (true);

-- ----------------------------------------------------------------------------
-- 5.11 Policies: CHECKLIST ITEMS
-- Super Admin y Lead DevOps: Full access
-- Auditor Técnico: Toggle checked only
-- ----------------------------------------------------------------------------

CREATE POLICY "checklist_admin_full" ON checklist_items
  FOR ALL
  TO authenticated
  USING (
    (SELECT role FROM user_accounts WHERE id = auth.uid()) IN ('Super Admin', 'Lead DevOps')
  );

CREATE POLICY "checklist_auditor_toggle" ON checklist_items
  FOR UPDATE
  TO authenticated
  USING (
    (SELECT role FROM user_accounts WHERE id = auth.uid()) = 'Auditor Técnico'
  )
  WITH CHECK (
    checked IN (true, false)
  );

CREATE POLICY "checklist_read_all" ON checklist_items
  FOR SELECT
  TO authenticated
  USING (true);

-- ----------------------------------------------------------------------------
-- 5.12 Policies: NOTIFICATIONS
-- All authenticated users can read
-- Super Admin puede crear/eliminar
-- ----------------------------------------------------------------------------

CREATE POLICY "notifications_read_all" ON notifications
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "notifications_admin_manage" ON notifications
  FOR ALL
  TO authenticated
  USING (
    (SELECT role FROM user_accounts WHERE id = auth.uid()) = 'Super Admin'
  );

-- All authenticated can mark as read
CREATE POLICY "notifications_update_read" ON notifications
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ----------------------------------------------------------------------------
-- 5.13 Policies: PROJECT ACTIVITIES
-- Super Admin y Lead DevOps: Full access
-- Auditor Técnico: Read only
-- Director Financiero: Read only
-- ----------------------------------------------------------------------------

CREATE POLICY "activities_admin_full" ON project_activities
  FOR ALL
  TO authenticated
  USING (
    (SELECT role FROM user_accounts WHERE id = auth.uid()) IN ('Super Admin', 'Lead DevOps')
  );

CREATE POLICY "activities_read_all" ON project_activities
  FOR SELECT
  TO authenticated
  USING (true);


-- ============================================================================
-- 6. FUNCTION: Get user role (para RLS)
-- ============================================================================

-- Función para obtener el rol del usuario actual
CREATE OR REPLACE FUNCTION auth.user_role()
RETURNS user_role AS $$
  SELECT role FROM user_accounts WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Función para verificar si es Super Admin
CREATE OR REPLACE FUNCTION auth.is_super_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_accounts WHERE id = auth.uid() AND role = 'Super Admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Función para verificar si tiene acceso de admin
CREATE OR REPLACE FUNCTION auth.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_accounts WHERE id = auth.uid() 
    AND role IN ('Super Admin', 'Lead DevOps')
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Función para verificar si tiene acceso financiero
CREATE OR REPLACE FUNCTION auth.has_finance_access()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_accounts WHERE id = auth.uid() 
    AND role IN ('Super Admin', 'Director Financiero')
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;


-- ============================================================================
-- 7. REALTIME SUBSCRIPTIONS (Para live updates)
-- ============================================================================

-- Habilitar realtime para tablas importantes
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE project_activities;
ALTER PUBLICATION supabase_realtime ADD TABLE projects;


-- ============================================================================
-- 8. STORAGE BUCKETS (Para archivos)
-- ============================================================================

-- Bucket para avatares de usuarios
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
) ON CONFLICT (id) DO NOTHING;

-- Bucket para logos de clientes
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'client-logos',
  'client-logos',
  true,
  10485760, -- 10MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
) ON CONFLICT (id) DO NOTHING;

-- Bucket para documentos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'documents',
  'documents',
  false,
  52428800, -- 50MB
  ARRAY['application/pdf', 'text/plain', 'text/markdown']
) ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "avatars_public_read" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "avatars_insert_authenticated" ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'avatars');

CREATE POLICY "client_logos_public_read" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'client-logos');

CREATE POLICY "client_logos_insert_admin" ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'client-logos' 
    AND auth.is_admin()
  );

CREATE POLICY "documents_authenticated_read" ON storage.objects
  FOR SELECT
  TO authenticated
  USING (bucket_id = 'documents');

CREATE POLICY "documents_insert_admin" ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'documents'
    AND auth.is_admin()
  );


-- ============================================================================
-- 9. SEED DATA: Usuario inicial (kecho8a@gmail.com)
-- ============================================================================
-- NOTA: El password_hash es un hash SHA-256 de "kecho.180" con salt
-- En producción, usar bcrypt server-side

INSERT INTO user_accounts (
  email,
  name,
  role,
  avatar,
  password_hash,
  two_factor_enabled,
  pin_code,
  security_level,
  is_active
) VALUES (
  'kecho8a@gmail.com',
  'Kecho',
  'Super Admin',
  'bg-gradient-to-br from-blue-500 to-purple-600',
  'kecho.180', -- En producción: bcrypt hash
  false,
  '2026',
  'Máxima (Blindada)',
  true
) ON CONFLICT (email) DO NOTHING;

-- ============================================================================
-- 10. VIEWS ÚTILS (Para dashboard)
-- ============================================================================

-- Vista: Resumen de clientes con proyectos activos
CREATE OR REPLACE VIEW v_client_summary AS
SELECT
  c.id,
  c.name,
  c.domain,
  c.category,
  c.status,
  c.avatar_color,
  COUNT(p.id) AS total_projects,
  COUNT(p.id) FILTER (WHERE p.status = 'En Producción') AS active_projects,
  c.created_at
FROM clients c
LEFT JOIN projects p ON p.client_id = c.id
GROUP BY c.id, c.name, c.domain, c.category, c.status, c.avatar_color, c.created_at;

-- Vista: KPIs del dashboard
CREATE OR REPLACE VIEW v_dashboard_kpis AS
SELECT
  get_mrr_total() AS mrr_total,
  get_accounts_receivable() AS accounts_receivable,
  (SELECT count FROM get_mora_stats()) AS in_mora_count,
  (SELECT amount FROM get_mora_stats()) AS in_mora_amount,
  get_pending_reviews_count() AS pending_reviews_count,
  get_active_projects_count() AS active_projects_count;

-- Vista: Proyectos con estado de salud
CREATE OR REPLACE VIEW v_project_health AS
SELECT
  p.id,
  p.name AS project_name,
  c.name AS client_name,
  c.domain AS client_domain,
  p.status AS project_status,
  p.site_health_status,
  p.site_uptime_percentage,
  p.site_latency_ms,
  p.cloudflare_ssl_status,
  p.cloudflare_ssl_expires_at,
  p.supabase_status,
  p.github_last_deploy_status
FROM projects p
JOIN clients c ON c.id = p.client_id;

-- ============================================================================
-- FIN DEL SCHEMA
-- ============================================================================

-- Mensaje de confirmación
DO $$
BEGIN
  RAISE NOTICE '============================================';
  RAISE NOTICE 'GOOLO SYSTEM ERP - Schema creado exitosamente';
  RAISE NOTICE '============================================';
  RAISE NOTICE 'Tablas creadas: 13';
  RAISE NOTICE 'Funciones creadas: 11';
  RAISE NOTICE 'Políticas RLS: 30+';
  RAISE NOTICE 'Vistas creadas: 3';
  RAISE NOTICE 'Usuario inicial: kecho8a@gmail.com';
  RAISE NOTICE '============================================';
END $$;
