import { useCallback, useEffect, useRef, useState } from "react";
import {
  Wallet, ArrowDownLeft, ArrowUpRight, Plus, Trash2, Pencil, X, UtensilsCrossed,
  Car, Gamepad2, ShoppingBag, HeartPulse, GraduationCap, Home,
  CircleDollarSign, TrendingUp, PieChart, ChevronDown, Check,
} from "lucide-react";

const API_BASE_URL = (typeof process !== "undefined" && process.env && process.env.REACT_APP_API_URL)
  || "http://localhost:8080";

const categoriaIcons = {
  ALIMENTACAO: UtensilsCrossed,
  TRANSPORTE: Car,
  LAZER: Gamepad2,
  COMPRAS: ShoppingBag,
  SAUDE: HeartPulse,
  EDUCACAO: GraduationCap,
  MORADIA: Home,
  UTILIDADES: CircleDollarSign,
  OUTROS: CircleDollarSign,
  RECEITA: CircleDollarSign,
};

const categoriasDisponiveis = [
  "ALIMENTACAO",
  "TRANSPORTE",
  "LAZER",
  "COMPRAS",
  "SAUDE",
  "EDUCACAO",
  "MORADIA",
  "UTILIDADES",
  "OUTROS",
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
          transition: "border-color 0.15s ease, box-shadow 0.15s ease",
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
            borderRadius: 4,
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
  const [usuarioId] = useState(1);
  const [dashboard, setDashboard] = useState(null);
  const [transacoes, setTransacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    descricao: "",
    valor: "",
    categoria: "ALIMENTACAO",
    tipo: -1,
    data: new Date().toISOString().slice(0, 10),
  });

  const fetchDados = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [dashboardRes, transacoesRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/analytics/dashboard/${usuarioId}`),
        fetch(`${API_BASE_URL}/api/financeiro?usuarioId=${usuarioId}`),
      ]);

      if (!dashboardRes.ok) {
        throw new Error(`Falha ao buscar dashboard (status ${dashboardRes.status})`);
      }

      if (!transacoesRes.ok) {
        throw new Error(`Falha ao buscar transações (status ${transacoesRes.status})`);
      }

      const dashboardData = await dashboardRes.json();
      const transacoesData = await transacoesRes.json();
      const listaTransacoes = Array.isArray(transacoesData)
        ? transacoesData
        : transacoesData?.content ?? [];

      setDashboard(dashboardData);
      setTransacoes(listaTransacoes);
      setSelectedIds((currentIds) =>
        currentIds.filter((id) => listaTransacoes.some((tx) => tx.id === id))
      );
    } catch (err) {
      console.error("Erro ao buscar dados da carteira:", err);
      setDashboard(null);
      setTransacoes([]);
      setError(err.message || "Não foi possível carregar os dados da carteira.");
    } finally {
      setLoading(false);
    }
  }, [usuarioId]);

  useEffect(() => {
    fetchDados();
  }, [fetchDados]);

  const formatMoeda = (valor) => {
    const numero = Number(valor);

    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
      Number.isFinite(numero) ? numero : 0
    );
  };

  const formatData = (data) => {
    if (!data) return "-";

    const [ano, mes, dia] = String(data).split("T")[0].split("-");
    if (!ano || !mes || !dia) return "-";

    return `${dia}/${mes}/${ano}`;
  };

  const receitasPorTransacao = transacoes
    .filter((t) => t.recdesp === 1)
    .reduce((acc, t) => acc + Number(t.valor || 0), 0);

  const despesasPorTransacao = transacoes
    .filter((t) => t.recdesp === -1)
    .reduce((acc, t) => acc + Number(t.valor || 0), 0);

  const totalReceitas = Number(dashboard?.qtdDinheiroEntrada) || receitasPorTransacao;
  const totalDespesas = Number(dashboard?.totalMensal) || despesasPorTransacao;
  const saldoAtual = totalReceitas - totalDespesas;
  const allSelected = transacoes.length > 0 && selectedIds.length === transacoes.length;
  const isEditing = editingId !== null;

  const handleChange = (campo) => (e) => {
    setForm((prev) => ({ ...prev, [campo]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const valorNumerico = Number(form.valor);
    if (!form.descricao.trim() || !valorNumerico || valorNumerico <= 0) return;

    try {
      setSubmitting(true);
      setError(null);
        console.log(Number(form.tipo));
      const response = await fetch(
        isEditing
          ? `${API_BASE_URL}/api/financeiro/${editingId}`
          : `${API_BASE_URL}/api/financeiro`,
        {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          descricao: form.descricao.trim(),
          valor: valorNumerico,
          categoria: form.categoria,
          recdesp: Number(form.tipo), //não importa o que eu faça fica sempre 1
          necessario: "NAO",
          data: form.data,
          usuarioId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Falha ao ${isEditing ? "atualizar" : "adicionar"} transação (status ${response.status})`);
      }

      setForm({
        descricao: "",
        valor: "",
        categoria: "ALIMENTACAO",
        tipo: -1,
        data: new Date().toISOString().slice(0, 10),
      });
      setEditingId(null);

      await fetchDados();
    } catch (err) {
      console.error("Erro ao adicionar transação:", err);
      setError(err.message || "Não foi possível adicionar a transação.");
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setForm({
      descricao: "",
      valor: "",
      categoria: "ALIMENTACAO",
      tipo: -1,
      data: new Date().toISOString().slice(0, 10),
    });
    setEditingId(null);
  };

  const toggleSelectAll = () => {
    setSelectedIds(allSelected ? [] : transacoes.map((tx) => tx.id));
  };

  const toggleSelectOne = (id) => {
    setSelectedIds((currentIds) =>
      currentIds.includes(id)
        ? currentIds.filter((selectedId) => selectedId !== id)
        : [...currentIds, id]
    );
  };

  const handleEdit = (tx) => {
    setEditingId(tx.id);
    setForm({
      descricao: tx.descricao || "",
      valor: String(tx.valor ?? ""),
      categoria: tx.categoria || "ALIMENTACAO",
      tipo: Number(tx.recdesp) || -1,
      data: String(tx.data || "").split("T")[0] || new Date().toISOString().slice(0, 10),
    });
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return;

    try {
      setDeleting(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/api/financeiro/lote`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedIds),
      });

      if (!response.ok) {
        throw new Error(`Falha ao excluir transações (status ${response.status})`);
      }

      if (selectedIds.includes(editingId)) {
        resetForm();
      }

      setSelectedIds([]);
      await fetchDados();
    } catch (err) {
      console.error("Erro ao excluir transações:", err);
      setError(err.message || "Não foi possível excluir as transações selecionadas.");
    } finally {
      setDeleting(false);
    }
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
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, color: "#fff" }}>My Wallet</h1>
        <p style={{ margin: "4px 0 0", color: "#6B7DB3", fontSize: 13 }}>
          Acompanhe seu saldo, receitas e despesas.
        </p>
      </div>

      {error && (
        <div style={{
          background: "#FF47571A",
          border: "1px solid #FF475755",
          borderRadius: 12,
          color: "#FF8A95",
          fontSize: 13,
          marginBottom: 16,
          padding: "12px 14px",
        }}>
          {error}
        </div>
      )}

      <div style={{ display: "flex", gap: 20, alignItems: "flex-start", flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 320, display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            {[
              { label: "Saldo Atual", value: formatMoeda(saldoAtual), icon: Wallet, iconBg: "#5A51D4" },
              { label: "Receitas", value: formatMoeda(totalReceitas), icon: ArrowDownLeft, iconBg: "#00C48C" },
              { label: "Despesas", value: formatMoeda(totalDespesas), icon: ArrowUpRight, iconBg: "#FF4757" },
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
                  <div style={{ fontSize: 20, fontWeight: 700, color: card.iconBg }}>{loading ? "Carregando..." : card.value}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{
            background: "#141E35", borderRadius: 20, padding: 20,
            border: "1px solid #1E2A4A",
          }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              marginBottom: 16,
            }}>
              <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>
                {isEditing ? "Editar Transação" : "Nova Transação"}
              </h2>
              {isEditing && (
                <button
                  type="button"
                  onClick={resetForm}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    background: "#1A2340",
                    border: "1px solid #2D3A5C",
                    borderRadius: 8,
                    color: "#B8C4EA",
                    cursor: "pointer",
                    fontSize: 12,
                    fontWeight: 700,
                    padding: "8px 10px",
                  }}
                >
                  <X size={14} />
                  Cancelar
                </button>
              )}
            </div>

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
                    onChange={(tipo) => {
                        console.log(tipo);
                        setForm((prev) => ({ ...prev, tipo }))}}
                    getLabel={(option) => option.label}
                    getIcon={(option) => option.icon}
                    getColor={(option) => option.color}
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    background: submitting ? "#2D3A5C" : "#5A51D4",
                    color: "#fff",
                    border: "none",
                    borderRadius: 10,
                    padding: "10px 20px",
                    fontWeight: 600,
                    fontSize: 13,
                    cursor: submitting ? "not-allowed" : "pointer",
                    height: 40,
                    whiteSpace: "nowrap",
                  }}
                >
                  <Plus size={16} />
                  {submitting ? "Salvando..." : isEditing ? "Atualizar" : "Adicionar"}
                </button>
              </div>
            </form>
          </div>

          <div style={{
            background: "#141E35", borderRadius: 14, padding: 20,
            border: "1px solid #1E2A4A",
          }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              marginBottom: 16,
              flexWrap: "wrap",
            }}>
              <div>
                <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Histórico</h2>
                <div style={{ color: "#6B7DB3", fontSize: 12, marginTop: 4 }}>
                  {selectedIds.length} selecionada{selectedIds.length === 1 ? "" : "s"}
                </div>
              </div>
              <button
                type="button"
                onClick={handleDeleteSelected}
                disabled={selectedIds.length === 0 || deleting}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  background: selectedIds.length === 0 || deleting ? "#2D3A5C" : "#FF4757",
                  border: "none",
                  borderRadius: 10,
                  color: "#fff",
                  cursor: selectedIds.length === 0 || deleting ? "not-allowed" : "pointer",
                  fontSize: 13,
                  fontWeight: 700,
                  height: 38,
                  padding: "0 14px",
                  whiteSpace: "nowrap",
                }}
              >
                <Trash2 size={15} />
                {deleting ? "Excluindo..." : "Excluir selecionadas"}
              </button>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ color: "#6B7DB3", fontSize: 12 }}>
                    <th style={{ width: 36, textAlign: "center", padding: "6px 8px", fontWeight: 500 }}>
                        <label
                          style={{
                            width: 20,
                            height: 20,
                            borderRadius: "50%",
                            border: allSelected
                              ? "1px solid #5A51D4"
                              : "1px solid #2D3A5C",
                            background: allSelected
                              ? "#5A51D4"
                              : "#1A2340",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            transition: "all .2s ease",
                            boxShadow: allSelected
                              ? "0 0 12px rgba(90,81,212,.4)"
                              : "none",
                          }}
                        >
                      <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={toggleSelectAll}
                        disabled={loading || transacoes.length === 0}
                        aria-label="Selecionar todas as transações"
                        style={{ cursor: loading || transacoes.length === 0 ? "not-allowed" : "pointer", display: "none" }}
                      />  {allSelected && (
                             <Check
                               size={13}
                               color="#fff"
                               strokeWidth={3}
                             />
                           )}
                         </label>
                    </th>
                    <th style={{ textAlign: "left", padding: "6px 8px", fontWeight: 500 }}>Descrição</th>
                    <th style={{ textAlign: "center", padding: "6px 8px", fontWeight: 500 }}>Data</th>
                    <th style={{ textAlign: "center", padding: "6px 8px", fontWeight: 500 }}>Categoria</th>
                    <th style={{ textAlign: "center", padding: "6px 8px", fontWeight: 500 }}>Valor</th>
                    <th style={{ textAlign: "center", padding: "6px 8px", fontWeight: 500 }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={6} style={{ padding: "20px 8px", textAlign: "center", color: "#6B7DB3" }}>
                        Carregando transações...
                      </td>
                    </tr>
                  ) : transacoes.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ padding: "20px 8px", textAlign: "center", color: "#6B7DB3" }}>
                        Nenhuma transação registrada.
                      </td>
                    </tr>
                  ) : (
                    transacoes.map((tx) => {
                      const isReceita = tx.recdesp === 1;
                      const Icon = categoriaIcons[tx.categoria] || CircleDollarSign;
                      const isSelected = selectedIds.includes(tx.id);

                      return (
                        <tr
                          key={tx.id}
                          style={{
                            borderTop: "1px solid #1E2A4A",
                            background: isSelected ? "#1A234066" : "transparent",
                          }}
                        >
                          <td style={{ padding: "12px 8px", textAlign: "center" }}>
                            <label
                              style={{
                                width: 20,
                                height: 20,
                                borderRadius: "50%",
                                border: isSelected
                                  ? "1px solid #5A51D4"
                                  : "1px solid #2D3A5C",
                                background: isSelected
                                  ? "#5A51D4"
                                  : "#1A2340",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                transition: "all .2s ease",
                                boxShadow: isSelected
                                  ? "0 0 12px rgba(90,81,212,.4)"
                                  : "none",
                              }}
                            >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleSelectOne(tx.id)}
                              aria-label={`Selecionar transação ${tx.descricao || tx.id}`}
                              style={{ cursor: "pointer", display: "none" }}
                            /> {isSelected && (
                                <Check
                                  size={13}
                                  color="#fff"
                                  strokeWidth={3}
                                />
                              )}
                            </label>
                          </td>
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
                            {formatData(tx.data)}
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

                          <td style={{ padding: "12px 8px", textAlign: "center" }}>
                            <button
                              type="button"
                              onClick={() => handleEdit(tx)}
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 6,
                                background: editingId === tx.id ? "#5A51D4" : "#1A2340",
                                border: "1px solid #2D3A5C",
                                borderRadius: 8,
                                color: "#fff",
                                cursor: "pointer",
                                fontSize: 12,
                                fontWeight: 700,
                                padding: "8px 10px",
                                whiteSpace: "nowrap",
                              }}
                            >
                              <Pencil size={14} />
                              Editar
                            </button>
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
                background: "#64CFF622",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <PieChart size={18} color="#64CFF6" />
              </div>
              <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>Distribuição</h2>
            </div>
            <div style={{
              minHeight: 120,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: 8,
              color: "#6B7DB3",
              fontSize: 13,
              border: "1px dashed #1E2A4A",
              borderRadius: 12,
              padding: 16,
            }}>
              {(dashboard?.porCategoria || []).slice(0, 4).map((item) => (
                <div key={item.categoria} style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                  <span>{item.categoria}</span>
                  <strong style={{ color: "#64CFF6" }}>{formatMoeda(item.total)}</strong>
                </div>
              ))}
              {(!dashboard?.porCategoria || dashboard.porCategoria.length === 0) && (
                <span>Distribuição por categoria em breve.</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
