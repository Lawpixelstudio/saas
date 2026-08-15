import { 
  Client, 
  Project, 
  FinanceRecord, 
  MaintenanceReview, 
  ProjectNote, 
  NotificationItem, 
  ProjectActivity,
  UserAccount,
  AuthAuditLog,
  SecuritySettings
} from '../types';

export const initialClients: Client[] = [
  {
    id: 'cli-001',
    name: 'Grupo Gastronómico Caracas Gourmet',
    taxId: 'J-40918231-0',
    domain: 'caracasgourmet.com',
    address: 'Av. Principal de Las Mercedes, Edif. Gourmet Plaza, Piso 4, Caracas',
    phone: '+584128912345',
    email: 'contacto@caracasgourmet.com',
    legalRepresentative: 'Lic. Alejandro Mendoza',
    category: 'Restaurante',
    status: 'Activo',
    createdAt: '2025-11-10',
    avatarColor: 'bg-amber-500',
    notesSummary: 'Cadena de 4 restaurantes. Requiere sincronización de menú digital en tiempo real con sucursales.',
    
    // GitHub
    githubEmail: 'devops@caracasgourmet.com',
    githubLogin: 'goolo-caracasgourmet',
    githubRepo: 'goolo-agency/caracas-gourmet-pwa',
    githubPrivateKey: 'ghp_9k2L8A7v6Q1w5Z4e3R2t1Y0u9I8o7P6a5S4d',

    // Supabase
    supabaseEmail: 'db-admin@caracasgourmet.com',
    supabaseLogin: 'sb-cg-prod-8841',
    supabasePrivateKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZWZlcmVuY2UiOiJjZy1wcm9kIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczODk0ODIwMH0.Xk7L2Q_9aB4vC1dE8fG5hI6jK0lM3nO7pQ',

    // Cloudflare
    cloudflareEmail: 'dns-ops@caracasgourmet.com',
    cloudflareLogin: 'cf_acc_89a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4',
    cloudflarePrivateKey: 'cf_tok_7b9a2d8e4f1c6a0b5e3d7a9c1e4f6b8a2d0e3f5',
  },
  {
    id: 'cli-002',
    name: 'NovaPay Fintech Solutions',
    taxId: 'J-50123984-7',
    domain: 'novapay.io',
    address: 'Torre Digitel, Piso 12, Ofic. 12-B, La Castellana, Caracas',
    phone: '+584149876543',
    email: 'admin@novapay.io',
    legalRepresentative: 'Ing. Mariana Valenzuela',
    category: 'Startup',
    status: 'Activo',
    createdAt: '2025-09-15',
    avatarColor: 'bg-emerald-600',
    notesSummary: 'Plataforma de pagos y billetera virtual B2B. Alta exigencia en seguridad Supabase RLS y Cloudflare WAF.',
    
    // GitHub
    githubEmail: 'security@novapay.io',
    githubLogin: 'novapay-core-team',
    githubRepo: 'goolo-agency/novapay-fintech-wallet',
    githubPrivateKey: 'ghp_4n7M1v9X0k8P2q6W5e3R1t0Y9u8I7o6P5a4S',

    // Supabase
    supabaseEmail: 'infra@novapay.io',
    supabaseLogin: 'sb-novapay-core-9912',
    supabasePrivateKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZWZlcmVuY2UiOiJub3ZhcGF5LXByb2QiLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNzM4OTQ4MjAwfQ.Z8kL3Q_0bC5wD2eF9gH6iJ7kL1mN4oP8qR',

    // Cloudflare
    cloudflareEmail: 'security@novapay.io',
    cloudflareLogin: 'cf_acc_112233445566778899aabbccddeeff00',
    cloudflarePrivateKey: 'cf_tok_9a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9',
  },
  {
    id: 'cli-003',
    name: 'Inversiones Retail Plus C.A.',
    taxId: 'J-31849201-3',
    domain: 'retailplus.com.ve',
    address: 'Centro Comercial Sambil Chacao, Nivel Autopista, Local E-44',
    phone: '+584241122334',
    email: 'finanzas@retailplus.com.ve',
    legalRepresentative: 'Carlos Eduardo Benítez',
    category: 'E-commerce',
    status: 'Activo',
    createdAt: '2025-12-01',
    avatarColor: 'bg-purple-600',
    notesSummary: 'Tienda de tecnología y accesorios con más de 1,200 SKUs. Pagos vía Stripe y Binance Pay.',
    
    // GitHub
    githubEmail: 'ecommerce@retailplus.com.ve',
    githubLogin: 'retailplus-ve',
    githubRepo: 'goolo-agency/retail-plus-storefront',
    githubPrivateKey: 'ghp_8b2N4c7V1x0Z9q5W6e2R4t8Y3u1I9o0P7a6S',

    // Supabase
    supabaseEmail: 'catalogo@retailplus.com.ve',
    supabaseLogin: 'sb-retailplus-store-4401',
    supabasePrivateKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZWZlcmVuY2UiOiJyZXRhaWxwbHVzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczODk0ODIwMH0.A1bC2D_3eF4gH5iJ6kL7mN8oP9qR0sT1uV',

    // Cloudflare
    cloudflareEmail: 'dns@retailplus.com.ve',
    cloudflareLogin: 'cf_acc_aabbccddeeff00112233445566778899',
    cloudflarePrivateKey: 'cf_tok_5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4',
  },
  {
    id: 'cli-004',
    name: 'Clínica & Salud San Gabriel',
    taxId: 'J-29837482-1',
    domain: 'clinicasangabriel.com',
    address: 'Av. Los Próceres, Quinta San Gabriel, Urb. San Bernardino',
    phone: '+584165554321',
    email: 'soporte@clinicasangabriel.com',
    legalRepresentative: 'Dra. Elena Ramos De Sousa',
    category: 'Enterprise',
    status: 'Activo',
    createdAt: '2026-01-08',
    avatarColor: 'bg-blue-600',
    notesSummary: 'Portal de citas médicas, historial de pacientes y telemedicina. Cumplimiento de privacidad estricto.',
    
    // GitHub
    githubEmail: 'sistemas@clinicasangabriel.com',
    githubLogin: 'sangabriel-medtech',
    githubRepo: 'goolo-agency/sangabriel-medical-portal',
    githubPrivateKey: 'ghp_3m6K9j2H5g8F1d4S7a0P9o8I7u6Y5t4R3e2W',

    // Supabase
    supabaseEmail: 'dba@clinicasangabriel.com',
    supabaseLogin: 'sb-sangabriel-ehr-7721',
    supabasePrivateKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZWZlcmVuY2UiOiJzYW5nYWJyaWVsLXByb2QiLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNzM4OTQ4MjAwfQ.B2cD3E_4fG5hI6jK7lM8nO9pQ0rS1tU2vW',

    // Cloudflare
    cloudflareEmail: 'it-dept@clinicasangabriel.com',
    cloudflareLogin: 'cf_acc_5566778899aabbccddeeff0011223344',
    cloudflarePrivateKey: 'cf_tok_8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7',
  },
  {
    id: 'cli-005',
    name: 'Boutique Alma Moda & Estilo',
    taxId: 'J-41299834-9',
    domain: 'almamoda.com',
    address: 'Calle Madrid con Monterrey, Las Mercedes, Caracas',
    phone: '+584123339988',
    email: 'alma@almamoda.com',
    legalRepresentative: 'Valentina Rossi',
    category: 'Pyme',
    status: 'En Onboarding',
    createdAt: '2026-02-01',
    avatarColor: 'bg-pink-600',
    notesSummary: 'Showroom de moda exclusiva y catálogo interactivo para WhatsApp Checkout.',
    
    // GitHub
    githubEmail: 'marketing@almamoda.com',
    githubLogin: 'almamoda-boutique',
    githubRepo: 'goolo-agency/almamoda-catalog-pwa',
    githubPrivateKey: 'ghp_1a2B3c4D5e6F7g8H9i0J1k2L3m4N5o6P7q8R',

    // Supabase
    supabaseEmail: 'tech@almamoda.com',
    supabaseLogin: 'sb-almamoda-dev-1102',
    supabasePrivateKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZWZlcmVuY2UiOiJhbG1hbW9kYS1kZXYiLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNzM4OTQ4MjAwfQ.C3dE4F_5gH6iJ7kL8mN9oP0qR1sT2uV3wX',

    // Cloudflare
    cloudflareEmail: 'admin@almamoda.com',
    cloudflareLogin: 'cf_acc_99887766554433221100ffeeddccbbaa',
    cloudflarePrivateKey: 'cf_tok_3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2',
  }
];

