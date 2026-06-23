import React, { useEffect, useState } from 'react';
import { ThemeProvider } from './components/ThemeProvider';
import { Layout } from './components/Layout';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { POS } from './pages/POS';
import { Inventory } from './pages/Inventory';
import { Reports } from './pages/Reports';
import { Billing } from './pages/Billing';
import { OnboardingTour } from './components/OnboardingTour';
import { useScreenInit } from './useScreenInit.js';
export function App() {
  const screenInit = useScreenInit();
  const [isAuthenticated, setIsAuthenticated] = useState(
    screenInit?.isAuthenticated ?? false
  );
  const [currentView, setCurrentView] = useState(
    screenInit?.currentView ?? 'landing'
  );
  const [showOnboarding, setShowOnboarding] = useState(false);
  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setCurrentView('dashboard');
    // Check if first login
    const hasOnboarded = localStorage.getItem('bizflow-onboarded');
    if (!hasOnboarded) {
      setShowOnboarding(true);
    }
  };
  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    localStorage.setItem('bizflow-onboarded', 'true');
  };
  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentView('landing');
  };
  const renderAuthenticatedView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'pos':
        return <POS />;
      case 'inventory':
        return <Inventory />;
      case 'reports':
        return <Reports />;
      case 'billing':
        return <Billing />;
      default:
        return <Dashboard />;
    }
  };
  return (
    <ThemeProvider defaultTheme="dark">
      {!isAuthenticated ?
      currentView === 'login' ?
      <Login
        onLogin={handleLoginSuccess}
        onBack={() => setCurrentView('landing')} /> :


      <Landing onNavigate={setCurrentView} /> :


      <Layout
        currentView={currentView}
        onNavigate={setCurrentView}
        onLogout={handleLogout}>
        
          {renderAuthenticatedView()}
          {showOnboarding &&
        <OnboardingTour onComplete={handleOnboardingComplete} />
        }
        </Layout>
      }
    </ThemeProvider>);

}