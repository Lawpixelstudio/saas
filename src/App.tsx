import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { ToastContainer } from './components/common/ToastContainer';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';
import { LoginView } from './components/auth/LoginView';

// Views
import { DashboardView } from './components/dashboard/DashboardView';
import { ClientsView } from './components/clients/ClientsView';
import { ProjectsView } from './components/projects/ProjectsView';
import { FinanceView } from './components/finance/FinanceView';
import { MaintenanceView } from './components/maintenance/MaintenanceView';
import { DocumentationView } from './components/documentation/DocumentationView';

// Modals
import { NewClientModal } from './components/modals/NewClientModal';
import { EditClientModal } from './components/modals/EditClientModal';
import { NewProjectModal } from './components/modals/NewProjectModal';
import { RecordPaymentModal } from './components/modals/RecordPaymentModal';
import { NewReviewModal } from './components/modals/NewReviewModal';

const AppContent: React.FC = () => {
  const { currentModule } = useApp();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F8FAFC] text-slate-800 antialiased font-sans">
      {/* Odoo-style Left Sidebar */}
      <Sidebar />

      {/* Main Execution Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Salesforce-style Header */}
        <Header />

        {/* Dynamic Module Body */}
        <main className="flex-1 overflow-y-auto min-h-0 bg-[#F8FAFC] pb-24 lg:pb-6">
          {currentModule === 'dashboard' && <DashboardView />}
          {currentModule === 'clients' && <ClientsView />}
          {currentModule === 'projects' && <ProjectsView />}
          {currentModule === 'finance' && <FinanceView />}
          {currentModule === 'maintenance' && <MaintenanceView />}
          {currentModule === 'documentation' && <DocumentationView />}
        </main>
      </div>

      {/* Mobile Floating Bottom Navigation */}
      <MobileBottomNav />

      {/* Global Modals & Notifications */}
      <GlobalSearchModal />
      <NewClientModal />
      <EditClientModal />
      <NewProjectModal />
      <RecordPaymentModal />
      <NewReviewModal />
      <ToastContainer />
    </div>
  );
};

const AuthenticatedApp: React.FC = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginView />;
  }

  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AuthenticatedApp />
    </AuthProvider>
  );
}