export const initialProjects: Project[] = [
  {
    id: 'proj-001',
    clientId: 'cli-001',
    name: 'Caracas Gourmet Delivery PWA & Menú Digital',
    deliveryType: 'Menú Digital',
    status: 'En Producción',
    liveUrl: 'https://menu.caracasgourmet.com',
    description: 'Menú digital interactivo PWA con pedidos vía WhatsApp, control de mesas y panel de cocina en tiempo real.',
    createdAt: '2025-11-15',
    targetLaunchDate: '2025-12-20',
    github: {
      repo: 'goolo-dev/caracas-gourmet-pwa',
      branch: 'main',
      lastDeployStatus: 'success',
      lastDeployAt: '2026-08-10 14:23',
      commitHash: '7f9c2a1',
      commitMessage: 'feat: update menu price modifiers and seasonal dessert list',
    },
    cloudflare: {
      zoneId: '8f4a9b2c3d4e5f6a7b8c9d0e1f2a3b4c',
      domain: 'caracasgourmet.com',
      dnsStatus: 'Proxied',
      sslStatus: 'Full (Strict)',
      sslExpiresAt: '2027-02-14',
      ipAddress: '104.21.45.192',
    },
    supabase: {
      projectRef: 'abxvyuqwezptl',
      projectUrl: 'https://abxvyuqwezptl.supabase.co',
      anonApiKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFieHZ5dXF3ZXpwdGwiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTczMTY3MjAwMCwiZXhwIjoyMDQ3MjQ4MDAwfQ.9k8q7W_sample_key_caracas_gourmet_anon_92736152',
      serviceRoleKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFieHZ5dXF3ZXpwdGwiLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNzMxNjcyMDAwLCJleHAiOjIwNDcyNDgwMDB9.secret_service_role_key_778129',
      plan: 'Pro',
      dbSizeMb: 142.5,
      storageSizeMb: 850.0,
      status: 'Healthy',
    },
    siteApi: {
      isPaused: false,
      pauseReason: '',
      pauseWebhookUrl: 'https://menu.caracasgourmet.com/api/v1/system/status-toggle',
      apiKey: 'goolo_live_cg_9921827401',
      healthStatus: 'operational',
      httpStatusCode: 200,
      latencyMs: 48,
      uptimePercentage: 99.98,
      lastHealthCheck: '2026-08-14 15:32:10',
      healthCheckEndpoint: 'https://menu.caracasgourmet.com/api/health',
      sslDaysRemaining: 184,
      dbLatencyMs: 14,
      edgeCacheStatus: 'HIT',
      isFunctional: true,
      lastTestLog: 'Status 200 OK • Latencia Edge: 48ms • Supabase Postgres: 14ms • Cache Cloudflare: HIT (96%)',
      analyticsApiUrl: 'https://menu.caracasgourmet.com/api/telemetry/traffic',
      liveActiveVisitors: 38,
      visitsToday: 1420,
      visitsThisWeek: 9850,
      visitsThisMonth: 41200,
      pageViewsToday: 4890,
      requestsPerMinute: 76,
      bandwidthMbToday: 342.6,
      avgResponseTimeMs: 52,
      errorRatePercent: 0.02,
      hourlyTraffic: [
        { hour: '00:00', visits: 45, requests: 120 },
        { hour: '04:00', visits: 12, requests: 38 },
        { hour: '08:00', visits: 98, requests: 280 },
        { hour: '11:00', visits: 240, requests: 790 },
        { hour: '13:00', visits: 380, requests: 1250 },
        { hour: '15:00', visits: 310, requests: 940 },
        { hour: '18:00', visits: 185, requests: 590 },
        { hour: '20:00', visits: 150, requests: 480 },
      ],
      topPages: [
        { path: '/menu/platos-principales', views: 1840, percentage: 38 },
        { path: '/menu/postres-y-bebidas', views: 1210, percentage: 25 },
        { path: '/checkout/whatsapp', views: 980, percentage: 20 },
        { path: '/promociones-del-dia', views: 860, percentage: 17 },
      ],
      deviceBreakdown: {
        mobile: 78,
        desktop: 18,
        tablet: 4,
      }
    }
  },
  {
    id: 'proj-002',
    clientId: 'cli-002',
    name: 'NovaPay Web Terminal & Merchant Dashboard',
    deliveryType: 'Portal Web / Dashboard',
    status: 'En Producción',
    liveUrl: 'https://app.novapay.io',
    description: 'Dashboard de gestión transaccional para comercios afiliados con reportes de liquidación en divisas.',
    createdAt: '2025-09-20',
    targetLaunchDate: '2025-11-01',
    github: {
      repo: 'goolo-dev/novapay-merchant-portal',
      branch: 'production',
      lastDeployStatus: 'success',
      lastDeployAt: '2026-08-12 09:15',
      commitHash: '3a88d1f',
      commitMessage: 'fix: optimize ledger query execution and multi-currency exchange rates',
    },
    cloudflare: {
      zoneId: 'c19e8402fa71489bbec5a310df0410ef',
      domain: 'novapay.io',
      dnsStatus: 'Proxied',
      sslStatus: 'Full (Strict)',
      sslExpiresAt: '2026-11-20',
      ipAddress: '172.67.182.55',
    },
    supabase: {
      projectRef: 'novapayprod889',
      projectUrl: 'https://novapayprod889.supabase.co',
      anonApiKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5vdmFwYXlwcm9kODg5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjY4MzM2MDAsImV4cCI6MjA0MjQwOTYwMH0.T5gK2m_novapay_anon_key_prod_8812736192',
      serviceRoleKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5vdmFwYXlwcm9kODg5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyNjgzMzYwMCwiZXhwIjoyMDQyNDA5NjAwfQ.secret_novapay_service_role_key_991823',
      plan: 'Team',
      dbSizeMb: 610.2,
      storageSizeMb: 1240.0,
      status: 'Healthy',
    },
    siteApi: {
      isPaused: false,
      pauseReason: '',
      pauseWebhookUrl: 'https://app.novapay.io/api/admin/gateway-toggle',
      apiKey: 'goolo_live_nova_7718293400',
      healthStatus: 'operational',
      httpStatusCode: 200,
      latencyMs: 36,
      uptimePercentage: 99.99,
      lastHealthCheck: '2026-08-14 15:35:44',
      healthCheckEndpoint: 'https://app.novapay.io/api/health/ping',
      sslDaysRemaining: 98,
      dbLatencyMs: 9,
      edgeCacheStatus: 'HIT',
      isFunctional: true,
      lastTestLog: 'Status 200 OK • Microservicios Node.js: Activos • Postgres RLS: 9ms • WAF Cloudflare: 100% Blindado',
      analyticsApiUrl: 'https://app.novapay.io/api/admin/realtime-metrics',
      liveActiveVisitors: 114,
      visitsToday: 8920,
      visitsThisWeek: 58400,
      visitsThisMonth: 245000,
      pageViewsToday: 32400,
      requestsPerMinute: 245,
      bandwidthMbToday: 1480.0,
      avgResponseTimeMs: 38,
      errorRatePercent: 0.005,
      hourlyTraffic: [
        { hour: '00:00', visits: 120, requests: 450 },
        { hour: '04:00', visits: 80, requests: 310 },
        { hour: '08:00', visits: 640, requests: 2800 },
        { hour: '11:00', visits: 1450, requests: 6200 },
        { hour: '13:00', visits: 1890, requests: 7900 },
        { hour: '15:00', visits: 2100, requests: 8400 },
        { hour: '18:00', visits: 1540, requests: 5100 },
        { hour: '20:00', visits: 1100, requests: 3800 },
      ],
      topPages: [
        { path: '/terminal/pos-instant-charge', views: 12400, percentage: 38 },
        { path: '/reports/settlement-history', views: 8200, percentage: 25 },
        { path: '/dashboard/live-transactions', views: 7100, percentage: 22 },
        { path: '/api/v1/payments/process', views: 4700, percentage: 15 },
      ],
      deviceBreakdown: {
        mobile: 45,
        desktop: 52,
        tablet: 3,
      }
    }
  },
  {
    id: 'proj-003',
    clientId: 'cli-003',
    name: 'Retail Plus E-commerce Omnicanal',
    deliveryType: 'E-commerce',
    status: 'En Producción',
    liveUrl: 'https://tienda.retailplus.com.ve',
    description: 'Tienda virtual de alto tráfico con inventario sincronizado, pasarelas de pago y cálculo de envíos nacionales.',
    createdAt: '2025-12-05',
    targetLaunchDate: '2026-01-20',
    github: {
      repo: 'goolo-dev/retail-plus-ecommerce',
      branch: 'main',
      lastDeployStatus: 'building',
      lastDeployAt: '2026-08-14 08:30',
      commitHash: '9e41bc0',
      commitMessage: 'refactor: cart checkout flow and webhook response caching',
    },
    cloudflare: {
      zoneId: 'e49102c89f024982a17281bcde0192a0',
      domain: 'retailplus.com.ve',
      dnsStatus: 'Proxied',
      sslStatus: 'Full (Strict)',
      sslExpiresAt: '2027-01-10',
      ipAddress: '104.26.11.89',
    },
    supabase: {
      projectRef: 'retailplusstore01',
      projectUrl: 'https://retailplusstore01.supabase.co',
      anonApiKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJldGFpbHBsdXNzdG9yZTAxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM0MDU2MDAsImV4cCI6MjA0ODk4MTYwMH0.R9vL4p_retail_store_anon_sample_481920',
      serviceRoleKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJldGFpbHBsdXNzdG9yZTAxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMzQwNTYwMCwiZXhwIjoyMDQ4OTgxNjAwfQ.secret_retail_service_role_key_38472',
      plan: 'Pro',
      dbSizeMb: 420.8,
      storageSizeMb: 3800.0,
      status: 'Healthy',
    },
    siteApi: {
      isPaused: false,
      pauseReason: '',
      pauseWebhookUrl: 'https://tienda.retailplus.com.ve/api/maintenance/toggle',
      apiKey: 'goolo_live_rp_4418290312',
      healthStatus: 'operational',
      httpStatusCode: 200,
      latencyMs: 64,
      uptimePercentage: 99.92,
      lastHealthCheck: '2026-08-14 15:30:12',
      healthCheckEndpoint: 'https://tienda.retailplus.com.ve/api/health',
      sslDaysRemaining: 150,
      dbLatencyMs: 18,
      edgeCacheStatus: 'HIT',
      isFunctional: true,
      lastTestLog: 'Status 200 OK • Catálogo sincronizado (1,240 SKUs) • Stripe/Binance APIs: Online • Supabase DB: 18ms',
      analyticsApiUrl: 'https://tienda.retailplus.com.ve/api/traffic/live',
      liveActiveVisitors: 52,
      visitsToday: 4320,
      visitsThisWeek: 28900,
      visitsThisMonth: 118000,
      pageViewsToday: 19800,
      requestsPerMinute: 110,
      bandwidthMbToday: 910.4,
      avgResponseTimeMs: 70,
      errorRatePercent: 0.04,
      hourlyTraffic: [
        { hour: '00:00', visits: 80, requests: 280 },
        { hour: '04:00', visits: 30, requests: 110 },
        { hour: '08:00', visits: 320, requests: 1400 },
        { hour: '11:00', visits: 780, requests: 3600 },
        { hour: '13:00', visits: 920, requests: 4300 },
        { hour: '15:00', visits: 850, requests: 3900 },
        { hour: '18:00', visits: 740, requests: 3200 },
        { hour: '20:00', visits: 600, requests: 2600 },
      ],
      topPages: [
        { path: '/categoria/smartphones-y-audio', views: 7200, percentage: 36 },
        { path: '/producto/audifonos-wireless-pro', views: 4600, percentage: 23 },
        { path: '/carrito-de-compras', views: 4200, percentage: 21 },
        { path: '/checkout/pago-online', views: 3800, percentage: 20 },
      ],
      deviceBreakdown: {
        mobile: 82,
        desktop: 15,
        tablet: 3,
      }
    }
  },
  {
    id: 'proj-004',
    clientId: 'cli-004',
    name: 'Portal Pacientes & Citas San Gabriel',
    deliveryType: 'PWA',
    status: 'En Revisión',
    liveUrl: 'https://citas.clinicasangabriel.com',
    description: 'Sistema web progresivo para agendamiento de consultas por especialidad, recordatorios SMS y descarga de resultados.',
    createdAt: '2026-01-15',
    targetLaunchDate: '2026-03-01',
    github: {
      repo: 'goolo-dev/san-gabriel-portal',
      branch: 'staging',
      lastDeployStatus: 'success',
      lastDeployAt: '2026-08-13 16:45',
      commitHash: '2d5f81a',
      commitMessage: 'feat: add doctor schedule slot generator and PDF result encryptor',
    },
    cloudflare: {
      zoneId: '77a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2',
      domain: 'clinicasangabriel.com',
      dnsStatus: 'DNS Only',
      sslStatus: 'Flexible',
      sslExpiresAt: '2026-09-01',
      ipAddress: '198.51.100.42',
    },
    supabase: {
      projectRef: 'sangabrielhealth9',
      projectUrl: 'https://sangabrielhealth9.supabase.co',
      anonApiKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNhbmdhYnJpZWxoZWFsdGg5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY5NDAwMDAsImV4cCI6MjA1MjUxNjAwMH0.H7nK3w_sangabriel_anon_key_55192837',
      serviceRoleKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNhbmdhYnJpZWxoZWFsdGg5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNjk0MDAwMCwiZXhwIjoyMDUyNTE2MDAwfQ.secret_sangabriel_service_role_key_11209',
      plan: 'Pro',
      dbSizeMb: 85.0,
      storageSizeMb: 450.0,
      status: 'Healthy',
    },
    siteApi: {
      isPaused: true,
      pauseReason: 'Mantenimiento programado: Migración de agenda médica y actualización de slots de especialistas.',
      pausedAt: '2026-08-14 14:00',
      pauseWebhookUrl: 'https://citas.clinicasangabriel.com/api/system/maintenance',
      apiKey: 'goolo_live_sg_8829103948',
      healthStatus: 'maintenance',
      httpStatusCode: 503,
      latencyMs: 95,
      uptimePercentage: 99.80,
      lastHealthCheck: '2026-08-14 15:20:00',
      healthCheckEndpoint: 'https://citas.clinicasangabriel.com/api/health',
      sslDaysRemaining: 18,
      dbLatencyMs: 22,
      edgeCacheStatus: 'BYPASS',
      isFunctional: false,
      lastTestLog: 'Modo Mantenimiento 503 Activo • Retorno de pantalla de aviso a usuarios • Base de datos segura y en respaldo',
      analyticsApiUrl: 'https://citas.clinicasangabriel.com/api/stats',
      liveActiveVisitors: 4,
      visitsToday: 820,
      visitsThisWeek: 6400,
      visitsThisMonth: 28000,
      pageViewsToday: 1940,
      requestsPerMinute: 12,
      bandwidthMbToday: 110.2,
      avgResponseTimeMs: 95,
      errorRatePercent: 1.2,
      hourlyTraffic: [
        { hour: '00:00', visits: 10, requests: 35 },
        { hour: '04:00', visits: 5, requests: 15 },
        { hour: '08:00', visits: 190, requests: 620 },
        { hour: '11:00', visits: 240, requests: 810 },
        { hour: '13:00', visits: 180, requests: 590 },
        { hour: '15:00', visits: 110, requests: 310 },
        { hour: '18:00', visits: 50, requests: 140 },
        { hour: '20:00', visits: 35, requests: 90 },
      ],
      topPages: [
        { path: '/agendar-cita/medicina-general', views: 820, percentage: 42 },
        { path: '/resultados-laboratorio/login', views: 540, percentage: 28 },
        { path: '/especialidades/cardiologia', views: 350, percentage: 18 },
        { path: '/contacto-emergencias', views: 230, percentage: 12 },
      ],
      deviceBreakdown: {
        mobile: 65,
        desktop: 30,
        tablet: 5,
      }
    }
  },
  {
    id: 'proj-005',
    clientId: 'cli-005',
    name: 'Boutique Alma Catálogo & Lookbook',
    deliveryType: 'Landing Page',
    status: 'En Desarrollo',
    liveUrl: 'https://almamoda.com',
    description: 'Landing page visual de alta conversión con lookbook interactivo de temporada y redirección a WhatsApp comercial.',
    createdAt: '2026-02-05',
    targetLaunchDate: '2026-03-15',
    github: {
      repo: 'goolo-dev/alma-boutique-lookbook',
      branch: 'main',
      lastDeployStatus: 'queued',
      lastDeployAt: '2026-08-14 07:10',
      commitHash: '1c09da4',
      commitMessage: 'feat: setup video hero banner and interactive product cards',
    },
    cloudflare: {
      zoneId: '2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e',
      domain: 'almamoda.com',
      dnsStatus: 'Pending',
      sslStatus: 'Off',
      sslExpiresAt: '2026-08-25',
      ipAddress: '192.0.2.1',
    },
    supabase: {
      projectRef: 'almaboutiquedb',
      projectUrl: 'https://almaboutiquedb.supabase.co',
      anonApiKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFsbWFib3V0aXF1ZWRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg3NjE2MDAsImV4cCI6MjA1NDMzNzYwMH0.A2bC4d_alma_anon_key_9920192',
      serviceRoleKey: '',
      plan: 'Free',
      dbSizeMb: 12.4,
      storageSizeMb: 95.0,
      status: 'Healthy',
    },
    siteApi: {
      isPaused: false,
      pauseReason: '',
      pauseWebhookUrl: 'https://almamoda.com/api/pause',
      apiKey: 'goolo_live_am_1192837465',
      healthStatus: 'operational',
      httpStatusCode: 200,
      latencyMs: 52,
      uptimePercentage: 99.95,
      lastHealthCheck: '2026-08-14 15:28:40',
      healthCheckEndpoint: 'https://almamoda.com/api/health',
      sslDaysRemaining: 11,
      dbLatencyMs: 16,
      edgeCacheStatus: 'HIT',
      isFunctional: true,
      lastTestLog: 'Status 200 OK • Landing Page Optimizada WebP • Carga First Contentful Paint: 0.6s • WhatsApp CTA: Listo',
      analyticsApiUrl: 'https://almamoda.com/api/analytics',
      liveActiveVisitors: 18,
      visitsToday: 860,
      visitsThisWeek: 4900,
      visitsThisMonth: 18500,
      pageViewsToday: 2400,
      requestsPerMinute: 34,
      bandwidthMbToday: 180.5,
      avgResponseTimeMs: 55,
      errorRatePercent: 0.01,
      hourlyTraffic: [
        { hour: '00:00', visits: 15, requests: 40 },
        { hour: '04:00', visits: 8, requests: 22 },
        { hour: '08:00', visits: 60, requests: 180 },
        { hour: '11:00', visits: 160, requests: 480 },
        { hour: '13:00', visits: 210, requests: 620 },
        { hour: '15:00', visits: 180, requests: 510 },
        { hour: '18:00', visits: 130, requests: 390 },
        { hour: '20:00', visits: 97, requests: 280 },
      ],
      topPages: [
        { path: '/lookbook/coleccion-primavera', views: 1150, percentage: 48 },
        { path: '/catalogo/vestidos-de-noche', views: 680, percentage: 28 },
        { path: '/showroom-las-mercedes', views: 320, percentage: 14 },
        { path: '/contacto-whatsapp', views: 250, percentage: 10 },
      ],
      deviceBreakdown: {
        mobile: 89,
        desktop: 9,
        tablet: 2,
      }
    }
  }
];

