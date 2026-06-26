import React, { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  PiggyBank,
} from "lucide-react";

export default function AnalyticsPage() {
  const [period, setPeriod] = useState("30d");

  const kpis = [
    {
      title: "Receitas",
      value: "R$ 12.450",
      change: "+8,2%",
      icon: TrendingUp,
      color: "text-emerald-400",
    },
    {
      title: "Despesas",
      value: "R$ 8.960",
      change: "+5,4%",
      icon: TrendingDown,
      color: "text-red-400",
    },
    {
      title: "Saldo",
      value: "R$ 3.490",
      change: "+14%",
      icon: Wallet,
      color: "text-emerald-400",
    },
    {
      title: "Economia",
      value: "28%",
      change: "+3%",
      icon: PiggyBank,
      color: "text-emerald-400",
    },
  ];

  const months = [
    { m: "Jan", r: 4200, d: 3100 },
    { m: "Fev", r: 5000, d: 3900 },
    { m: "Mar", r: 4800, d: 3600 },
    { m: "Abr", r: 6100, d: 4200 },
    { m: "Mai", r: 5300, d: 4100 },
    { m: "Jun", r: 6500, d: 4500 },
  ];

  const pieData = [
    { label: "Alimentação", value: 35, color: "bg-emerald-400" },
    { label: "Transporte", value: 22, color: "bg-red-400" },
    { label: "Moradia", value: 28, color: "bg-blue-400" },
    { label: "Lazer", value: 10, color: "bg-yellow-400" },
    { label: "Outros", value: 5, color: "bg-purple-400" },
  ];

  const valueVariacao = 16;
  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 space-y-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="text-center translate-x-[350px]">
          <h1 className="text-2xl font-bold">Analytics</h1>
          <p className="text-slate-400">
            Veja como seu dinheiro evolui ao longo do tempo.
          </p>
        </div>

        <div className="flex gap-2 bg-slate-800 p-1 rounded-xl">
          {["7d", "30d", "90d", "12m"].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1 rounded-lg text-sm transition ${
                period === p ? "bg-emerald-500 text-black" : "text-slate-300"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* KPI CARDS */}
      {/* RESUMO DO MÊS */}
      <div className="bg-slate-800 rounded-2xl p-5">
        <h2 className="font-semibold mb-4">Resumo do Mês</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Maior gasto", value: "R$ 420", icon: "💸" },
            { label: "Média diária de gastos", value: "R$ 25", icon: "📊" },
            { label: "Dia mais caro", value: "15 Jun", icon: "📅" },
            { label: "Maior sequência sem gastar", value: "5 dias", icon: "🔥" },
            { label: "Gasto permitido/semanal", value: "R$ 420", icon: "🎯"},
            { label: "Maior categoria", value: "ALIMENTAÇÃO", icon: "🍔"},
            { label: "Variação vs mês passado", value: `${valueVariacao}%`, icon: valueVariacao >= 0 ? "📈" : "📉", color: valueVariacao >= 0 ? "text-emerald-400" : "text-red-400" },
            { label: "Transações", value: "128", icon: "🔁" }
          ].map((item, i) => (
            <div
              key={i}
              className="bg-slate-900 p-4 rounded-xl hover:bg-slate-700 transition"
            >
              <div className="text-xl">{item.icon}</div>
              <p className="text-slate-400 text-xs mt-2">{item.label}</p>
              <p className={`font-semibold ${item.color ?? "text-white"}`}>{item.value}</p>
            </div>
          ))}
        </div>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => {
          const Icon = kpi.icon;

          return (
            <div
              key={i}
              className="bg-slate-800 rounded-2xl p-5 hover:scale-[1.02] transition"
            >
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-sm">{kpi.title}</span>
                <Icon className="text-slate-300" size={18} />
              </div>

              <div className="text-xl font-bold mt-2">{kpi.value}</div>

              <div className={`text-sm mt-1 ${kpi.color}`}>
                {kpi.change}
              </div>
            </div>
          );
        })}
      </div>

      {/* GRÁFICOS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* PIE CHART FAKE */}
        <div className="bg-slate-800 rounded-2xl p-5">
          <h2 className="font-semibold mb-4">Despesas por Categoria</h2>

          <div className="flex items-center justify-between">
            {/* círculo fake */}
            <div className="relative w-40 h-40 rounded-full border-8 border-slate-700 overflow-hidden">
              {pieData.map((item, i) => (
                <div
                  key={i}
                  className={`absolute inset-0 ${item.color} opacity-80`}
                  style={{
                    clipPath: `conic-gradient(from 0deg, transparent ${i * 20}%, currentColor 0%)`,
                  }}
                />
              ))}
            </div>

            {/* legenda */}
            <div className="space-y-2">
              {pieData.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded ${item.color}`} />
                  <span className="text-sm text-slate-300">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* BAR CHART FAKE */}
        <div className="bg-slate-800 rounded-2xl p-5">
          <h2 className="font-semibold mb-4">Receitas vs Despesas</h2>

          <div className="flex items-end justify-between h-56 gap-2">
            {months.map((m, i) => (
              <div key={i} className="flex flex-col items-center gap-1 w-full">

                <div className="flex items-end gap-1 h-40">
                  <div
                    className="w-3 bg-emerald-400 rounded"
                    style={{ height: `${m.r / 60}px` }}
                  />
                  <div
                    className="w-3 bg-red-400 rounded"
                    style={{ height: `${m.d / 60}px` }}
                  />
                </div>

                <span className="text-xs text-slate-400">{m.m}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* INSIGHTS */}
      <div className="bg-slate-800 rounded-2xl p-5 space-y-4">
        <h2 className="font-semibold">Insights Financeiros</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              title: "Aumento em alimentação",
              desc: "Você gastou 18% mais com alimentação este mês.",
            },
            {
              title: "Crescimento de saldo",
              desc: "Seu saldo cresceu 14% comparado ao mês anterior.",
            },
            {
              title: "Redução em transporte",
              desc: "Você economizou R$120 em transporte.",
            },
            {
              title: "Boa performance",
              desc: "Você está economizando acima da média.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-slate-900 rounded-xl p-4 hover:bg-slate-700 transition"
            >
              <h3 className="font-semibold text-sm">{item.title}</h3>
              <p className="text-slate-400 text-sm mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

    {/* METAS */}
    <div className="bg-slate-800 rounded-2xl p-5 space-y-4">
      <h2 className="font-semibold">Metas Financeiras</h2>

      {[
        { name: "Reserva de Emergência", value: 62 },
        { name: "Viagem", value: 45 },
        { name: "Novo Notebook", value: 80 },
      ].map((goal, i) => (
        <div key={i} className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-300">{goal.name}</span>
            <span className="text-slate-400">{goal.value}%</span>
          </div>

          <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-emerald-400 rounded-full transition-all"
              style={{ width: `${goal.value}%` }}
            />
          </div>
        </div>
      ))}
    </div>

    {/* TOP CATEGORIAS */}
    <div className="bg-slate-800 rounded-2xl p-5">
      <h2 className="font-semibold mb-4">Top Categorias</h2>

      <div className="space-y-3">
        {[
          { name: "Alimentação", value: "R$ 1.850", status: "Alta", color: "text-red-400" },
          { name: "Transporte", value: "R$ 920", status: "Baixa", color: "text-emerald-400" },
          { name: "Moradia", value: "R$ 2.900", status: "Estável", color: "text-slate-300" },
          { name: "Lazer", value: "R$ 710", status: "Alta", color: "text-red-400" },
        ].map((item, i) => (
          <div
            key={i}
            className="flex items-center justify-between bg-slate-900 p-3 rounded-xl"
          >
            <div>
              <p className="text-sm font-medium">{item.name}</p>
              <p className="text-xs text-slate-400">{item.value}</p>
            </div>

            <span className={`text-sm font-semibold ${item.color}`}>
              {item.status}
            </span>
          </div>
        ))}
      </div>
    </div>



    </div>
  );
}