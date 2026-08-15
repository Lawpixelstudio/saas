import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { UserAccount, AuthAuditLog } from '../types';
import { initialUsers, initialAuthAuditLogs } from '../data/mockData';

interface AuthContextType {
  isAuthenticated: boolean;
  currentUser: UserAccount | null;
  login: (email: string, password: string) => Promise<LoginResult>;
  logout: () => void;
  isLocked: boolean;
  lockoutTimeRemaining: number;
  failedAttempts: number;
  addAuditLog: (log: Omit<AuthAuditLog, 'id' | 'timestamp'>) => void;
  auditLogs: AuthAuditLog[];
  lastActivity: number;
  resetInactivityTimer: () => void;
}

interface LoginResult {
  success: boolean;
  error?: string;
  requiresPin?: boolean;
  userId?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'goolo_auth_session_v1';
const AUDIT_STORAGE_KEY = 'goolo_audit_logs_v1';
const USERS_STORAGE_KEY = 'goolo_users_v1';
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 30000; // 30 seconds
const SESSION_DURATION_MS = 4 * 60 * 60 * 1000; // 4 hours
const INACTIVITY_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes

// Simple hash function for demo (in production use bcrypt on server)
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + 'goolo_salt_2026');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Generate CSRF token
function generateCSRFToken(): string {
  return crypto.randomUUID();
}