export const initialFinanceRecords: FinanceRecord[] = [
  {
    id: 'fin-001',
    clientId: 'cli-001',
    projectId: 'proj-001',
    paymentType: 'subscription',
    currency: 'USD',
    monthlyAmount: 250,
    billingDay: 15,
    subscriptionStatus: 'Pendiente', // Billing day is 15th, today is 14th
    nextBillingDate: '2026-08-15',
    lastPaidDate: '2026-07-15',
    notes: 'Suscripción mensual de hosting Cloudflare, Supabase Pro y soporte técnico continuo.',
    paymentHistory: [
      {
        id: 'tx-101',
        date: '2026-07-15',
        amount: 250,
        method: 'Zelle',
        reference: 'ZLL-90812903',
        notes: 'Pago mensualidad Julio'
      },
      {
        id: 'tx-102',
        date: '2026-06-15',
        amount: 250,
        method: 'Zelle',
        reference: 'ZLL-81720194',
        notes: 'Pago mensualidad Junio'
      }
    ]
  },
  {
    id: 'fin-002',
    clientId: 'cli-002',
    projectId: 'proj-002',
    paymentType: 'subscription',
    currency: 'USD',
    monthlyAmount: 550,
    billingDay: 5,
    subscriptionStatus: 'Pagado',
    nextBillingDate: '2026-09-05',
    lastPaidDate: '2026-08-05',
    notes: 'SLA Empresarial 24/7 + Supabase Team Plan + Cloudflare WAF Dedicated Rules.',
    paymentHistory: [
      {
        id: 'tx-201',
        date: '2026-08-05',
        amount: 550,
        method: 'Transferencia',
        reference: 'TRF-US-9918230',
        notes: 'Pago mensualidad Agosto SLA'
      },
      {
        id: 'tx-202',
        date: '2026-07-05',
        amount: 550,
        method: 'Transferencia',
        reference: 'TRF-US-8819201',
        notes: 'Pago mensualidad Julio SLA'
      }
    ]
  },
  {
    id: 'fin-003',
    clientId: 'cli-003',
    projectId: 'proj-003',
    paymentType: 'subscription',
    currency: 'USD',
    monthlyAmount: 380,
    billingDay: 1,
    subscriptionStatus: 'En Mora', // Billing day was 1st, today is 14th -> 13 days overdue!
    nextBillingDate: '2026-08-01',
    lastPaidDate: '2026-06-30',
    notes: 'Mantenimiento mensual E-commerce y sincronización de base de datos de inventario. En mora desde el 01 de Agosto.',
    paymentHistory: [
      {
        id: 'tx-301',
        date: '2026-06-30',
        amount: 380,
        method: 'Crypto (USDT)',
        reference: 'TXID-0x9a8b7c6d5e4f3a2b',
        notes: 'Mensualidad Julio'
      }
    ]
  },
  {
    id: 'fin-004',
    clientId: 'cli-004',
    projectId: 'proj-004',
    paymentType: 'one_time',
    currency: 'USD',
    totalAmount: 3200,
    initialDeposit: 1600,
    remainingBalance: 1600,
    oneTimeStatus: 'Abono Parcial',
    billingDay: 20,
    nextBillingDate: '2026-08-20',
    lastPaidDate: '2026-01-15',
    notes: 'Desarrollo portal web médico. 50% abono inicial recibido, 50% contra entrega de fase beta / producción.',
    paymentHistory: [
      {
        id: 'tx-401',
        date: '2026-01-15',
        amount: 1600,
        method: 'Zelle',
        reference: 'ZLL-33019284',
        notes: 'Abono 50% inicio de proyecto'
      }
    ]
  },
  {
    id: 'fin-005',
    clientId: 'cli-005',
    projectId: 'proj-005',
    paymentType: 'one_time',
    currency: 'USD',
    totalAmount: 1400,
    initialDeposit: 700,
    remainingBalance: 700,
    oneTimeStatus: 'Abono Parcial',
    billingDay: 28,
    nextBillingDate: '2026-08-28',
    lastPaidDate: '2026-02-05',
    notes: 'Landing Page + Lookbook. Pendiente saldo final al publicar dominio definitivo.',
    paymentHistory: [
      {
        id: 'tx-501',
        date: '2026-02-05',
        amount: 700,
        method: 'Pago Móvil',
        reference: 'PM-49102830',
        notes: 'Abono inicial 50%'
      }
    ]
  }
];

