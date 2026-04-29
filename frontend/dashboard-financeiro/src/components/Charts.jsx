// src/components/Charts.jsx
import React from 'react';
import {
    LineChart, Line, BarChart, Bar, PieChart, Pie, AreaChart, Area,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';

/**
 * Gráfico de Linha com animações
 */
export const ChartLinha = ({ data, titulo, dataKey, cor = '#3b82f6' }) => (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
            <div className="w-1 h-6 bg-gradient-to-b from-emerald-500 to-blue-500 rounded-full mr-3"></div>
            {titulo}
        </h3>
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                    contentStyle={{
                        backgroundColor: '#1e293b',
                        border: '1px solid #475569',
                        borderRadius: '8px',
                        color: '#fff'
                    }}
                />
                <Legend />
                <Line
                    type="monotone"
                    dataKey={dataKey}
                    stroke={cor}
                    strokeWidth={2}
                    dot={{ fill: cor, r: 4 }}
                    activeDot={{ r: 6 }}
                />
            </LineChart>
        </ResponsiveContainer>
    </div>
);

/**
 * Gráfico de Barras
 */
export const ChartBarra = ({ data, titulo, dataKey, cor = '#10b981' }) => (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
        <h3 className="text-lg font-bold text-slate-800 mb-6">{titulo}</h3>
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                    contentStyle={{
                        backgroundColor: '#1e293b',
                        border: '1px solid #475569',
                        borderRadius: '8px',
                        color: '#fff'
                    }}
                />
                <Bar dataKey={dataKey} fill={cor} radius={[8, 8, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    </div>
);

/**
 * Gráfico de Pizza/Donut
 */
export const ChartPizza = ({ data, titulo, cores }) => (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
        <h3 className="text-lg font-bold text-slate-800 mb-6">{titulo}</h3>
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={cores[index % cores.length]} />
                    ))}
                </Pie>
                <Tooltip
                    contentStyle={{
                        backgroundColor: '#1e293b',
                        border: '1px solid #475569',
                        borderRadius: '8px',
                        color: '#fff'
                    }}
                />
            </PieChart>
        </ResponsiveContainer>
    </div>
);

/**
 * Gráfico de Área
 */
export const ChartArea = ({ data, titulo, dataKey, cor = '#3b82f6' }) => (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
        <h3 className="text-lg font-bold text-slate-800 mb-6">{titulo}</h3>
        <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                <defs>
                    <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={cor} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={cor} stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                    contentStyle={{
                        backgroundColor: '#1e293b',
                        border: '1px solid #475569',
                        borderRadius: '8px',
                        color: '#fff'
                    }}
                />
                <Area
                    type="monotone"
                    dataKey={dataKey}
                    stroke={cor}
                    fillOpacity={1}
                    fill="url(#colorArea)"
                    strokeWidth={2}
                />
            </AreaChart>
        </ResponsiveContainer>
    </div>
);

// ============================================================
// CARDS
// ============================================================

// src/components/Cards.jsx

/**
 * Card de Estatística KPI
 */
export const CardKPI = ({ titulo, valor, icon: Icon, cor, subtitulo }) => (
    <div className={`bg-gradient-to-br ${cor} rounded-2xl p-6 text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1`}>
        <div className="flex items-start justify-between mb-4">
            <div>
                <p className="text-sm opacity-80 font-medium tracking-wide uppercase">{titulo}</p>
                <p className="text-3xl font-bold mt-2">{valor}</p>
                {subtitulo && <p className="text-xs opacity-70 mt-1">{subtitulo}</p>}
            </div>
            <div className="p-3 bg-white bg-opacity-20 rounded-xl">
                <Icon className="w-6 h-6" />
            </div>
        </div>
    </div>
);

/**
 * Card de Categoria
 */
