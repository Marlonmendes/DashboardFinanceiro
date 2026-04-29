import React, {useState, useEffect} from "react";
import {
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from "recharts";
import {TrendingUp, TrendingDown, AlertCircle, Award, Target, Zap} from "lucide-react";

const DashboardFinanceiro = () => {
    const [usuarioId] = useState(1); //Substituir por ID real
    const [dashboard, setDashboard] = useState(null);
    const [tendencias, setTendencias] = useState(null);
    const [categorias, setCategorias] = useState();
    const [recomendacoes, setRecomendacoes] = useState(null);
    const [score, setScore] = useState(null);
    const [loading, setLoading] = useState(null);
    const [transacoes, setTransacoes] = useState([]);
    const [aba, setAba] = useState('visao-geral');
    const [dataFiltro, setDataFiltro] = useState("");
    const [categoriaFiltro, setCategoriaFiltro] = useState("");
    const [darkMode, setDarkMode] = useState(false);
    const [modalAberto, setModalAberto] = useState(false);
    const [modalExcluirAberto, setModalExcluirAberto] = useState(false);
    const [selecionadas, setSelecionadas] = useState([]);
    const scrollRef = React.useRef(null);
    const [modalEditarAberto, setModalEditarAberto] = useState(false);
    const [transacaoEditando, setTransacaoEditando] = useState(null);
    const [paginaAtual, setPaginaAtual] = useState(1);
    const itensPorPagina = 10;
    const [categoriasFiltro, setCategoriasFiltro] = useState("");


    const COLORS = [
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
        '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B88B', '#A9DFBF'
    ];

    useEffect(() => {
        fetchDados();
    }, []);

    useEffect(() => {
        setPaginaAtual(1);
    }, [dataFiltro, categoriaFiltro]);

    useEffect(() => {
        setPaginaAtual(1);
    }, [dataFiltro, categoriaFiltro, categoriasFiltro]);

    const fetchDados = async () => {
        try{
            setLoading(true);

            const [dashboardRes, tendenciasRes, categoriasRes, recomendacoesRes, scoreRes, transacoesRes] = await Promise.all([
                fetch(`http://localhost:8080/api/analytics/dashboard/${usuarioId}`),
                fetch(`http://localhost:8080/api/analytics/tendencia/${usuarioId}/2026`),
                fetch(`http://localhost:8080/api/analytics/categoria/${usuarioId}`),
                fetch(`http://localhost:8080/api/analytics/recomendacoes/${usuarioId}`),
                fetch(`http://localhost:8080/api/analytics/score/${usuarioId}`),
                fetch(`http://localhost:8080/api/financeiro?usuarioId=${usuarioId}`)
            ]);

            const dashboardData = await dashboardRes.json();
            const tendenciasData = await tendenciasRes.json();
            const categoriasData = await categoriasRes.json();
            const recomendacoesData = await recomendacoesRes.json();
            const scoreData = await scoreRes.json();
            const transacoesData = await transacoesRes.json();

            setDashboard(dashboardData);
            setTendencias(tendenciasData);
            setCategorias(categoriasData);
            setRecomendacoes(recomendacoesData);
            setScore(scoreData);
            setTransacoes(transacoesData.content);
        } catch (error){
            console.error('Erro ao buscar dados:', error);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-emerald-400 mx-auto mb-4"></div>
                    <p className="text-emerald-400 font-semibold text-lg">Carregando Dashboard...</p>
                </div>
            </div>
        );
    }

    const formatMoeda = (valor) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor || 0);
    };

    //COMPONENTES
    const KPICard = ({ titulo, valor, icone: Icone, cor, subtitulo, tendencia }) => (
        <div className={`bg-gradient-to-br ${cor} rounded-2xl p-6 text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1`}>
            <div className="flex items-start justify-between mb-4">
                <div>
                    <p className="text-sm opacity-80 font-medium tracking-wide uppercase">{titulo}</p>
                    <p className="text-3xl font-bold mt-2">{valor}</p>
                    {subtitulo && <p className="text-xs opacity-70 mt-1">{subtitulo}</p>}
                </div>
                <div className="p-3 bg-white  bg-opacity-20 rounded-xl">
                    <Icone className="w-6 h-6" />
                </div>
            </div>
            {tendencia && (
                <div className={`flex items-center text-xs font-semibold ${tendencia > 0 ? 'text-red-200' : 'text-green-200'}`}>
                    {tendencia > 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                    {Math.abs(tendencia)}% vs mês anterior
                </div>
            )}
        </div>
    );

    const GraficoCard = ({ titulo, children, fullWidth = false }) => (
        <div className={`bg-white  rounded-2xl p-6 shadow-lg border border-slate-100 ${fullWidth ? 'col-span-full' : ''}`}>
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
                <div className="w-1 h-6 bg-gradient-to-b from-emerald-500 to-blue-500 rounded-full mr-3"></div>
                {titulo}
            </h3>
            {children}
        </div>
    );

    const RecomendacaoCard = ({ titulo, descricao, tipo, impacto }) => {
        const cores = {
            'ALERTA': 'border-l-4 border-red-500 bg-red-50',
            'OPORTUNIDADE': 'border-l-4 border-blue-500 bg-blue-50',
            'ECONOMIA': 'border-l-4 border-green-500 bg-green-50'
        };

        return (
            <div className={`p-4 rounded-xl ${cores[tipo]} hover:shadow-md transition-all`}>
                <div className="flex items-start">
                    <AlertCircle className={`w-5 h-5 mr-3 mt-0.5 flex-shrink-0 ${
                        tipo === 'ALERTA' ? 'text-red-600' :
                            tipo === 'OPORTUNIDADE' ? 'text-blue-600' :
                                'text-green-600'
                    }`} />
                    <div className="flex-1">
                        <p className="font-semibold text-slate-800">{titulo}</p>
                        <p className="text-sm text-slate-600 mt-1">{descricao}</p>
                        {impacto && (
                            <p className="text-xs font-semibold text-slate-700 mt-2">
                                💰 Economia potencial: {formatMoeda(impacto)}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    //ABAS
    const renderVisaoGeral = () => (
        <>
            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <KPICard
                    titulo="Total do Mês"
                    valor={formatMoeda(dashboard?.totalMensal)}
                    icone={TrendingUp}
                    cor="from-blue-600 to-blue-700"
                    tendencia={-5}
                />
                <KPICard
                    titulo="Maior Categoria"
                    valor={dashboard?.maiorCategoria || 'N/A'}
                    icone={Target}
                    cor="from-purple-600 to-purple-700"
                    subtitulo={dashboard?.porCategoria?.[0]?.total ? formatMoeda(dashboard.porCategoria[0].total) : ''}
                />
                <KPICard
                    titulo="Economia Potencial"
                    valor={formatMoeda(dashboard?.economiaTotal)}
                    icone={Zap}
                    cor="from-green-600 to-green-700"
                />
                <KPICard
                    titulo="Score Financeiro"
                    valor={`${score?.score || 0}/100`}
                    icone={Award}
                    cor="from-amber-600 to-amber-700"
                    subtitulo={score?.nivel || 'Calculando...'}
                />
            </div>
            {/* Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Gráfico de Tendência */}
                <GraficoCard titulo="Tendência de Gastos - 2026">
                    {tendencias && (
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={tendencias}>
                                <defs>
                                    <linearGradient id="colorTendencia" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis dataKey="nomeMes" stroke="#94a3b8" />
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
                                    dataKey="total"
                                    stroke="#3b82f6"
                                    fillOpacity={1}
                                    fill="url(#colorTendencia)"
                                    strokeWidth={2}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    )}
                </GraficoCard>

                {/* Gráfico de Pizza - Categorias */}
                <GraficoCard titulo="Distribuição por Categoria">
                    {categorias && (
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={categorias}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ categoria, percentualDoTotal }) => `${categoria}: ${percentualDoTotal.toFixed(1)}%`}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="total"
                                >
                                    {categorias.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#1e293b',
                                        border: '1px solid #475569',
                                        borderRadius: '8px',
                                        color: '#fff'
                                    }}
                                    formatter={(value, name, props) => [
                                        formatMoeda(value),
                                        props.payload.categoria
                                    ]}

                                />
                            </PieChart>
                        </ResponsiveContainer>
                    )}
                </GraficoCard>
            </div>

            {/* Gráfico de Necessário vs Opcional */}
            <GraficoCard titulo="Necessário vs Opcional" fullWidth={true}>
                {dashboard?.gastoNecessario && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={dashboard.gastoNecessario}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis dataKey="tipo" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#1e293b',
                                        border: '1px solid #475569',
                                        borderRadius: '8px',
                                        color: '#fff'
                                    }}
                                    formatter={(value) => formatMoeda(value)}
                                />
                                <Bar dataKey="total" fill="#10b981" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>

                        {/* Tabela Comparativa */}
                        <div className="space-y-4">
                            {dashboard.gastoNecessario.map((item, idx) => (
                                <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                    <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-slate-800">
                      {item.tipo === 'SIM' ? '✓ Necessário' : '✕ Opcional'}
                    </span>
                                        <span className="text-lg font-bold text-blue-600">{formatMoeda(item.total)}</span>
                                    </div>
                                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                                        <div
                                            className={`h-full ${item.tipo === 'SIM' ? 'bg-green-500' : 'bg-orange-500'}`}
                                            style={{ width: `${item.percentual}%` }}
                                        />
                                    </div>
                                    <p className="text-xs text-slate-600 mt-2">
                                        {item.quantidade} transações ({item.percentual.toFixed(1)}% do total)
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </GraficoCard>
        </>
    );

    //Barra de Açoes da aba Transaçoes
    const BarraAcoes = ({ onCategoria, onFiltrarData, onCriar, onExcluir }) => {
        return (
            <div className="bg-white  p-4 rounded-2xl shadow border border-slate-100 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">

                <div className="flex flex-col">
                    <label className="text-sm font-semibold text-slate-700 mb-1">
                        Filtrar por Data
                    </label>
                    <div className="flex items-center gap-3">
                        <input
                            type="date"
                            value={dataFiltro}
                            onChange={(e) => onFiltrarData(e.target.value)}
                            className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                        />
                    </div>
                </div>

                <div className="flex flex-col">
                    <label className="text-sm font-semibold text-slate-700 mb-1">
                        Necessario?
                    </label>

                    <div className="flex items-center gap-3">
                        <select
                            name="filtroCategoria"
                            value={categoriaFiltro}
                            onChange={(e) => onCategoria(e.target.value)}
                            className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                        >
                            <option value="">---</option>
                            <option value="SIM">Sim</option>
                            <option value="NAO">Não</option>
                        </select>
                    </div>
                </div>

                <div className="flex flex-col mr-auto">
                    <label className="text-sm font-semibold text-slate-700 mb-2">
                        Categorias
                    </label>

                    <div className="flex gap-2 flex-wrap">
                        {["ALIMENTACAO", "TRANSPORTE", "SAUDE", "LAZER", "MORADIA", "OUTROS"].map(cat => (
                            <button
                                key={cat}
                                onClick={() => {
                                    setCategoriasFiltro(prev =>
                                        prev.includes(cat)
                                            ? prev.filter(c => c !== cat)
                                            : [...prev, cat]
                                    );
                                }}
                                className={`px-3 py-1 rounded-full text-sm ${
                                    categoriasFiltro.includes(cat)
                                        ? "bg-emerald-500 text-white"
                                        : "bg-slate-200"
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mt-4 bg-white p-4 rounded-xl shadow border border-slate-100 flex justify-between items-center">

                    <div>
                        <p className="text-xs text-slate-500 mr-5">Resultado</p>
                        <p className="text-sm font-semibold text-slate-700 mr-5">
                            {transacoesFiltradas.length} transações
                        </p>
                    </div>

                    <div className="text-right">
                        <p className="text-xs text-slate-500">Total</p>
                        <p className={`text-xl font-bold ${
                            totalFiltrado > 0 ? "text-red-500" : "text-green-500"
                        }`}>
                            {formatMoeda(totalFiltrado)}
                        </p>
                    </div>

                </div>

                <div className="flex gap-3">
                    <button
                        onClick={onCriar}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
                    >
                        ➕ Nova
                    </button>

                    <button
                        onClick={onExcluir}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
                    >
                        🗑️ Excluir
                    </button>
                </div>

            </div>
        );
    };

    const transacoesFiltradasPorCategoria2 = transacoes.filter(item => {
        if (categoriasFiltro.length === 0) return true;

        return categoriasFiltro.includes(item.categoria);
    })

    const transacoesFiltradasPorCategoria = transacoesFiltradasPorCategoria2.filter(item => {
        if(!categoriaFiltro) return true;

        const categoriaItem = item.necessario;

        return categoriaItem === categoriaFiltro;
    })

    const abrirEdicao = (transacao) => {
        setTransacaoEditando(transacao);
        setModalEditarAberto(true);
    };

    //Filtra as transaçoes pelo dataFiltro
    const transacoesFiltradas = transacoesFiltradasPorCategoria.filter(item => {
        if (!dataFiltro) return true;

        const dataItem = new Date(item.data).toISOString().split("T")[0];

        return dataItem === dataFiltro;
    });

    const totalFiltrado = transacoesFiltradas.reduce(
        (acc, t) => acc + t.valor,
        0
    );

    const indexInicio = (paginaAtual - 1) * itensPorPagina;
    const indexFim = indexInicio + itensPorPagina;
    const transacoesPaginadas = transacoesFiltradas.slice(indexInicio, indexFim);

    const totalPaginas = Math.ceil(transacoesFiltradas.length / itensPorPagina);

    const renderTransacoes = () => (
        <div className="space-y-4">
            {Array.isArray(transacoesPaginadas) && transacoesPaginadas.length > 0 ? (
                transacoesPaginadas.map((item) => {
                    const isDespesa = item.recdesp === -1;
                    return (
                        <div
                            key={item.id}
                            className="bg-white  p-4 rounded-2xl shadow border border-slate-100 flex items-center justify-between hover:shadow-md transition-all"
                        >
                            {/* LADO ESQUERDO */}
                            <div className="flex items-center gap-2">
                                {/* Ícone / Bolinha */}
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                                        isDespesa ? "bg-red-500" : "bg-green-500"
                                    }`}
                                >
                                    {item.categoria?.[0]}
                                </div>

                                {/* Infos */}
                                <div className="flex flex-col items-start">
                                    <p className="font-semibold text-slate-800">
                                        {item.descricao}
                                    </p>

                                    <p className="text-sm text-slate-500">
                                        {item.categoria} • {new Date(item.data).toLocaleDateString("pt-BR")}
                                    </p>

                                    <span
                                        className={`text-xs font-semibold px-2 py-1 rounded-full mt-1 ${
                                            item.necessario === "SIM"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-orange-100 text-orange-700"
                                        }`}
                                    >
                                        {item.necessario === "SIM" ? "Necessário" : "Não necessário"}
                                    </span>
                                </div>
                            </div>

                            {/* LADO DIREITO (VALOR) */}
                            <div className="text-right flex flex-col items-end gap-2">
                                <p
                                    className={`text-lg font-bold ${
                                        isDespesa ? "text-red-500" : "text-green-500"
                                    }`}
                                >
                                    {isDespesa ? "-" : "+"} {formatMoeda(item.valor)}
                                </p>

                                <button
                                    onClick={() => abrirEdicao(item)}
                                    className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg"
                                >
                                    ✏️ Editar
                                </button>
                            </div>
                        </div>

                    );
                })
            ) : (
                <div className="text-center py-8 text-slate-500">
                    <Zap className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Nenhuma transação no momento!</p>
                </div>
            )}
            <div className="flex justify-center items-center gap-2 mt-6">

                <button
                    onClick={() => setPaginaAtual(p => Math.max(p - 1, 1))}
                    disabled={paginaAtual === 1}
                    className="px-3 py-1 bg-slate-200 rounded disabled:opacity-50"
                >
                    ⬅️
                </button>

                {[...Array(totalPaginas)].map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setPaginaAtual(i + 1)}
                        className={`px-3 py-1 rounded ${
                            paginaAtual === i + 1
                                ? "bg-emerald-500 text-white"
                                : "bg-slate-200"
                        }`}
                    >
                        {i + 1}
                    </button>
                ))}

                <button
                    onClick={() => setPaginaAtual(p => Math.min(p + 1, totalPaginas))}
                    disabled={paginaAtual === totalPaginas}
                    className="px-3 py-1 bg-slate-200 rounded disabled:opacity-50"
                >
                    ➡️
                </button>

            </div>
        </div>
    );



    const ModalEditarTransacao = ({ aberto, onClose, onSalvar, transacao }) => {
        const [form, setForm] = useState(transacao || {});

        useEffect(() => {
            setForm(transacao || {});
        }, [transacao]);

        if (!aberto) return null;

        const handleChange = (e) => {
            const { name, value } = e.target;
            setForm(prev => ({ ...prev, [name]: value }));
        };

        const handleSubmit = () => {
            onSalvar(form);
            onClose();
        };

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-2xl w-full max-w-md">
                    <h2 className="text-xl font-bold mb-4">Editar Transação</h2>

                    <div className="space-y-3">
                        <input
                            name="descricao"
                            value={form.descricao || ""}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                        />

                        <input
                            name="valor"
                            type="number"
                            value={form.valor || ""}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                        />

                        <select
                            name="necessario"
                            value={form.necessario || "NAO"}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                        >
                            <option value="SIM">Necessário</option>
                            <option value="NAO">Não necessário</option>
                        </select>
                    </div>

                    <div className="flex justify-end gap-2 mt-4">
                        <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
                            Cancelar
                        </button>
                        <button onClick={handleSubmit} className="px-4 py-2 bg-blue-500 text-white rounded">
                            Salvar
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const editarTransacao = async (transacaoAtualizada) => {
        try {
            const response = await fetch(`http://localhost:8080/api/financeiro/${transacaoAtualizada.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(transacaoAtualizada)
            });

            if (!response.ok) throw new Error("Erro ao editar");

            const data = await response.json();

            setTransacoes(prev =>
                prev.map(t => (t.id === data.id ? data : t))
            );

        } catch (error) {
            console.error(error);
        }
    };

    const renderRecomendacoes = () => (
        <div className="space-y-4">
            {recomendacoes && recomendacoes.length > 0 ? (
                recomendacoes.map((rec, idx) => (
                    <RecomendacaoCard
                        key={idx}
                        titulo={rec.titulo}
                        descricao={rec.descricao}
                        tipo={rec.tipo}
                        impacto={rec.impactoFinanceiro}
                    />
                ))
            ) : (
                <div className="text-center py-8 text-slate-500">
                    <Zap className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Nenhuma recomendação no momento!</p>
                </div>
            )}
        </div>
    );

    const renderCategorias = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categorias && categorias.map((cat, idx) => (
                <div key={idx} className="bg-white  rounded-2xl p-6 shadow-lg border border-slate-100 hover:shadow-xl transition-all">
                    <div className="flex items-center mb-4">
                        <div
                            className="w-4 h-4 rounded-full mr-3"
                            style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                        />
                        <h3 className="font-bold text-slate-800">{cat.categoria}</h3>
                    </div>
                    <p className="text-2xl font-bold text-slate-900 mb-2">{formatMoeda(cat.total)}</p>
                    <div className="flex justify-between text-xs text-slate-600 mb-3">
                        <span>{cat.quantidade} transações</span>
                        <span>{cat.percentualDoTotal.toFixed(1)}% do total</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                        <div
                            className="h-full rounded-full"
                            style={{
                                backgroundColor: COLORS[idx % COLORS.length],
                                width: `${cat.percentualDoTotal}%`
                            }}
                        />
                    </div>
                </div>
            ))}
        </div>
    );

    const ModalNovaTransacao = ({ aberto, onClose, onSalvar }) => {
        const [form, setForm] = useState({
            descricao: "",
            valor: "",
            categoria: "ALIMENTACAO",
            data: "",
            recdesp: -1,
            necessario: "SIM"
        });

        if (!aberto) return null;

        const handleChange = (e) => {
            const { name, value } = e.target;
            setForm(prev => ({ ...prev, [name]: value }));
        };

        const handleSubmit = () => {
            onSalvar(form);
            onClose();
        };

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl w-full max-w-md shadow-xl">
                    <h2 className="text-xl font-bold mb-4 dark:text-white">
                        Nova Transação
                    </h2>

                    <div className="space-y-3">
                        <input
                            name="descricao"
                            placeholder="Descrição"
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                        />

                        <input
                            name="valor"
                            type="number"
                            placeholder="Valor"
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                        />

                        <select
                            name="categoria"
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                        >
                            <option value={"ALIMENTACAO"}>Alimentação</option>
                            <option value={"TRANSPORTE"}>Transporte</option>
                            <option value={"SAUDE"}>Saude</option>
                            <option value={"LAZER"}>Lazer</option>
                            <option value={"MORADIA"}>Moradia</option>
                            <option value={"OUTROS"}>Outros</option>
                        </select>

                        <input
                            name="data"
                            type="date"
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                        />

                        <select
                            name="recdesp"
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                        >
                            <option value={-1}>Despesa</option>
                            <option value={1}>Receita</option>
                        </select>

                        <select
                            name="necessario"
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                            >
                            <option value={"SIM"}>Necessario</option>
                            <option value={"NAO"}>Não Necessario</option>

                        </select>
                    </div>

                    <div className="flex justify-end gap-2 mt-4">
                        <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
                            Cancelar
                        </button>
                        <button onClick={handleSubmit} className="px-4 py-2 bg-green-500 text-white rounded">
                            Salvar
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const salvarTransacao = async (novaTransacao) => {
        try {
            const response = await fetch("http://localhost:8080/api/financeiro", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    ...novaTransacao,
                    usuarioId
                })
            });

            if (!response.ok) throw new Error("Erro ao salvar");

            const data = await response.json();

            // Atualiza lista na tela
            setTransacoes(prev => [data, ...prev]);

        } catch (error) {
            console.error(error);
        }
    };

    const ModalExcluirTransacoes = ({
                                        aberto,
                                        onClose,
                                        transacoes,
                                        selecionadas,
                                        toggleSelecionado, // 👈 usa direto
                                        selecionarTodos,
                                        onConfirmar
                                    }) => {
        if (!aberto) return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-2xl w-full max-w-2xl shadow-xl">

                    <h2 className="text-xl font-bold mb-4">
                        Excluir Transações
                    </h2>

                    <div className="flex items-center gap-2 mb-4">
                        <input
                            type="checkbox"
                            checked={selecionadas.length === transacoes.length && transacoes.length > 0}
                            onChange={selecionarTodos}
                        />
                        <span className="font-semibold">Selecionar todos</span>
                    </div>

                    <div ref={scrollRef} className="max-h-[60vh] overflow-y-auto">
                        {transacoes.map((t) => (
                            <ItemTransacao
                                key={t.id}
                                t={t}
                                selecionadas={selecionadas}
                                toggleSelecionado={toggleSelecionado} // 👈 usa o que veio de fora
                            />
                        ))}
                    </div>

                    <div className="flex justify-end gap-2 mt-4">
                        <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
                            Cancelar
                        </button>

                        <button
                            onClick={onConfirmar}
                            className="px-4 py-2 bg-red-500 text-white rounded"
                            disabled={selecionadas.length === 0}
                        >
                            Excluir ({selecionadas.length})
                        </button>


                    </div>
                </div>
            </div>
        );
    };

    const ItemTransacao = React.memo(({ t, selecionadas, toggleSelecionado }) => {
        return (
            <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                    <input
                        type="checkbox"
                        checked={selecionadas.includes(t.id)}
                        onChange={() => toggleSelecionado(t.id)}
                    />
                    <div>
                        <p className="font-semibold">{t.descricao}</p>
                        <p className="text-sm text-slate-500">
                            {t.categoria} • {new Date(t.data).toLocaleDateString("pt-BR")}
                        </p>
                    </div>
                </div>
                <p className="font-bold">R$ {t.valor}</p>
            </div>
        );
    });

    const excluirTransacoes = async () => {
        try {
            await fetch("http://localhost:8080/api/financeiro/lote", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(selecionadas)
            });

            // Atualiza lista local
            setTransacoes(prev =>
                prev.filter(t => !selecionadas.includes(t.id))
            );

            setSelecionadas([]);
            setModalExcluirAberto(false);

        } catch (error) {
            console.error(error);
        }
    };
    const selecionarTodos = () => {
        if (selecionadas.length === transacoes.length) {
            // Desmarca tudo
            setSelecionadas([]);
        } else {
            // Marca tudo
            setSelecionadas(transacoes.map(t => t.id));
        }
    };
    const toggleSelecionado = (id) => {
        const scrollTop = scrollRef.current?.scrollTop;

        setSelecionadas(prev =>
            prev.includes(id)
                ? prev.filter(i => i !== id)
                : [...prev, id]
        );

        setTimeout(() => {
            if (scrollRef.current) {
                scrollRef.current.scrollTop = scrollTop;
            }
        }, 0);
    };

    //RENDER PRINCIPAL
    return (
        <div className={darkMode
            ? "dark min-h-screen bg-slate-900"
            : "min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50"
        }>
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white py-8 px-4 md:px-8">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-4xl font-bold mb-2">💰 Dashboard Financeiro</h1>
                    <p className="text-blue-200">Análises profundas de suas finanças pessoais</p>
                </div>
            </div>

            {/* Navegação */}
            <div className= "bg-white border-b border-slate-200 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="flex gap-8 overflow-x-auto items-center">
                        {[
                            { id: 'visao-geral', label: '📊 Visão Geral', icon: '📊' },
                            { id: 'gestao', label: '💼 Gestão Financeira', icon: '💼' },
                            { id: 'recomendacoes', label: '💡 Recomendações', icon: '💡' },
                            { id: 'transacoes', label: '💸 Transações', icon: '💸'}
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setAba(tab.id)}
                                className={`py-4 px-1 font-semibold text-sm border-b-2 transition-all whitespace-nowrap ${
                                    aba === tab.id
                                        ? 'border-emerald-500 text-emerald-600'
                                        : 'border-transparent text-slate-600 hover:text-slate-800'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            className="ml-auto bg-slate-200 px-3 py-2 rounded-lg text-sm font-semibold"
                        >
                            {darkMode ? "☀️ Claro" : "🌙 Escuro"}
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
                {aba === 'visao-geral' && renderVisaoGeral()}
                {aba === 'gestao' && renderCategorias()}
                {aba === 'recomendacoes' && renderRecomendacoes()}
                {aba === 'transacoes' && (
                    <>
                    <BarraAcoes
                        onFiltrarData={setDataFiltro}
                        onCategoria={setCategoriaFiltro}
                        onCriar={() => setModalAberto(true)}
                        onExcluir={() => setModalExcluirAberto(true)}
                    />
                    <div className="mt-4">
                        {renderTransacoes()}
                    </div>
                        <ModalNovaTransacao
                            aberto={modalAberto}
                            onClose={() => setModalAberto(false)}
                            onSalvar={salvarTransacao}
                        />

                        <ModalExcluirTransacoes
                            aberto={modalExcluirAberto}
                            onClose={() => setModalExcluirAberto(false)}
                            transacoes={transacoes}
                            selecionadas={selecionadas}
                            onConfirmar={excluirTransacoes}
                            toggleSelecionado={toggleSelecionado}
                            selecionarTodos={selecionarTodos}
                        />

                        <ModalEditarTransacao
                            aberto={modalEditarAberto}
                            onClose={() => setModalEditarAberto(false)}
                            onSalvar={editarTransacao}
                            transacao={transacaoEditando}
                        />
                    </>
                    )
                }
            </div>

            {/* Footer */}
            <div className="bg-slate-900 text-white py-8 mt-12 border-t border-slate-700">
                <div className="max-w-7xl mx-auto px-4 md:px-8 text-center text-sm text-slate-400">
                    <p>Dashboard Financeiro © 2026 | Análises atualizadas em tempo real</p>
                </div>
            </div>
        </div>
    );
};

export default DashboardFinanceiro;