export const initialMaintenanceReviews: MaintenanceReview[] = [
  {
    id: 'rev-001',
    projectId: 'proj-001',
    clientId: 'cli-001',
    title: 'Auditoría Trimestral de Infraestructura Caracas Gourmet',
    intervalDays: 90,
    lastReviewDate: '2026-05-15',
    nextReviewDate: '2026-08-15', // Due tomorrow!
    status: 'Revisión Pendiente',
    auditorName: 'Senior DevOps / Tech Lead',
    notes: 'Verificar cuota de almacenamiento de imágenes en Supabase Storage y optimizar caché en Cloudflare para móviles.',
    tasks: [
      {
        id: 't-1',
        title: 'Supabase: Revisar logs de base de datos y tamaño de tablas de pedidos',
        category: 'supabase',
        completed: true,
        status: 'completed',
        priority: 'high',
        assignedTo: 'Carlos M. (DevOps)',
        estimatedHours: 2,
        description: 'Limpiar logs antiguos de webhooks y ejecutar VACUUM.'
      },
      {
        id: 't-2',
        title: 'Supabase: Auditar políticas RLS en tabla de órdenes y clientes',
        category: 'supabase',
        completed: false,
        status: 'in_progress',
        priority: 'critical',
        assignedTo: 'Valeria R. (Security)',
        estimatedHours: 3,
        description: 'Asegurar que los tokens de anon no puedan leer teléfonos de clientes.'
      },
      {
        id: 't-3',
        title: 'Cloudflare: Verificar estado de certificado SSL y reglas de Edge Cache',
        category: 'cloudflare',
        completed: false,
        status: 'todo',
        priority: 'medium',
        assignedTo: 'Carlos M. (DevOps)',
        estimatedHours: 1,
        description: 'Comprobar que el modo Full Strict siga activo y las imágenes tengan Cache-Control 30d.'
      },
      {
        id: 't-4',
        title: 'GitHub: Chequear alertas de seguridad Dependabot y actualizar packages',
        category: 'github',
        completed: false,
        status: 'todo',
        priority: 'high',
        assignedTo: 'Andrés P. (FullStack)',
        estimatedHours: 2,
        description: 'Actualizar dependencias de Vite y Node.js.'
      }
    ]
  },
  {
    id: 'rev-002',
    projectId: 'proj-002',
    clientId: 'cli-002',
    title: 'Revisión Mensual de Seguridad y Performance NovaPay',
    intervalDays: 30,
    lastReviewDate: '2026-07-20',
    nextReviewDate: '2026-08-20',
    status: 'Al Día',
    auditorName: 'Lead Security Engineer',
    notes: 'Revisión de compliance mensual. Monitorear índices en transacciones financieras y rate limiting en Cloudflare.',
    tasks: [
      {
        id: 't-21',
        title: 'Cloudflare: Validar WAF rules contra bots y ataques DDoS',
        category: 'cloudflare',
        completed: true,
        status: 'completed',
        priority: 'critical',
        assignedTo: 'Valeria R. (Security)',
        estimatedHours: 4,
        description: 'Tasa de bloqueo de bots maliciosos al 99.8%.'
      },
      {
        id: 't-22',
        title: 'Supabase: Chequeo de conexiones en pool (pgBouncer)',
        category: 'supabase',
        completed: true,
        status: 'completed',
        priority: 'high',
        assignedTo: 'Carlos M. (DevOps)',
        estimatedHours: 2,
        description: 'Pool saludable con menos del 30% de uso pico.'
      },
      {
        id: 't-23',
        title: 'GitHub: Auditoría de ramas protegidas y secrets rotation',
        category: 'github',
        completed: true,
        status: 'completed',
        priority: 'high',
        assignedTo: 'Valeria R. (Security)',
        estimatedHours: 1,
        description: 'Service keys rotadas en el último sprint.'
      }
    ]
  },
  {
    id: 'rev-003',
    projectId: 'proj-003',
    clientId: 'cli-003',
    title: 'Auditoría Bimestral E-commerce Retail Plus',
    intervalDays: 60,
    lastReviewDate: '2026-06-01',
    nextReviewDate: '2026-08-01', // Overdue by 13 days
    status: 'Vencida',
    auditorName: 'DevOps Specialist',
    notes: 'Revisión vencida. Urge revisar optimización de imágenes en Supabase Storage (se está acercando al límite de 4GB) y verificar webhook de Stripe.',
    tasks: [
      {
        id: 't-31',
        title: 'Supabase: Optimizar bucket de imágenes de productos',
        category: 'supabase',
        completed: false,
        status: 'in_progress',
        priority: 'critical',
        assignedTo: 'Carlos M. (DevOps)',
        estimatedHours: 3,
        description: 'Comprimir imágenes WebP de más de 2MB.'
      },
      {
        id: 't-32',
        title: 'Cloudflare: Purgar caché de catálogo tras actualización de precios',
        category: 'cloudflare',
        completed: false,
        status: 'todo',
        priority: 'medium',
        assignedTo: 'Andrés P. (FullStack)',
        estimatedHours: 1,
        description: 'Verificar TTL de 1 hora para endpoints de catálogo.'
      },
      {
        id: 't-33',
        title: 'GitHub: Ejecutar npm audit fix y test de regresión',
        category: 'github',
        completed: false,
        status: 'todo',
        priority: 'high',
        assignedTo: 'Andrés P. (FullStack)',
        estimatedHours: 2,
        description: 'Resolver 2 vulnerabilidades moderadas en sub-dependencias.'
      }
    ]
  },
  {
    id: 'rev-004',
    projectId: 'proj-004',
    clientId: 'cli-004',
    title: 'Auditoría Pre-Lanzamiento San Gabriel',
    intervalDays: 30,
    lastReviewDate: '2026-08-01',
    nextReviewDate: '2026-09-01',
    status: 'Al Día',
    auditorName: 'Frontend & QA Lead',
    notes: 'Preparación para el despliegue a producción en Septiembre.',
    tasks: [
      {
        id: 't-41',
        title: 'Cloudflare: Cambiar modo DNS Only a Proxied y activar SSL Full (Strict)',
        category: 'cloudflare',
        completed: false,
        status: 'in_progress',
        priority: 'critical',
        assignedTo: 'Carlos M. (DevOps)',
        estimatedHours: 2,
        description: 'Activar proxy para ocultar la IP de origen del servidor.'
      },
      {
        id: 't-42',
        title: 'Supabase: Configurar políticas RLS para registros médicos',
        category: 'supabase',
        completed: true,
        status: 'completed',
        priority: 'critical',
        assignedTo: 'Valeria R. (Security)',
        estimatedHours: 4,
        description: 'Solo médicos autenticados pueden ver historias clínicas asignadas.'
      },
      {
        id: 't-43',
        title: 'GitHub: Configurar GitHub Actions para CI/CD automatizado',
        category: 'github',
        completed: true,
        status: 'completed',
        priority: 'medium',
        assignedTo: 'Andrés P. (FullStack)',
        estimatedHours: 3,
        description: 'Pipeline de tests unitarios y build automático configurado.'
      }
    ]
  }
];

