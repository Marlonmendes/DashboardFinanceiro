import { useEffect, useRef, useState } from "react";
import {
  Wallet, ArrowDownLeft, ArrowUpRight, Plus, UtensilsCrossed,
  Car, Gamepad2, ShoppingBag, HeartPulse, GraduationCap, Home,
  CircleDollarSign, TrendingUp, PieChart, ChevronDown, Check,
} from "lucide-react";

const categoriaIcons = {
  ALIMENTACAO: UtensilsCrossed,
  TRANSPORTE: Car,
  LAZER: Gamepad2,
  COMPRAS: ShoppingBag,
  SAUDE: HeartPulse,
  EDUCACAO: GraduationCap,
  MORADIA: Home,
};

const categoriasDisponiveis = [
  "ALIMENTACAO", "TRANSPORTE", "LAZER", "COMPRAS", "SAUDE", "EDUCACAO", "MORADIA",
];

const tiposDisponiveis = [
  { value: -1, label: "Despesa", icon: ArrowUpRight, color: "#FF4757" },
  { value: 1, label: "Receita", icon: ArrowDownLeft, color: "#00C48C" },
];

function WalletSelect({ value, options, onChange, getLabel, getIcon, getColor }) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);
  const selectedOption = options.find((option) => option.value === value) || options[0];
  const SelectedIcon = getIcon?.(selectedOption) || CircleDollarSign;
  const selectedColor = getColor?.(selectedOption) || "#64CFF6";

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleClickOutside = (event) => {
      if (!selectRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div ref={selectRef} style={{ position: "relative" }}>
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        style={{
          width: "100%",
          height: 40,
          background: "#1A2340",
          border: `1px solid ${isOpen ? "#5A51D4" : "#1E2A4A"}`,
          borderRadius: 10,
          padding: "0 12px",
          color: "#fff",
          fontSize: 13,
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
          cursor: "pointer",
          boxShadow: isOpen ? "0 0 0 3px rgba(90, 81, 212, 0.22)" : "none",
          transition: "border-color 0.15s ease, box-shadow 0.15s ease, background 0.15s ease",
        }}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
          <SelectedIcon size={15} color={selectedColor} />
          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {getLabel(selectedOption)}
          </span>
        </span>
        <ChevronDown
          size={16}
          color="#6B7DB3"
          style={{
            flexShrink: 0,
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.15s ease",
          }}
        />
      </button>

      {isOpen && (
        <div
          role="listbox"
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            left: 0,
            right: 0,
            zIndex: 30,
            background: "#121B31",
            border: "1px solid #26365F",
            borderRadius: 12,
            padding: 6,
            boxShadow: "0 18px 40px rgba(4, 8, 20, 0.48)",
            maxHeight: 230,
            overflowY: "auto",
          }}
        >
          {options.map((option) => {
            const optionSelected = option.value === value;
            const OptionIcon = getIcon?.(option) || CircleDollarSign;
            const optionColor = getColor?.(option) || "#64CFF6";

            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={optionSelected}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                style={{
                  width: "100%",
                  minHeight: 36,
                  border: "none",
                  borderRadius: 8,
                  background: optionSelected ? "#24325B" : "transparent",
                  color: optionSelected ? "#fff" : "#B8C4EA",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 8,
                  padding: "8px 10px",
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: 700,
                  textAlign: "left",
                }}
              >
                <span style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                  <OptionIcon size={14} color={optionColor} />
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {getLabel(option)}
                  </span>
                </span>
                {optionSelected && <Check size={14} color="#64CFF6" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function WalletPage() {
  const [transacoes, setTransacoes] = useState([
    { id: 1, descricao: "Mercado", valor: 150.00, categoria: "ALIMENTACAO", recdesp: -1, data: "2026-06-20" },
    { id: 2, descricao: "Salário", valor: 4200.00, categoria: "OUTROS", recdesp: 1, data: "2026-06-05" },
    { id: 3, descricao: "Uber", valor: 23.50, categoria: "TRANSPORTE", recdesp: -1, data: "2026-06-18" },
  ]);

  const [form, setForm] = useState({
    descricao: "",
    valor: "",
    categoria: "ALIMENTACAO",
    tipo: -1, // 1 = Receita, -1 = Despesa
    data: new Date().toISOString().slice(0, 10),
  });

  const formatMoeda = (valor) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
      Number.isFinite(valor) ? valor : 0
    );

  const totalReceitas = transacoes
    .filter((t) => t.recdesp === 1)
    .reduce((acc, t) => acc + Number(t.valor || 0), 0);

  const totalDespesas = transacoes
    .filter((t) => t.recdesp === -1)
    .reduce((acc, t) => acc + Number(t.valor || 0), 0);

  const saldoAtual = totalReceitas - totalDespesas;

  const handleChange = (campo) => (e) => {
    setForm((prev) => ({ ...prev, [campo]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const valorNumerico = Number(form.valor);
    if (!form.descricao.trim() || !valorNumerico || valorNumerico <= 0) return;

    const novaTransacao = {
      id: Date.now(),
      descricao: form.descricao.trim(),
      valor: valorNumerico,
      categoria: form.categoria,
      recdesp: Number(form.tipo),
      data: form.data,
    };

    setTransacoes((prev) => [novaTransacao, ...prev]);

    setForm({
      descricao: "",
      valor: "",
      categoria: "ALIMENTACAO",
      tipo: -1,
      data: new Date().toISOString().slice(0, 10),
    });
  };

  const inputStyle = {
    width: "100%",
    background: "#1A2340",
    border: "1px solid #1E2A4A",
    borderRadius: 10,
    padding: "10px 12px",
    color: "#fff",
    fontSize: 13,
    outline: "none",
    boxSizing: "border-box",
  };

  const labelStyle = {
    display: "block",
    fontSize: 12,
    color: "#6B7DB3",
    marginBottom: 6,
    fontWeight: 500,
  };

  return (
    <div style={{
      background: "#0F1629",
      color: "#fff",
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
      fontSize: 14,
      padding: 28,
      minHeight: "100%",
      boxSizing: "border-box",
    }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, color: "#fff" }}>My Wallet</h1>
        <p style={{ margin: "4px 0 0", color: "#6B7DB3", fontSize: 13 }}>
          Acompanhe seu saldo, receitas e despesas.
        </p>
      </div>

      <div style={{ display: "flex", gap: 20, alignItems: "flex-start", flexWrap: "wrap" }}>
        {/* Coluna principal */}
        <div style={{ flex: 1, minWidth: 320, display: "flex", flexDirection: "column", gap: 20 }}>
          {/* 1. Cards de resumo */}
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            {[
              {
                label: "Saldo Atual",
                value: formatMoeda(saldoAtual),
                icon: Wallet,
                iconBg: "#5A51D4",
              },
              {
                label: "Receitas",
                value: formatMoeda(totalReceitas),
                icon: ArrowDownLeft,
                iconBg: "#00C48C",
              },
              {
                label: "Despesas",
                value: formatMoeda(totalDespesas),
                icon: ArrowUpRight,
                iconBg: "#FF4757",
              },
            ].map((card) => (
              <div
                key={card.label}
                style={{
                  flex: "1 1 200px",
                  background: "#141E35",
                  borderRadius: 20,
                  padding: "20px",
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  border: "1px solid #1E2A4A",
                }}
              >
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: card.iconBg + "22",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <card.icon size={20} color={card.iconBg} />
                </div>
                <div>
                  <div style={{ fontSize: 12, color: "#6B7DB3" }}>{card.label}</div>
                  <div style={{ fontSize: 20, fontWeight: 700 }}>{card.value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* 2. Formulário Nova Transação */}
          <div style={{
            background: "#141E35", borderRadius: 20, padding: 20,
            border: "1px solid #1E2A4A",
          }}>
            <h2 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 700 }}>Nova Transação</h2>

            <form onSubmit={handleSubmit}>
              <div style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr 1fr",
                gap: 12,
                marginBottom: 12,
              }}>
                <div>
                  <label style={labelStyle}>Descrição</label>
                  <input
                    type="text"
                    placeholder="Ex: Mercado, Salário..."
                    value={form.descricao}
                    onChange={handleChange("descricao")}
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Valor</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0,00"
                    value={form.valor}
                    onChange={handleChange("valor")}
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Data</label>
                  <input
                    type="date"
                    value={form.data}
                    onChange={handleChange("data")}
                    style={inputStyle}
                  />
                </div>
              </div>

              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr auto",
                gap: 12,
                alignItems: "end",
              }}>
                <div>
                  <label style={labelStyle}>Categoria</label>
                  <WalletSelect
                    value={form.categoria}
                    options={categoriasDisponiveis.map((cat) => ({ value: cat, label: cat }))}
                    onChange={(categoria) => setForm((prev) => ({ ...prev, categoria }))}
                    getLabel={(option) => option.label}
                    getIcon={(option) => categoriaIcons[option.value] || CircleDollarSign}
                    getColor={() => "#64CFF6"}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Tipo</label>
                  <WalletSelect
                    value={form.tipo}
                    options={tiposDisponiveis}
                    onChange={(tipo) => setForm((prev) => ({ ...prev, tipo }))}
                    getLabel={(option) => option.label}
                    getIcon={(option) => option.icon}
                    getColor={(option) => option.color}
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    background: "#5A51D4",
                    color: "#fff",
                    border: "none",
                    borderRadius: 10,
                    padding: "10px 20px",
                    fontWeight: 600,
                    fontSize: 13,
                    cursor: "pointer",
                    height: 40,
                    whiteSpace: "nowrap",
                  }}
                >
                  <Plus size={16} />
                  Adicionar
                </button>
              </div>
            </form>
          </div>

          {/* 3. Tabela de Histórico */}
          <div style={{
            background: "#141E35", borderRadius: 14, padding: 20,
            border: "1px solid #1E2A4A",
          }}>
            <h2 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 700 }}>Histórico</h2>

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ color: "#6B7DB3", fontSize: 12 }}>
                    <th style={{ textAlign: "left", padding: "6px 8px", fontWeight: 500 }}>Descrição</th>
                    <th style={{ textAlign: "center", padding: "6px 8px", fontWeight: 500 }}>Data</th>
                    <th style={{ textAlign: "center", padding: "6px 8px", fontWeight: 500 }}>Categoria</th>
                    <th style={{ textAlign: "center", padding: "6px 8px", fontWeight: 500 }}>Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {transacoes.length === 0 ? (
                    <tr>
                      <td colSpan={4} style={{ padding: "20px 8px", textAlign: "center", color: "#6B7DB3" }}>
                        Nenhuma transação registrada.
                      </td>
                    </tr>
                  ) : (
                    transacoes.map((tx) => {
                      const isReceita = tx.recdesp === 1;
                      const Icon = categoriaIcons[tx.categoria] || CircleDollarSign;

                      return (
                        <tr key={tx.id} style={{ borderTop: "1px solid #1E2A4A" }}>
                          <td style={{ padding: "12px 8px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                              <div style={{
                                width: 34, height: 34, borderRadius: 8,
                                background: isReceita ? "#00C48C22" : "#FF475722",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                color: isReceita ? "#00C48C" : "#FF4757",
                                flexShrink: 0,
                              }}>
                                {(tx.descricao || "??").substring(0, 2).toUpperCase()}
                              </div>
                              <span style={{ fontWeight: 500 }}>{tx.descricao}</span>
                            </div>
                          </td>

                          <td style={{ padding: "12px 8px", color: "#6B7DB3", fontSize: 12, textAlign: "center" }}>
                            {tx.data ? new Date(tx.data).toLocaleDateString("pt-BR") : "-"}
                          </td>

                          <td style={{ padding: "12px 8px", textAlign: "center" }}>
                            <span style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 6,
                              background: "#1A2340",
                              color: "#64CFF6",
                              padding: "4px 10px",
                              borderRadius: 6,
                              fontSize: 11,
                              fontWeight: 600,
                            }}>
                              <Icon size={12} />
                              {tx.categoria}
                            </span>
                          </td>

                          <td style={{
                            padding: "12px 8px", fontWeight: 600, textAlign: "center",
                            color: isReceita ? "#00C48C" : "#FF4757",
                          }}>
                            {isReceita ? "+" : "-"}{formatMoeda(Math.abs(Number(tx.valor) || 0))}
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

        {/* 4. Área lateral para estatísticas futuras */}
        <div style={{
          width: 320,
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}>
          <div style={{
            background: "#141E35", borderRadius: 20, padding: 20,
            border: "1px solid #1E2A4A",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: "#5A51D422",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <TrendingUp size={18} color="#5A51D4" />
              </div>
              <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>Estatísticas</h2>
            </div>
            <div style={{
              height: 160,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#6B7DB3",
              fontSize: 13,
              textAlign: "center",
              border: "1px dashed #1E2A4A",
              borderRadius: 12,
              padding: 16,
            }}>
              Gráficos e indicadores em breve.
            </div>
          </div>

          <div style={{
            background: "#141E35", borderRadius: 20, padding: 20,
            border: "1px solid #1E2A4A",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: "#64CFF622",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <PieChart size={18} color="#64CFF6" />
              </div>
              <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>Distribuição</h2>
            </div>
            <div style={{
              height: 120,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#6B7DB3",
              fontSize: 13,
              textAlign: "center",
              border: "1px dashed #1E2A4A",
              borderRadius: 12,
              padding: 16,
            }}>
              Distribuição por categoria em breve.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