export const CardCategoria = ({ nome, valor, quantidade, percentual, cor }) => (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 hover:shadow-xl transition-all">
        <div className="flex items-center mb-4">
            <div className="w-4 h-4 rounded-full mr-3" style={{ backgroundColor: cor }} />
            <h3 className="font-bold text-slate-800">{nome}</h3>
        </div>
        <p className="text-2xl font-bold text-slate-900 mb-2">{valor}</p>
        <div className="flex justify-between text-xs text-slate-600 mb-3">
            <span>{quantidade} transações</span>
            <span>{percentual.toFixed(1)}% do total</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
            <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                    backgroundColor: cor,
                    width: `${percentual}%`
                }}
            />
        </div>
    </div>
);

/**
 * Card de Recomendação
 */
export const CardRecomendacao = ({ titulo, descricao, tipo, impacto }) => {
    const estilos = {
        'ALERTA': { border: 'border-l-4 border-red-500', bg: 'bg-red-50', icone: '⚠️' },
        'OPORTUNIDADE': { border: 'border-l-4 border-blue-500', bg: 'bg-blue-50', icone: '💡' },
        'ECONOMIA': { border: 'border-l-4 border-green-500', bg: 'bg-green-50', icone: '💰' }
    };

    const estilo = estilos[tipo];

    return (
        <div className={`p-4 rounded-xl ${estilo.border} ${estilo.bg} hover:shadow-md transition-all`}>
            <div className="flex items-start">
                <span className="text-2xl mr-3">{estilo.icone}</span>
                <div className="flex-1">
                    <p className="font-semibold text-slate-800">{titulo}</p>
                    <p className="text-sm text-slate-600 mt-1">{descricao}</p>
                    {impacto > 0 && (
                        <p className="text-xs font-semibold text-slate-700 mt-2">
                            💵 Economia potencial: {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                        }).format(impacto)}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

/**
 * Card de Progresso
 */
export const CardProgresso = ({ titulo, atual, meta, cor = 'bg-blue-500' }) => {
    const percentual = (atual / meta) * 100;
    const atingida = atual >= meta;

    return (
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-slate-800">{titulo}</h3>
                <span className={`text-sm font-semibold ${atingida ? 'text-green-600' : 'text-orange-600'}`}>
          {atingida ? '✓ Atingida' : 'Em progresso'}
        </span>
            </div>
            <div className="mb-3">
                <div className="flex justify-between text-sm text-slate-600 mb-2">
                    <span>Atual: R$ {atual.toFixed(2)}</span>
                    <span>Meta: R$ {meta.toFixed(2)}</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                    <div
                        className={`h-full ${cor} rounded-full transition-all duration-500`}
                        style={{ width: `${Math.min(percentual, 100)}%` }}
                    />
                </div>
            </div>
            <p className="text-xs text-slate-600">
                {percentual.toFixed(1)}% da meta
            </p>
        </div>
    );
};

// ============================================================
// UTILITÁRIOS
// ============================================================

/**
 * Formatador de moeda
 */
export const formatMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(valor || 0);
};

/**
 * Formatador de data
 */
export const formatData = (data) => {
    return new Intl.DateTimeFormat('pt-BR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(new Date(data));
};

/**
 * Componente de carregamento
 */
export const LoadingSpinner = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-emerald-400 mx-auto mb-4"></div>
            <p className="text-emerald-400 font-semibold text-lg">Carregando Dashboard...</p>
        </div>
    </div>
);

/**
 * Componente de erro
 */
export const ErrorDisplay = ({ mensagem, onRetry }) => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="bg-red-50 border-2 border-red-500 rounded-2xl p-8 max-w-md">
            <h2 className="text-2xl font-bold text-red-800 mb-2">⚠️ Erro</h2>
            <p className="text-red-700 mb-6">{mensagem}</p>
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 font-semibold transition-all"
                >
                    Tentar novamente
                </button>
            )}
        </div>
    </div>
);

/**
 * Badge de status
 */
export const BadgeStatus = ({ status, label }) => {
    const cores = {
        'sucesso': 'bg-green-100 text-green-800',
        'aviso': 'bg-yellow-100 text-yellow-800',
        'erro': 'bg-red-100 text-red-800',
        'info': 'bg-blue-100 text-blue-800'
    };

    return (
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${cores[status]}`}>
      {label}
    </span>
    );
};