export const initialProjectNotes: ProjectNote[] = [
  {
    id: 'note-001',
    projectId: 'proj-001',
    title: 'Minuta de Kickoff & Alcance Caracas Gourmet',
    category: 'minuta',
    updatedAt: '2026-08-10',
    markdownContent: `### Minuta de Reunión: Grupo Gastronómico Caracas Gourmet
**Fecha:** 10 de Agosto de 2026  
**Participantes:** Lic. Alejandro Mendoza (Cliente), Lead Dev (Goolo System)  

#### Acuerdos Clave:
1. **Sincronización de Precios:** Los precios en el menú digital PWA deben actualizarse en tiempo real usando Supabase Realtime Channels.
2. **Impresión Térmica:** La comanda enviada a cocina debe poder imprimirse en formato 80mm vía Bluetooth o webhook.
3. **Dominio Definitivo:** Se configuró el subdominio \`menu.caracasgourmet.com\` sobre Cloudflare con DNS Proxied y SSL Full Strict.

#### Próximos Pasos:
- [x] Crear bucket de fotos de platillos en Supabase Storage
- [ ] Capacitar a los gerentes de sala en el panel administrativo
- [ ] Entregar código QR de mesas en alta resolución vectorial`
  },
  {
    id: 'note-002',
    projectId: 'proj-001',
    title: 'Variables de Entorno & Configuración .env',
    category: 'env_vars',
    updatedAt: '2026-08-11',
    markdownContent: `### Variables de Entorno de Producción
\`\`\`env
# Supabase Production Config
VITE_SUPABASE_URL="https://abxvyuqwezptl.supabase.co"
VITE_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFieHZ5dXF3ZXpwdGwiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTczMTY3MjAwMCwiZXhwIjoyMDQ3MjQ4MDAwfQ.9k8q7W_sample_key_caracas_gourmet_anon_92736152"

# Cloudflare Zone & Domain
CLOUDFLARE_ZONE_ID="8f4a9b2c3d4e5f6a7b8c9d0e1f2a3b4c"
APP_DOMAIN="menu.caracasgourmet.com"

# WhatsApp Business API Direct Webhook
VITE_WHATSAPP_NUMBER="584128912345"
VITE_WHATSAPP_ORDER_PREFIX="¡Hola Caracas Gourmet! Deseo ordenar:"
\`\`\``
  },
  {
    id: 'note-003',
    projectId: 'proj-001',
    title: 'Pre-launch Checklist (Control de Calidad)',
    category: 'pre_launch',
    updatedAt: '2026-08-12',
    checklist: [
      { id: 'c-1', text: 'Favicon y meta tags OpenGraph / Twitter Cards configurados', checked: true, category: 'SEO & Indexing' },
      { id: 'c-2', text: 'Supabase RLS activado en todas las tablas sensibles', checked: true, category: 'Security & Keys' },
      { id: 'c-3', text: 'Cloudflare SSL en modo Full (Strict) con HSTS activo', checked: true, category: 'DNS & SSL' },
      { id: 'c-4', text: 'Formularios y botón WhatsApp testeados en iOS y Android', checked: true, category: 'Forms & Webhooks' },
      { id: 'c-5', text: 'Página de error 404 personalizada y amigable', checked: true, category: 'Performance & Assets' },
      { id: 'c-6', text: 'Compresión WebP y Lazy Loading en imágenes de platillos', checked: false, category: 'Performance & Assets' },
      { id: 'c-7', text: 'Auditoría Lighthouse con puntaje > 90 en Performance y SEO', checked: false, category: 'Performance & Assets' }
    ],
    markdownContent: `### Pre-launch Checklist
Utiliza esta lista de verificación antes de declarar un proyecto como 'Listo para Producción'. Cada elemento marcado asegura la estabilidad y seguridad de la aplicación.`
  },
  {
    id: 'note-004',
    projectId: 'proj-002',
    title: 'Credenciales & Accesos Secundarios NovaPay',
    category: 'credenciales',
    updatedAt: '2026-08-05',
    markdownContent: `### Credenciales de Servicios Secundarios
> **Nota de Seguridad:** Estas credenciales están protegidas y reservadas únicamente para el equipo core de Goolo System.

| Servicio | Usuario / Identificador | Rol / Acceso | Estado |
| :--- | :--- | :--- | :--- |
| **Cloudflare** | \`admin@novapay.io\` | DNS & WAF Admin | Activo |
| **Supabase** | \`org-novapay-dev\` | Owner / Team Plan | Activo |
| **GitHub** | \`goolo-dev/novapay-merchant-portal\` | Private Repo (Main Protected) | Activo |
| **Resend (Email)** | \`api_key_novapay_trans_prod_7781\` | Envíos transaccionales | Activo |
| **Sentry (Logs)** | \`dsn_novapay_frontend_error_log\` | Monitoreo de errores | Activo |`
  },
  {
    id: 'note-005',
    projectId: 'proj-003',
    title: 'Arquitectura & Flujo de Pagos Retail Plus',
    category: 'arquitectura',
    updatedAt: '2026-08-01',
    markdownContent: `### Diagrama de Arquitectura Retail Plus E-commerce

\`\`\`
[ Cliente Móvil / Web ]
       │
       ▼
[ Cloudflare CDN + WAF (SSL Full Strict) ]
       │
       ▼
[ Frontend React / Vite en Edge Hosting ]
       │
       ├──► [ Supabase PostgreSQL (Catálogo & Auth) ]
       ├──► [ Supabase Storage (Fotos de Productos) ]
       └──► [ Webhook Serverless (Stripe & Binance Pay) ]
\`\`\`

#### Reglas de Negocio:
- Las compras confirmadas emiten un evento en Supabase Realtime que decrementa el stock de la sucursal asignada.
- Si el cliente no completa el pago en 15 minutos, la reserva de inventario expira automáticamente.`
  }
];

