import {
  LayoutDashboard, BarChart2, Wallet, Users, Settings,
  Shield, HelpCircle, Moon, ChevronDown,
} from "lucide-react";

const navItems = [
  { key: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { key: "analytics", icon: BarChart2, label: "Analytics" },
  { key: "wallet", icon: Wallet, label: "My Wallet" },
  { key: "accounts", icon: Users, label: "Accounts" },
  { key: "settings", icon: Settings, label: "Settings" },
];

const bottomNav = [
  { icon: Shield, label: "Security" },
  { icon: HelpCircle, label: "Help Centre" },
  { icon: Moon, label: "Dark Mode", toggle: true },
];

/**
 * Sidebar compartilhada entre todas as telas do app.
 *
 * Props:
 * - activePage: string com o `key` da tela atual (ex: "dashboard", "wallet")
 * - onNavigate: function(key) chamada ao clicar em um item do menu
 * - darkMode / onToggleDarkMode: estado do tema, controlado pelo componente pai
 * - isMobile: ajusta o layout (empilhado) em telas pequenas
 */
export default function Sidebar({ activePage, onNavigate, darkMode, onToggleDarkMode, isMobile }) {
  return (
    <aside style={{
      width: isMobile ? "100%" : 250,
      height: isMobile ? "auto" : "100%",
      background: "#0F1629",
      display: "flex",
      flexDirection: "column",
      padding: "24px 16px",
      borderRight: isMobile ? "none" : "1px solid #1E2A4A",
      borderBottom: isMobile ? "1px solid #1E2A4A" : "none",
      flexShrink: 0,
      overflowY: isMobile ? "visible" : "auto",
    }}>
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 32, paddingLeft: 8 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: "linear-gradient(135deg, #FF6B35, #FF3E9D)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <span style={{ fontSize: 16 }}>🔥</span>
        </div>
        <span style={{ fontWeight: 700, fontSize: 18, color: "#fff" }}>uifry™</span>
      </div>

      {/* Main Nav */}
      <nav style={{ flex: 1 }}>
        {navItems.map((item) => {
          const isActive = item.key === activePage;
          return (
            <div
              key={item.key}
              onClick={() => onNavigate?.(item.key)}
              style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "10px 12px", borderRadius: 10, marginBottom: 4, cursor: "pointer",
                background: isActive ? "#5A51D4" : "transparent",
                color: isActive ? "#fff" : "#6B7DB3",
                fontWeight: isActive ? 600 : 400,
                transition: "all 0.2s",
              }}
            >
              <item.icon size={18} />
              {item.label}
            </div>
          );
        })}
      </nav>

      <div style={{ borderTop: "1px solid #1E2A4A", paddingTop: 16, marginTop: "auto", marginBottom: 16 }}>
        {bottomNav.map((item) => (
          <div key={item.label} style={{
            display: "flex", alignItems: "center", gap: 12,
            padding: "10px 12px", borderRadius: 10, marginBottom: 4, cursor: "pointer",
            color: "#6B7DB3",
          }}>
            <item.icon size={18} />
            <span style={{ flex: 1 }}>{item.label}</span>
            {item.toggle && (
              <div
                onClick={onToggleDarkMode}
                role="switch"
                aria-checked={darkMode}
                style={{
                  width: 36, height: 20, borderRadius: 10, cursor: "pointer",
                  background: darkMode ? "#5A51D4" : "#2D3A5C",
                  position: "relative", transition: "background 0.2s",
                }}
              >
                <div style={{
                  position: "absolute", top: 2,
                  left: darkMode ? 18 : 2,
                  width: 16, height: 16, borderRadius: "50%",
                  background: "#fff", transition: "left 0.2s",
                }} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* User Profile */}
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "10px 8px", borderTop: "1px solid #1E2A4A",
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: "50%",
          background: "linear-gradient(135deg, #667eea, #764ba2)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 14, fontWeight: 700, flexShrink: 0,
        }}>AR</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 600, fontSize: 13, color: "#fff" }}>Ali Riaz</div>
          <div style={{ fontSize: 11, color: "#6B7DB3" }}>Web Developer</div>
        </div>
        <ChevronDown size={14} color="#6B7DB3" />
      </div>
    </aside>
  );
}