// Sanitize input to prevent XSS
function sanitizeInput(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

// Validate email format
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Get device info
function getDeviceInfo(): string {
  const ua = navigator.userAgent;
  const platform = navigator.platform || 'Unknown';
  const lang = navigator.language || 'es';
  
  let browser = 'Unknown';
  if (ua.includes('Chrome') && !ua.includes('Edg')) browser = 'Chrome';
  else if (ua.includes('Firefox')) browser = 'Firefox';
  else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Safari';
  else if (ua.includes('Edg')) browser = 'Edge';
  else if (ua.includes('Brave')) browser = 'Brave';
  
  let os = 'Unknown';
  if (ua.includes('Win')) os = 'Windows';
  else if (ua.includes('Mac')) os = 'macOS';
  else if (ua.includes('Linux')) os = 'Linux';
  else if (ua.includes('Android')) os = 'Android';
  else if (ua.includes('iOS')) os = 'iOS';
  
  return `${os} • ${browser} (${lang})`;
}

// Get IP (mock for client-side)
function getClientIP(): string {
  return '190.202.84.' + Math.floor(Math.random() * 255);
}

// Get location (mock for client-side)
function getLocation(): string {
  return 'Caracas, VE (Local)';
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTimeRemaining, setLockoutTimeRemaining] = useState(0);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [auditLogs, setAuditLogs] = useState<AuthAuditLog[]>([]);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [inactivityTimer, setInactivityTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  // Load users from localStorage or use initial data
  const getUsers = useCallback((): UserAccount[] => {
    const saved = localStorage.getItem(USERS_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initialUsers;
      }
    }
    return initialUsers;
  }, []);

  // Save users to localStorage
  const saveUsers = useCallback((users: UserAccount[]) => {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  }, []);

  // Load audit logs
  useEffect(() => {
    const saved = localStorage.getItem(AUDIT_STORAGE_KEY);
    if (saved) {
      try {
        setAuditLogs(JSON.parse(saved));
      } catch {
        setAuditLogs(initialAuthAuditLogs);
      }
    } else {
      setAuditLogs(initialAuthAuditLogs);
    }
  }, []);

  // Check for existing session on mount
  useEffect(() => {
    const savedSession = localStorage.getItem(AUTH_STORAGE_KEY);
    if (savedSession) {
      try {
        const session = JSON.parse(savedSession);
        if (session.expiresAt > Date.now()) {
          const users = getUsers();
          const user = users.find(u => u.id === session.userId);
          if (user) {
            setCurrentUser(user);
            setIsAuthenticated(true);
            setLastActivity(session.lastActivity || Date.now());
          }
        } else {
          localStorage.removeItem(AUTH_STORAGE_KEY);
        }
      } catch {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }
  }, [getUsers]);

  // Inactivity timer
  useEffect(() => {
    if (isAuthenticated) {
      const timer = setTimeout(() => {
        logout();
      }, INACTIVITY_TIMEOUT_MS);
      setInactivityTimer(timer);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, lastActivity]);

  const resetInactivityTimer = useCallback(() => {
    setLastActivity(Date.now());
  }, []);

  // Lockout timer
  useEffect(() => {
    if (isLocked && lockoutTimeRemaining > 0) {
      const timer = setInterval(() => {
        setLockoutTimeRemaining(prev => {
          if (prev <= 1000) {
            setIsLocked(false);
            setFailedAttempts(0);
            return 0;
          }
          return prev - 1000;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isLocked, lockoutTimeRemaining]);

  const addAuditLog = useCallback((logData: Omit<AuthAuditLog, 'id' | 'timestamp'>) => {
    const newLog: AuthAuditLog = {
      ...logData,
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
    };
    setAuditLogs(prev => {
      const updated = [newLog, ...prev].slice(0, 100); // Keep last 100 logs
      localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<LoginResult> => {
    // Check if locked
    if (isLocked) {
      return {
        success: false,
        error: `Cuenta bloqueada. Intenta de nuevo en ${Math.ceil(lockoutTimeRemaining / 1000)} segundos.`,
      };
    }

    // Sanitize inputs
    const cleanEmail = sanitizeInput(email.trim().toLowerCase());
    const cleanPassword = password.trim();

    // Validate email format
    if (!isValidEmail(cleanEmail)) {
      return {
        success: false,
        error: 'Formato de email inválido.',
      };
    }

    // Validate password length
    if (cleanPassword.length < 6) {
      return {
        success: false,
        error: 'La contraseña debe tener al menos 6 caracteres.',
      };
    }

    // Hash the provided password
    const hashedPassword = await hashPassword(cleanPassword);

    // Find user
    const users = getUsers();
    const user = users.find(u => u.email.toLowerCase() === cleanEmail);

    if (!user) {
      // Don't reveal if user exists or not
      setFailedAttempts(prev => prev + 1);
      
      addAuditLog({
        userEmail: cleanEmail,
        userName: 'Desconocido',
        eventType: 'login_failed',
        ip: getClientIP(),
        location: getLocation(),
        device: getDeviceInfo(),
        status: 'blocked',
        details: 'Email no registrado en el sistema',
      });

      // Check for brute force
      if (failedAttempts + 1 >= MAX_FAILED_ATTEMPTS) {
        setIsLocked(true);
        setLockoutTimeRemaining(LOCKOUT_DURATION_MS);
        addAuditLog({
          userEmail: cleanEmail,
          userName: 'Desconocido',
          eventType: 'account_locked',
          ip: getClientIP(),
          location: getLocation(),
          device: getDeviceInfo(),
          status: 'blocked',
          details: `Cuenta bloqueada por ${MAX_FAILED_ATTEMPTS} intentos fallidos`,
        });
        return {
          success: false,
          error: `Demasiados intentos fallidos. Cuenta bloqueada por 30 segundos.`,
        };
      }

      return {
        success: false,
        error: 'Email o contraseña incorrectos.',
      };
    }

    // Check if account is locked
    if (user.lockedUntil && user.lockedUntil > Date.now()) {
      const remaining = Math.ceil((user.lockedUntil - Date.now()) / 1000);
      return {
        success: false,
        error: `Cuenta bloqueada. Intenta de nuevo en ${remaining} segundos.`,
      };
    }

    // Check password (in demo, we compare with stored plaintext for simplicity)
    // In production, this should be done server-side with bcrypt
    const passwordMatch = user.passwordHash === cleanPassword || 
                          user.passwordHash === hashedPassword;

    if (!passwordMatch) {
      const newFailedAttempts = user.failedAttempts + 1;
      
      // Update user failed attempts
      const updatedUsers = users.map(u => {
        if (u.id === user.id) {
          return {
            ...u,
            failedAttempts: newFailedAttempts,
            lockedUntil: newFailedAttempts >= MAX_FAILED_ATTEMPTS ? Date.now() + LOCKOUT_DURATION_MS : null,
          };
        }
        return u;
      });
      saveUsers(updatedUsers);

      setFailedAttempts(newFailedAttempts);

      addAuditLog({
        userEmail: cleanEmail,
        userName: user.name,
        eventType: 'login_failed',
        ip: getClientIP(),
        location: getLocation(),
        device: getDeviceInfo(),
        status: 'warning',
        details: `Contraseña incorrecta. Intento ${newFailedAttempts}/${MAX_FAILED_ATTEMPTS}`,
      });

      if (newFailedAttempts >= MAX_FAILED_ATTEMPTS) {
        setIsLocked(true);
        setLockoutTimeRemaining(LOCKOUT_DURATION_MS);
        addAuditLog({
          userEmail: cleanEmail,
          userName: user.name,
          eventType: 'account_locked',
          ip: getClientIP(),
          location: getLocation(),
          device: getDeviceInfo(),
          status: 'blocked',
          details: `Cuenta bloqueada por ${MAX_FAILED_ATTEMPTS} intentos fallidos`,
        });
        return {
          success: false,
          error: `Cuenta bloqueada por ${MAX_FAILED_ATTEMPTS} intentos fallidos. Espera 30 segundos.`,
        };
      }

      return {
        success: false,
        error: 'Email o contraseña incorrectos.',
      };
    }

    // Success! Reset failed attempts
    const updatedUsers = users.map(u => {
      if (u.id === user.id) {
        return {
          ...u,
          failedAttempts: 0,
          lockedUntil: null,
          lastLogin: new Date().toISOString().replace('T', ' ').slice(0, 16),
          lastLoginIp: getClientIP(),
          lastLoginDevice: getDeviceInfo(),
        };
      }
      return u;
    });
    saveUsers(updatedUsers);

    // Create session
    const session = {
      userId: user.id,
      createdAt: Date.now(),
      expiresAt: Date.now() + SESSION_DURATION_MS,
      lastActivity: Date.now(),
      csrfToken: generateCSRFToken(),
      deviceFingerprint: getDeviceInfo(),
    };
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));

    setCurrentUser(user);
    setIsAuthenticated(true);
    setFailedAttempts(0);
    setLastActivity(Date.now());

    addAuditLog({
      userEmail: cleanEmail,
      userName: user.name,
      eventType: 'login_success',
      ip: getClientIP(),
      location: getLocation(),
      device: getDeviceInfo(),
      status: 'success',
      details: 'Inicio de sesión exitoso',
    });

    return { success: true, userId: user.id };
  }, [isLocked, lockoutTimeRemaining, failedAttempts, getUsers, saveUsers, addAuditLog]);

  const logout = useCallback(() => {
    if (currentUser) {
      addAuditLog({
        userEmail: currentUser.email,
        userName: currentUser.name,
        eventType: 'logout',
        ip: getClientIP(),
        location: getLocation(),
        device: getDeviceInfo(),
        status: 'success',
        details: 'Sesión cerrada',
      });
    }

    localStorage.removeItem(AUTH_STORAGE_KEY);
    setCurrentUser(null);
    setIsAuthenticated(false);
    setFailedAttempts(0);
    if (inactivityTimer) {
      clearTimeout(inactivityTimer);
    }
  }, [currentUser, addAuditLog, inactivityTimer]);

  // Reset activity on user interaction
  useEffect(() => {
    const handleActivity = () => {
      if (isAuthenticated) {
        resetInactivityTimer();
      }
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('click', handleActivity);
    window.addEventListener('scroll', handleActivity);

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('scroll', handleActivity);
    };
  }, [isAuthenticated, resetInactivityTimer]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        currentUser,
        login,
        logout,
        isLocked,
        lockoutTimeRemaining,
        failedAttempts,
        addAuditLog,
        auditLogs,
        lastActivity,
        resetInactivityTimer,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