export const initialNotifications: NotificationItem[] = [
  {
    id: 'notif-001',
    title: 'Cliente en Mora: Inversiones Retail Plus',
    description: 'La mensualidad de $380 USD del 01 de Agosto presenta 13 días de atraso.',
    type: 'mora',
    timestamp: 'Hace 2 horas',
    read: false,
    linkModule: 'finance',
    referenceId: 'fin-003'
  },
  {
    id: 'notif-002',
    title: 'Revisión Técnica Próxima a Vencer: Caracas Gourmet',
    description: 'La auditoría trimestral de infraestructura Supabase y Cloudflare vence mañana.',
    type: 'review_pending',
    timestamp: 'Hace 4 horas',
    read: false,
    linkModule: 'maintenance',
    referenceId: 'rev-001'
  },
  {
    id: 'notif-003',
    title: 'Alerta SSL Cloudflare: Boutique Alma',
    description: 'El dominio almamoda.com tiene el certificado SSL en estado Desactivado.',
    type: 'ssl_warning',
    timestamp: 'Ayer a las 18:30',
    read: false,
    linkModule: 'projects',
    referenceId: 'proj-005'
  },
  {
    id: 'notif-004',
    title: 'Pago Recibido: NovaPay Solutions',
    description: 'Se registró con éxito el pago mensual SLA de $550 USD vía Transferencia.',
    type: 'payment_received',
    timestamp: 'Hace 3 días',
    read: true,
    linkModule: 'finance',
    referenceId: 'fin-002'
  }
];

