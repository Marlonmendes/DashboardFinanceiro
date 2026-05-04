import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { LayoutDashboard, BarChart2, Wallet, Users, Settings,
    Shield, HelpCircle, Moon, Search, ArrowUpRight,
    ArrowDownLeft, ChevronDown, Calendar, UtensilsCrossed,
    Car, Gamepad2, ShoppingBag, HeartPulse, GraduationCap, Home, CircleDollarSign,
    AlertCircle
} from "lucide-react";

// Base da API configurável por variável de ambiente (evita hardcode de localhost em produção)
const API_BASE_URL = (typeof process !== "undefined" && process.env && process.env.REACT_APP_API_URL)
  || "http://localhost:8080";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: BarChart2, label: "Analytics" },
  { icon: Wallet, label: "My Wallet" },
  { icon: Users, label: "Accounts" },
  { icon: Settings, label: "Settings" },
];

const categoriaIcons = {
  ALIMENTACAO: UtensilsCrossed,
  TRANSPORTE: Car,
  LAZER: Gamepad2,
  COMPRAS: ShoppingBag,
  SAUDE: HeartPulse,
  EDUCACAO: GraduationCap,
  MORADIA: Home,
};

const bottomNav = [
  { icon: Shield, label: "Security" },
  { icon: HelpCircle, label: "Help Centre" },
  { icon: Moon, label: "Dark Mode", toggle: true },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const income = payload.find(item => item.dataKey === "totalEntrada");
    const outcome = payload.find(item => item.dataKey === "totalSaida");

    return (
      <div
        style={{
          background: "#1E2A4A",
          border: "1px solid #2D3A5C",
          borderRadius: 8,
          padding: "12px 14px",
          color: "#fff",
          minWidth: 140,
        }}
      >
        <div style={{ fontWeight: 700, marginBottom: 8 }}>
          {label}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#5A51D4" }} />
          <span>Income:</span>
          <strong>${income?.value?.toLocaleString() ?? 0}</strong>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#64CFF6" }} />
          <span>Outcome:</span>
          <strong>${outcome?.value?.toLocaleString() ?? 0}</strong>
        </div>
      </div>
    );
  }

  return null;
};

