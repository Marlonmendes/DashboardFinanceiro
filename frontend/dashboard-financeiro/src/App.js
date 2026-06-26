import React, { useState, useEffect } from 'react';
import Sidebar from './components/SideBar';
import DashboardFinanceiro from './components/DashboardFinanceiro';
import WalletPage from './components/WalletPage';
import AnalyticsPage from './components/AnalyticsPage'
import './App.css';

function App() {
  // Controla qual tela está ativa: "dashboard" | "wallet" | ...
  const [activePage, setActivePage] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(true);
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );
  const SCALE = 1.4;

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Decide qual tela renderizar com base no item de menu selecionado.
  // Itens sem tela implementada ainda (Analytics, Accounts, Settings)
  // caem no Dashboard por padrão, para não quebrar o clique.
  const renderPage = () => {
    switch (activePage) {
      case 'wallet':
        return <WalletPage isMobile={isMobile} />;
      case 'analytics':
        return <AnalyticsPage isMobile={isMobile} />;
      case 'dashboard':
      default:
        return <DashboardFinanceiro isMobile={isMobile} />;
    }
  };

  return (
    <div className="App">
      <div style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        background: '#0F1629',
        color: '#fff',
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
        fontSize: 14,
        transform: isMobile ? 'none' : `scale(${SCALE})`,
        transformOrigin: 'top left',
        width: isMobile ? '100%' : `${100 / SCALE}%`,
        // Trava o layout na altura da tela: o scroll acontece SÓ dentro
        // do <main>, nunca na página inteira — assim a sidebar nunca se move.
        height: isMobile ? 'auto' : `${100 / SCALE}vh`,
        overflow: isMobile ? 'visible' : 'hidden',
      }}>
        <Sidebar
          activePage={activePage}
          onNavigate={setActivePage}
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode((d) => !d)}
          isMobile={isMobile}
        />

        <main style={{ flex: 1, height: isMobile ? 'auto' : '100%', overflowX: 'hidden', overflowY: 'auto' }}>
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

export default App;