export const initialProjectActivities: ProjectActivity[] = [
  // Caracas Gourmet (proj-001)
  {
    id: 'act-001',
    projectId: 'proj-001',
    type: 'deployment',
    title: 'Deploy Producción v2.4.1',
    description: 'Actualización de modificadores de precios de menú y carta de postres de temporada.',
    timestamp: '2026-08-14 14:23',
    severity: 'success',
    author: 'Carlos M. (DevOps)',
    metadata: {
      commitHash: '7f9c2a1',
      commitMessage: 'feat: update menu price modifiers and seasonal dessert list',
      branch: 'main',
      deployDurationSec: 38,
      deployStatus: 'success',
      environment: 'production',
      rollbackAvailable: true,
      deployLogs: [
        'Running build script (vite build)...',
        'Built 48 client bundles in 3.4s',
        'Deploying static assets to Cloudflare Edge Network...',
        'Edge cache purged for /menu/*',
        'Health check passed: HTTP 200 (42ms latency)'
      ]
    }
  },
  {
    id: 'act-002',
    projectId: 'proj-001',
    type: 'config_change',
    title: 'Regla de Edge Caching Optimizada',
    description: 'Se modificó el TTL de caché para imágenes de platos en Cloudflare Rules.',
    timestamp: '2026-08-13 16:45',
    severity: 'info',
    author: 'Andrés P. (FullStack)',
    metadata: {
      category: 'cloudflare',
      changedField: 'Edge Cache-Control TTL',
      previousValue: '1 hour (3600s)',
      newValue: '30 days (2592000s)'
    }
  },
  {
    id: 'act-003',
    projectId: 'proj-001',
    type: 'system_alert',
    title: 'Pico de Tráfico en Almuerzo: Latencia Normalizada',
    description: 'Se detectaron 380 visitas simultáneas a las 13:00. Servidor edge respondió en 48ms.',
    timestamp: '2026-08-13 13:15',
    severity: 'info',
    author: 'Sistema de Telemetría',
    metadata: {
      metricName: 'Visitas Pico / Latencia Edge',
      metricValue: '380 concurrentes / 48ms',
      threshold: '500 max / 200ms',
      resolved: true,
      resolvedAt: '2026-08-13 14:00'
    }
  },
  {
    id: 'act-004',
    projectId: 'proj-001',
    type: 'deployment',
    title: 'Hotfix v2.4.0 (3e8a1f9)',
    description: 'Corrección en formateo internacional de números de teléfono para pedidos por WhatsApp.',
    timestamp: '2026-08-10 11:10',
    severity: 'success',
    author: 'Valeria R. (Security)',
    metadata: {
      commitHash: '3e8a1f9',
      commitMessage: 'fix: sanitize E.164 phone formatting for WhatsApp direct order checkout',
      branch: 'main',
      deployDurationSec: 32,
      deployStatus: 'success',
      environment: 'production',
      rollbackAvailable: true,
      deployLogs: [
        'Vite build completed (0 warnings)',
        'Deployed to Cloudflare Pages edge containers',
        'Integration tests for checkout flow passed 14/14'
      ]
    }
  },
  {
    id: 'act-005',
    projectId: 'proj-001',
    type: 'config_change',
    title: 'Políticas RLS en Supabase Reforzadas',
    description: 'Se aplicó política RLS restrictiva en tabla "orders" para prevenir lectura pública anónima.',
    timestamp: '2026-08-08 09:30',
    severity: 'success',
    author: 'Valeria R. (Security)',
    metadata: {
      category: 'supabase',
      changedField: 'RLS Policies: orders_select',
      previousValue: 'auth.role() = anon (permissive)',
      newValue: 'auth.jwt()->>role = branch_manager OR is_service_role'
    }
  },

  // NovaPay Solutions (proj-002)
  {
    id: 'act-006',
    projectId: 'proj-002',
    type: 'deployment',
    title: 'Release Producción v3.1.0 (4d8e2b9)',
    description: 'Integración del nuevo gateway multi-adquirente y panel de liquidaciones B2B.',
    timestamp: '2026-08-14 10:50',
    severity: 'success',
    author: 'GitHub Actions CI',
    metadata: {
      commitHash: '4d8e2b9',
      commitMessage: 'feat: add multi-acquirer settlement reconciliation pipeline',
      branch: 'main',
      deployDurationSec: 54,
      deployStatus: 'success',
      environment: 'production',
      rollbackAvailable: true,
      deployLogs: [
        'Running Jest unit & integration tests... 112 passed',
        'Building TypeScript micro-frontend container...',
        'Pushing to edge CDN with atomic swap...',
        'Verification healthcheck HTTP 200 OK (22ms)'
      ]
    }
  },
  {
    id: 'act-007',
    projectId: 'proj-002',
    type: 'system_alert',
    title: 'WAF Rate Limit: Ataque de Fuerza Bruta Bloqueado',
    description: 'Cloudflare WAF mitigó 142 solicitudes repetitivas contra el endpoint /api/v1/auth/token.',
    timestamp: '2026-08-13 22:40',
    severity: 'warning',
    author: 'Cloudflare Security WAF',
    metadata: {
      metricName: 'Bloqueos WAF / IP Challenge',
      metricValue: '142 requests/min',
      threshold: '20 requests/min',
      resolved: true,
      resolvedAt: '2026-08-13 22:55'
    }
  },
  {
    id: 'act-008',
    projectId: 'proj-002',
    type: 'config_change',
    title: 'Pool de Conexiones Supabase (pgBouncer) Ampliado',
    description: 'Se aumentó la cuota de conexiones simultáneas para absorber transacciones concurrentes.',
    timestamp: '2026-08-12 15:20',
    severity: 'info',
    author: 'Carlos M. (DevOps)',
    metadata: {
      category: 'supabase',
      changedField: 'pgBouncer max_client_conn',
      previousValue: '20 poolers',
      newValue: '50 poolers'
    }
  },
  {
    id: 'act-009',
    projectId: 'proj-002',
    type: 'config_change',
    title: 'Rotación de Service Role Keys para Webhooks',
    description: 'Rotación preventiva programada de llaves criptográficas para webhooks de bancos.',
    timestamp: '2026-08-05 18:00',
    severity: 'info',
    author: 'Valeria R. (Security)',
    metadata: {
      category: 'security',
      changedField: 'Service Role Key Token',
      previousValue: 'eyJhbGciOi...[Rotated]',
      newValue: 'eyJhbGciOi...[Active-v3]'
    }
  },

  // Retail Plus (proj-003)
  {
    id: 'act-010',
    projectId: 'proj-003',
    type: 'deployment',
    title: 'Deploy Producción v1.8.2 (8a1c9e4)',
    description: 'Optimización de renderizado y lazy-loading para catálogo masivo de 1,200 SKUs.',
    timestamp: '2026-08-14 08:30',
    severity: 'success',
    author: 'Andrés P. (FullStack)',
    metadata: {
      commitHash: '8a1c9e4',
      commitMessage: 'perf: implement virtualized product grid and webp image presets',
      branch: 'main',
      deployDurationSec: 42,
      deployStatus: 'success',
      environment: 'production',
      rollbackAvailable: true,
      deployLogs: [
        'Vite build: 62 chunks generated',
        'Image lazy-loader validated',
        'Deployed to Cloudflare edge CDN'
      ]
    }
  },
  {
    id: 'act-011',
    projectId: 'proj-003',
    type: 'system_alert',
    title: 'Alerta de Almacenamiento Supabase: 85% de Cuota',
    description: 'El bucket de imágenes de productos ha alcanzado 1.85 GB de los 2.0 GB asignados en plan Pro.',
    timestamp: '2026-08-13 17:10',
    severity: 'warning',
    author: 'Supabase Storage Monitor',
    metadata: {
      metricName: 'Supabase Storage Bucket Size',
      metricValue: '1.85 GB (85%)',
      threshold: '1.70 GB (80%)',
      resolved: false
    }
  },
  {
    id: 'act-012',
    projectId: 'proj-003',
    type: 'config_change',
    title: 'Purga Global de Caché Cloudflare',
    description: 'Purga total de caché de endpoints de precios tras importación de inventario mayorista.',
    timestamp: '2026-08-11 19:40',
    severity: 'info',
    author: 'Andrés P. (FullStack)',
    metadata: {
      category: 'cloudflare',
      changedField: 'Zone Cache Purge',
      previousValue: 'Cached tags: store_catalog',
      newValue: 'Purged everything (Instant Edge Invalidation)'
    }
  },

  // Clínica San Gabriel (proj-004)
  {
    id: 'act-013',
    projectId: 'proj-004',
    type: 'deployment',
    title: 'Deploy Producción v2.0.4 (1f5d8e9)',
    description: 'Módulo de teleconsulta médica y agenda de citas sincronizada con historias clínicas.',
    timestamp: '2026-08-12 14:15',
    severity: 'success',
    author: 'Andrés P. (FullStack)',
    metadata: {
      commitHash: '1f5d8e9',
      commitMessage: 'feat: add telehealth appointment scheduler and physician calendar sync',
      branch: 'main',
      deployDurationSec: 61,
      deployStatus: 'success',
      environment: 'production',
      rollbackAvailable: true,
      deployLogs: [
        'Building medical portal frontend & doctor dashboard...',
        'Zero-trust encryption checks passed',
        'Deployed successfully to Cloudflare edge container'
      ]
    }
  },
  {
    id: 'act-014',
    projectId: 'proj-004',
    type: 'config_change',
    title: 'Políticas RLS para Historias Médicas (HIPAA)',
    description: 'Políticas RLS en Supabase Postgres configuradas para restringir acceso exclusivo por médico tratante.',
    timestamp: '2026-08-09 11:30',
    severity: 'success',
    author: 'Valeria R. (Security)',
    metadata: {
      category: 'supabase',
      changedField: 'RLS Policy: patient_records',
      previousValue: 'auth.uid() = patient_id',
      newValue: 'auth.uid() = patient_id OR auth.uid() IN (SELECT doctor_id FROM appointments WHERE patient_id = record.id)'
    }
  },
  {
    id: 'act-015',
    projectId: 'proj-004',
    type: 'system_alert',
    title: 'Healthcheck 200 OK: 99.99% Uptime Mensual',
    description: 'Monitoreo sintético completado. Latencia de base de datos en 14ms sin micro-cortes en 30 días.',
    timestamp: '2026-08-08 00:00',
    severity: 'success',
    author: 'Synthetic Health Monitor',
    metadata: {
      metricName: 'Uptime mensual / Latencia DB',
      metricValue: '99.99% / 14ms',
      threshold: '99.50% / 100ms',
      resolved: true,
      resolvedAt: '2026-08-08 00:00'
    }
  },

  // Boutique Alma (proj-005)
  {
    id: 'act-016',
    projectId: 'proj-005',
    type: 'system_alert',
    title: 'Alerta Crítica: Certificado SSL Desactivado',
    description: 'El dominio almamoda.com fue detectado en modo DNS Only sin certificado SSL activo.',
    timestamp: '2026-08-14 11:20',
    severity: 'critical',
    author: 'Cloudflare Edge Monitor',
    metadata: {
      metricName: 'SSL Status',
      metricValue: 'Off / DNS Only',
      threshold: 'Full (Strict) / Proxied',
      resolved: false
    }
  },
  {
    id: 'act-017',
    projectId: 'proj-005',
    type: 'config_change',
    title: 'Activación de Proxy Cloudflare & SSL Full (Strict)',
    description: 'Se configuró el proxy DNS de Cloudflare (Orange Cloud) para habilitar cifrado TLS 1.3.',
    timestamp: '2026-08-14 12:00',
    severity: 'success',
    author: 'Carlos M. (DevOps)',
    metadata: {
      category: 'cloudflare',
      changedField: 'DNS Proxy & SSL Mode',
      previousValue: 'DNS Only (Grey Cloud) / Off',
      newValue: 'Proxied (Orange Cloud) / Full (Strict)'
    }
  },
  {
    id: 'act-018',
    projectId: 'proj-005',
    type: 'deployment',
    title: 'Deploy Staging Preview v0.9.1 (2c8d1e3)',
    description: 'Catálogo preliminar interactivo para pruebas de WhatsApp Checkout con el cliente.',
    timestamp: '2026-08-11 16:30',
    severity: 'success',
    author: 'Andrés P. (FullStack)',
    metadata: {
      commitHash: '2c8d1e3',
      commitMessage: 'feat: preview build for boutique lookbook and cart drawer',
      branch: 'staging',
      deployDurationSec: 29,
      deployStatus: 'success',
      environment: 'staging',
      rollbackAvailable: false,
      deployLogs: [
        'Staging build ready',
        'Published to preview-almamoda.pages.dev',
        'Ready for client review'
      ]
    }
  }
];