export default function Dashboard() {
  const [darkMode, setDarkMode] = useState(true);
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );
  const [usuarioId] = useState(1); // TODO: substituir por ID do usuário autenticado
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [transacoes, setTransacoes] = useState([]);
  const [analyticsData, setAnalyticsData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const SCALE = 1.4;

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    fetchDados();
  }, []);

  const fetchDados = async () => {
    try {
      setLoading(true);
      setError(null);

      const [dashboardRes, transacoesRes, gastoMensalRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/analytics/dashboard/${usuarioId}`),
        fetch(`${API_BASE_URL}/api/financeiro?usuarioId=${usuarioId}`),
        fetch(`${API_BASE_URL}/api/analytics/tendencia/${usuarioId}/2026`).then(r => r.json()),
      ]);

      if (!dashboardRes.ok) {
        throw new Error(`Falha ao buscar dashboard (status ${dashboardRes.status})`);
      }
      if (!transacoesRes.ok) {
        throw new Error(`Falha ao buscar transações (status ${transacoesRes.status})`);
      }

      const dashboardData = await dashboardRes.json();
      const transacoesData = await transacoesRes.json();

      // A API pode retornar um array puro OU um objeto paginado com `content`.
      // Tratamos ambos os formatos para não quebrar o .reduce() mais abaixo.
      const listaTransacoes = Array.isArray(transacoesData)
        ? transacoesData
        : (transacoesData?.content ?? []);

      setDashboard(dashboardData);
      setTransacoes(listaTransacoes);
      // Monta os dados do gráfico de analytics a partir do histórico mensal
      // retornado pelo dashboard, se existir; senão deixa vazio (sem dado mockado).
      if (Array.isArray(gastoMensalRes)) {
        setAnalyticsData(gastoMensalRes);
      } else {
        setAnalyticsData([]);
      }
    } catch (err) {
      console.error("Erro ao buscar dados:", err);
      setError(err.message || "Não foi possível carregar os dados.");
      setTransacoes([]);
      setDashboard(null);
    } finally {
      setLoading(false);
    }
  };

  const formatMoeda = (valor) => {
    const numero = Number.isFinite(valor) ? valor : 0;
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(numero);
  };

  // Saldo seguro: nunca produz NaN mesmo se dashboard vier nulo/incompleto
  const totalEntrada = Number(dashboard?.qtdDinheiroEntrada) || 0;
  const totalSaida = Number(dashboard?.totalMensal) || 0;
  const saldoAtual = totalEntrada - totalSaida;

  const categoriasAgrupadas = transacoes.reduce((acc, transacao) => {
    const categoria = transacao?.categoria ?? "OUTROS";
    const valor = Number(transacao?.valor) || 0;

    if (!acc[categoria]) {
      acc[categoria] = { categoria, total: 0, quantidade: 0 };
    }

    acc[categoria].total += valor;
    acc[categoria].quantidade += 1;

    return acc;
  }, {});

  const categorias = Object.values(categoriasAgrupadas);

  const transacoesFiltradas = transacoes.filter((tx) =>
    (tx?.descricao || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Cards de resumo derivados dos dados reais, sem percentuais fixos/mockados
  const summaryCards = [
    {
      label: "Total Income",
      value: formatMoeda(totalEntrada),
      icon: ArrowDownLeft,
      iconBg: "#64CFF6",
      positive: true,
    },
    {
      label: "Total Outcome",
      value: formatMoeda(totalSaida),
      icon: ArrowUpRight,
      iconBg: "#FF4757",
      positive: false,
    },
  ];

  const theme = darkMode
        ? {
            bg: "#0F1629",
            card: "#141E35",
            border: "#1E2A4A",
            text: "#fff",
            muted: "#6B7DB3",
          }
        : {
            bg: "#F5F7FB",
            card: "#FFFFFF",
            border: "#E5E7EB",
            text: "#111827",
            muted: "#6B7280",
          };

  return (
    <div style={{
      display: "flex",
      flexDirection: isMobile ? "column" : "row",
      background: theme.bg,
      color: "#fff",
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
      fontSize: 14,
      transform: isMobile ? "none" : `scale(${SCALE})`,
      transformOrigin: "top left",
      width: isMobile ? "100%" : `${100 / SCALE}%`,
      // Trava o layout na altura da tela: isso garante que o scroll
      // aconteça SÓ dentro do <main>, e nunca na página inteira.
      // Sem isso, a sidebar (mesmo com position: sticky) é arrastada
      // para baixo junto com o resto do conteúdo.
      height: isMobile ? "auto" : `${100 / SCALE}vh`,
      overflow: isMobile ? "visible" : "hidden",
    }}>
      {/* Sidebar */}
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
        // Não precisa mais de position/overflow especiais: como o pai
        // já trava a altura e só o <main> rola, a sidebar fica
        // naturalmente fixa do tamanho da tela.
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
          {navItems.map((item) => (
            <div key={item.label} style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "10px 12px", borderRadius: 10, marginBottom: 4, cursor: "pointer",
              background: item.active ? "#5A51D4" : "transparent",
              color: item.active ? "#fff" : "#6B7DB3",
              fontWeight: item.active ? 600 : 400,
              transition: "all 0.2s",
            }}>
              <item.icon size={18} />
              {item.label}
            </div>
          ))}
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
                  onClick={() => setDarkMode(!darkMode)}
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

      {/* Main Content */}
      <main style={{ flex: 1, height: isMobile ? "auto" : "100%", overflowX: "hidden", overflowY: "auto" }}>
        {/* Top Bar */}
        <div style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          alignItems: isMobile ? "flex-start" : "center",
          justifyContent: "space-between",
          gap: 16,
          padding: isMobile ? "16px" : "28px 28px 0",
        }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, color: "#fff" }}>
              Welcome Back, Ali 👋
            </h1>
            <p style={{ margin: "4px 0 0", color: "#6B7DB3", fontSize: 13 }}>
              Here's what's happening with your store today.
            </p>
          </div>
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            background: "#1A2340", borderRadius: 10, padding: "10px 16px",
            width: isMobile ? "100%" : 260, border: "1px solid #1E2A4A",
          }}>
            <Search size={15} color="#6B7DB3" />
            <input
              placeholder="Search for anything...."
              style={{
                background: "none", border: "none", outline: "none",
                color: "#6B7DB3", fontSize: 13, flex: 1,
              }}
            />
          </div>
        </div>

        {/* Aviso de erro, caso a API falhe */}
        {error && (
          <div style={{
            margin: isMobile ? "16px" : "20px 28px 0",
            background: "#3A1E2A",
            border: "1px solid #FF4757",
            borderRadius: 12,
            padding: "12px 16px",
            display: "flex",
            alignItems: "center",
            gap: 10,
            color: "#FF8A93",
            fontSize: 13,
          }}>
            <AlertCircle size={16} />
            <span style={{ flex: 1 }}>{error}</span>
            <button
              onClick={fetchDados}
              style={{
                background: "transparent",
                border: "1px solid #FF4757",
                color: "#FF8A93",
                borderRadius: 8,
                padding: "4px 10px",
                fontSize: 12,
                cursor: "pointer",
              }}
            >
              Tentar novamente
            </button>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: 20, padding: isMobile ? "16px" : "20px 28px", alignItems: "flex-start" }}>
          {/* Left/Center Column */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 20, minWidth: 0 }}>
            {/* Summary Cards */}
            <div style={{ display: "flex", gap: 16, textAlign: "left", flexDirection: isMobile ? "column" : "row" }}>
              {summaryCards.map((card) => (
                <div key={card.label} style={{
                  flex: 1, background: "#141E35", borderRadius: 20,
                  padding: "20px 20px", display: "flex", alignItems: "center", gap: 16,
                  border: "1px solid #1E2A4A",
                }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12,
                    background: card.iconBg + "22",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <card.icon size={20} color={card.iconBg} />
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: "#6B7DB3" }}>{card.label}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      {loading
                        ? <span style={{ fontSize: 20, fontWeight: 700, color: "#6B7DB3" }}>...</span>
                        : <span style={{ fontSize: 20, fontWeight: 700 }}>{card.value}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Analytics Chart */}
            <div style={{
              background: "#141E35", borderRadius: 20, padding: "20px",
              border: "1px solid #1E2A4A",
            }}>
              <div style={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                alignItems: isMobile ? "flex-start" : "center",
                justifyContent: "space-between",
                gap: 12,
                marginBottom: 20
              }}>
                <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Analytics</h2>
                <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#6B7DB3" }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#5A51D4" }} /> Income
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#6B7DB3" }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#64CFF6" }} /> Outcome
                  </div>
                </div>
              </div>
              {analyticsData.length === 0 ? (
                <div style={{
                  height: 200, display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#6B7DB3", fontSize: 13,
                }}>
                  {loading ? "Carregando dados..." : "Sem dados de histórico para exibir."}
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={analyticsData} barGap={4} barCategoryGap="30%">
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E2A4A" vertical={false} />
                    <XAxis dataKey="nameMonth" axisLine={false} tickLine={false} tick={{ fill: "#6B7DB3", fontSize: 11 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: "#6B7DB3", fontSize: 11 }}
                      tickFormatter={(v) => {
                        if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
                        if (v >= 1_000) return `${(v / 1_000).toFixed(1)}K`;
                        return `${v}`;
                      }} />
                    <Tooltip content={<CustomTooltip />} cursor={false} />
                    <Bar
                      dataKey="totalEntrada"
                      fill="#5A51D4"
                      barSize={7}
                      activeBar={{ fill: "#6D63FF", radius: [4, 4, 0, 0] }}
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="totalSaida"
                      fill="#64CFF6"
                      activeBar={{ fill: "#8DE0FF", radius: [4, 4, 0, 0] }}
                      barSize={7}
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Transactions */}
            <div style={{
              background: "#141E35", borderRadius: 14, padding: "20px",
              border: "1px solid #1E2A4A",
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Transaction</h2>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{
                    display: "flex", alignItems: "center", gap: 8, background: "#1A2340",
                    borderRadius: 8, padding: "6px 12px", border: "1px solid #1E2A4A",
                  }}>
                    <Search size={13} color="#6B7DB3" />
                    <input
                      placeholder="Search for anything...."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{
                        background: "none", border: "none", outline: "none",
                        color: "#6B7DB3", fontSize: 12, width: 140,
                      }}
                    />
                  </div>
                </div>
              </div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ color: "#6B7DB3", fontSize: 12 }}>
                      {[
                        { label: "Name", align: "left" },
                        { label: "Date", align: "center" },
                        { label: "Amount", align: "center" },
                        { label: "Status", align: "center" },
                      ].map((col) => (
                        <th key={col.label} style={{ textAlign: col.align, padding: "6px 8px", fontWeight: 500 }}>{col.label}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={4} style={{ padding: "20px 8px", textAlign: "center", color: "#6B7DB3" }}>
                          Carregando transações...
                        </td>
                      </tr>
                    ) : transacoesFiltradas.length === 0 ? (
                      <tr>
                        <td colSpan={4} style={{ padding: "20px 8px", textAlign: "center", color: "#6B7DB3" }}>
                          Nenhuma transação encontrada.
                        </td>
                      </tr>
                    ) : (
                      transacoesFiltradas.slice(0, 5).map((tx, idx) => {
                        // Receita é determinada de forma consistente por um único critério (recDesp)
                        const isReceita = tx.recdesp === 1;
                        return (
                          <tr key={tx.id ?? `${tx.descricao}-${idx}`} style={{ borderTop: "1px solid #1E2A4A" }}>
                            <td style={{ padding: "12px 8px" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <div style={{
                                  width: 34, height: 34, borderRadius: 8,
                                  background: isReceita ? "#00C48C22" : "#FF475722",
                                  display: "flex", alignItems: "center", justifyContent: "center",
                                  fontSize: 11, fontWeight: 700,
                                  color: isReceita ? "#00C48C" : "#FF4757",
                                }}>
                                  {(tx.descricao || "??").substring(0, 2).toUpperCase()}
                                </div>
                                <span style={{ fontWeight: 500 }}>{tx.descricao}</span>
                              </div>
                            </td>
                            <td style={{ padding: "12px 8px", color: "#6B7DB3", fontSize: 12, textAlign: "center" }}>
                              {tx.data ? new Date(tx.data).toLocaleDateString("pt-BR") : "-"}
                            </td>
                            <td style={{
                              padding: "12px 8px", fontWeight: 600, textAlign: "center",
                              color: isReceita ? "#00C48C" : "#FF4757",
                            }}>
                              {isReceita ? "+" : "-"}{formatMoeda(Math.abs(Number(tx.valor) || 0))}
                            </td>
                            <td style={{ padding: "12px 8px", textAlign: "center" }}>
                              <span style={{
                                background: isReceita ? "#00C48C22" : "#FF475722",
                                color: isReceita ? "#00C48C" : "#FF4757",
                                padding: "4px 10px", borderRadius: 6, fontSize: 11, fontWeight: 600,
                              }}>
                                {tx.categoria}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div style={{
            width: isMobile ? "100%" : 374,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 20,
            flexShrink: 0,
            position: "sticky",
            top: 20,
          }}>
            {/* My Card */}
            <div style={{
              background: "#141E35",
              borderRadius: 20,
              padding: 20,
              border: "1px solid #1E2A4A",
              textAlign: "left"
            }}>
              <div style={{ color: "#fff", fontSize: 24, fontWeight: 600, marginBottom: 12 }}>My Card</div>
              <div style={{ color: "#8C89B4", fontSize: 14 }}>Card Balance</div>
              <div style={{ color: "white", fontSize: 24, fontWeight: 600, marginBottom: 24 }}>
                {formatMoeda(saldoAtual)}
              </div>

              {/* Card Visual */}
              <div style={{
                width: "100%",
                height: isMobile ? 160 : 180,
                borderRadius: 20,
                padding: "20px",
                position: "relative",
                background: "linear-gradient(135deg,#7B4DFF 0%,#5A51D4 50%,#4A90FF 100%)",
                marginBottom: 24,
                overflow: "hidden",
              }}>
                <div style={{
                  position: "absolute", top: -80, right: -40,
                  width: 220, height: 220, borderRadius: "50%",
                  background: "rgba(255,255,255,0.08)",
                }} />

                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.7)", marginBottom: 6 }}>Current Balance</div>
                <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>{formatMoeda(saldoAtual)}</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                  <div style={{
                    paddingTop: 60, opacity: 0.90,
                    fontSize: isMobile ? 12 : 14, fontWeight: 500, letterSpacing: 1
                  }}>
                    XXXX XXXX XXXX XXXX
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500, opacity: 0.9 }}>XX/XX</div>
                  </div>
                </div>

                <div style={{ position: "absolute", top: 16, right: 16, display: "flex" }}>
                  <div style={{ width: 22, height: 22, borderRadius: "50%", background: "#FF0000", opacity: 0.8 }} />
                  <div style={{ width: 22, height: 22, borderRadius: "50%", background: "#FF8C00", opacity: 0.8, marginLeft: -8 }} />
                </div>
              </div>

              <div style={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                gap: 12,
                marginTop: 8
              }}>
                <button style={{
                  flex: 1, padding: "9px 0", borderRadius: 10, border: "none", cursor: "pointer",
                  background: "#5A51D4", color: "#fff", fontWeight: 600, fontSize: 13, height: 40,
                }}>Manage Cards</button>
                <button style={{
                  flex: 1, padding: "9px 0", borderRadius: 10, cursor: "pointer",
                  background: "transparent", color: "#fff", fontWeight: 600, fontSize: 13,
                  border: "1px solid #2D3A5C", height: 40,
                }}>Transfer</button>
              </div>
            </div>

            {/* Categories */}
            <div style={{ background: "#141E35", borderRadius: 20, padding: 24, border: "1px solid #1E2A4A" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                <span style={{ fontWeight: 700, fontSize: 15 }}>Categories</span>
                <span style={{ color: "#6B7DB3", fontSize: 12 }}>
                  {categorias.length} categorias
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {categorias.length === 0 ? (
                  <div style={{ color: "#6B7DB3", fontSize: 13, textAlign: "center", padding: "12px 0" }}>
                    {loading ? "Carregando..." : "Nenhuma categoria ainda."}
                  </div>
                ) : (
                  categorias.map((categoria) => {
                    const Icon = categoriaIcons[categoria.categoria] || CircleDollarSign;
                    const isReceita = categoria.categoria === "RECEITA";
                    return (
                      <div
                        key={categoria.categoria}
                        style={{
                          background: "#1A2340",
                          borderRadius: 12,
                          padding: "12px 16px",
                          border: "1px solid #1E2A4A",
                        }}
                      >
                        <div style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 90px 60px",
                          alignItems: "center",
                        }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <div style={{
                              width: 32, height: 32, borderRadius: 10,
                              background: "#141E35",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              flexShrink: 0,
                            }}>
                              <Icon size={16} color="#64CFF6" />
                            </div>
                            <span style={{ color: "#fff", fontWeight: 600 }}>
                              {categoria.categoria}
                            </span>
                          </div>

                          <span style={{ color: isReceita ? "#00C48C" : "#FF4757", fontWeight: 600, textAlign: "right" }}>
                            {formatMoeda(categoria.total)}
                          </span>

                          <span style={{ color: "#6B7DB3", fontSize: 12, textAlign: "right" }}>
                            {categoria.quantidade}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}