// ==========================================
// HIGH-SECURITY ARMORED AUTH & USERS SYSTEM
// ==========================================

export const initialUsers: UserAccount[] = [
  {
    id: 'usr-kecho-00',
    name: 'Kecho',
    email: 'kecho8a@gmail.com',
    role: 'Super Admin',
    avatar: 'bg-gradient-to-br from-blue-500 to-purple-600',
    passwordHash: 'kecho.180',
    twoFactorEnabled: false,
    twoFactorSecret: '',
    twoFactorBackupCodes: [],
    lastLogin: new Date().toISOString().replace('T', ' ').slice(0, 16),
    lastLoginIp: '190.202.84.1',
    lastLoginDevice: 'Sistema Principal',
    securityLevel: 'Máxima (Blindada)',
    failedAttempts: 0,
    lockedUntil: null,
    pinCode: '2026',
    createdAt: '2026-08-14'
  },
  {
    id: 'usr-admin-01',
    name: 'Carlos Mendoza',
    email: 'admin@goolo.agency',
    role: 'Super Admin',
    avatar: 'bg-slate-900',
    // Plaintext default for evaluation: AdminPass#2026!
    passwordHash: 'AdminPass#2026!',
    twoFactorEnabled: true,
    twoFactorSecret: 'JBSWY3DPEHPK3PXP',
    twoFactorBackupCodes: ['8F39-A104', '7B22-C991', '4X11-M820', '9P44-T519', '3K77-Z012', '5N88-Q334'],
    lastLogin: '2026-08-14 15:42',
    lastLoginIp: '190.202.84.112',
    lastLoginDevice: 'macOS Sequoia 15.1 • Chrome 128 (Caracas, VE)',
    securityLevel: 'Máxima (Blindada)',
    failedAttempts: 0,
    lockedUntil: null,
    pinCode: '2026',
    createdAt: '2025-01-10'
  },
  {
    id: 'usr-devops-02',
    name: 'Alejandro Tech',
    email: 'devops@goolo.agency',
    role: 'Lead DevOps',
    avatar: 'bg-blue-600',
    // Plaintext default for evaluation: DevOpsPass#2026!
    passwordHash: 'DevOpsPass#2026!',
    twoFactorEnabled: true,
    twoFactorSecret: 'HXDMVJECJJWSRZ3U',
    twoFactorBackupCodes: ['1A2B-3C4D', '5E6F-7G8H', '9I0J-1K2L'],
    lastLogin: '2026-08-14 14:10',
    lastLoginIp: '186.185.120.45',
    lastLoginDevice: 'Ubuntu Linux 24.04 • Firefox 129 (Edge Cloud)',
    securityLevel: 'Máxima (Blindada)',
    failedAttempts: 0,
    lockedUntil: null,
    pinCode: '1337',
    createdAt: '2025-02-15'
  },
  {
    id: 'usr-finance-03',
    name: 'Mariana Valenzuela',
    email: 'finance@goolo.agency',
    role: 'Director Financiero',
    avatar: 'bg-emerald-600',
    // Plaintext default for evaluation: FinancePass#2026!
    passwordHash: 'FinancePass#2026!',
    twoFactorEnabled: false,
    twoFactorSecret: 'GAXTMOBRHE2TAOJR',
    twoFactorBackupCodes: ['9Z8Y-7X6W', '5V4U-3T2S'],
    lastLogin: '2026-08-14 12:30',
    lastLoginIp: '200.74.195.88',
    lastLoginDevice: 'Windows 11 Pro • Brave 1.68 (Caracas, VE)',
    securityLevel: 'Alta (2FA Activo)',
    failedAttempts: 0,
    lockedUntil: null,
    pinCode: '7788',
    createdAt: '2025-03-01'
  }
];

export const initialAuthAuditLogs: AuthAuditLog[] = [
  {
    id: 'log-sec-01',
    timestamp: '2026-08-14 15:42:18',
    userEmail: 'admin@goolo.agency',
    userName: 'Carlos Mendoza',
    eventType: '2fa_success',
    ip: '190.202.84.112',
    location: 'Caracas, VE (CANTV High-Speed)',
    device: 'macOS Sequoia 15.1 • Chrome 128',
    status: 'success',
    details: 'Autenticación TOTP 6 dígitos validada satisfactoriamente con TLS 1.3'
  },
  {
    id: 'log-sec-02',
    timestamp: '2026-08-14 15:42:01',
    userEmail: 'admin@goolo.agency',
    userName: 'Carlos Mendoza',
    eventType: 'login_success',
    ip: '190.202.84.112',
    location: 'Caracas, VE (CANTV High-Speed)',
    device: 'macOS Sequoia 15.1 • Chrome 128',
    status: 'success',
    details: 'Master Password verificado con hash criptográfico'
  },
  {
    id: 'log-sec-03',
    timestamp: '2026-08-14 14:10:05',
    userEmail: 'devops@goolo.agency',
    userName: 'Alejandro Tech',
    eventType: 'passkey_login',
    ip: '186.185.120.45',
    location: 'Cloudflare Zero Trust Edge (San Antonio)',
    device: 'Ubuntu Linux 24.04 • FIDO2 WebAuthn Hardware Key',
    status: 'success',
    details: 'Acceso instantáneo mediante llave biométrica FIDO2 / Passkey'
  },
  {
    id: 'log-sec-04',
    timestamp: '2026-08-14 13:02:44',
    userEmail: 'unauthorized_probe@crawler.bot',
    userName: 'Desconocido',
    eventType: 'login_failed',
    ip: '45.142.214.99',
    location: 'Frankfurt, DE (Tor Exit Node / VPN)',
    device: 'Python-urllib/3.11 Automated Scanner',
    status: 'blocked',
    details: 'Intento de fuerza bruta interceptado y bloqueado por Rate Limiting'
  },
  {
    id: 'log-sec-05',
    timestamp: '2026-08-14 12:30:12',
    userEmail: 'finance@goolo.agency',
    userName: 'Mariana Valenzuela',
    eventType: 'login_success',
    ip: '200.74.195.88',
    location: 'Caracas, VE (NetUno Fiber)',
    device: 'Windows 11 Pro • Brave 1.68',
    status: 'success',
    details: 'Inicio de sesión de conciliación de pagos y facturación'
  },
  {
    id: 'log-sec-06',
    timestamp: '2026-08-14 09:15:30',
    userEmail: 'admin@goolo.agency',
    userName: 'Carlos Mendoza',
    eventType: 'session_locked',
    ip: '190.202.84.112',
    location: 'Caracas, VE',
    device: 'macOS Sequoia 15.1',
    status: 'success',
    details: 'Bloqueo automático de terminal por inactividad de 15 minutos'
  }
];

export const defaultSecuritySettings: SecuritySettings = {
  autoLockMinutes: 15,
  require2FAForSensitiveActions: true,
  maxFailedAttemptsBeforeLock: 3,
  lockoutDurationSeconds: 30,
  enforceStrongPasswordEntropy: true,
  notifyOnNewDeviceLogin: true,
  allowBiometricPasskeys: true
};


