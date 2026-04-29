package org.example.projetofinanceiro.analise.service;

import lombok.extern.slf4j.Slf4j;
import org.example.projetofinanceiro.analise.AnalyticsRepository;
import org.example.projetofinanceiro.analise.dto.*;
import org.example.projetofinanceiro.usuario.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cglib.core.Local;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Slf4j
@Transactional(readOnly = true)
public class AnalyticsService {

    @Autowired
    private AnalyticsRepository analyticsRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    public DashboardDTO getDashboardCompleto(Long usuarioId){
        log.info("Gerando dashboard completo para usuário: {}", usuarioId);

        LocalDate hoje = LocalDate.now();
        LocalDate inicioMes = LocalDate.of(hoje.getYear(), hoje.getMonth(), 1);
        LocalDate fimMes = hoje;

        DashboardDTO dashboardDTO = new DashboardDTO();

        dashboardDTO.setTotalMensal(getTotalMes(usuarioId, hoje.getYear(), hoje.getMonthValue()));
        dashboardDTO.setMaiorCategoria(getMaiorCategoria(usuarioId, inicioMes, fimMes));
        dashboardDTO.setEconomiaTotal(calcularEconomiaTotal(usuarioId));

        dashboardDTO.setPorCategoria(getTotalPorCategoria(usuarioId, inicioMes, fimMes));

        dashboardDTO.setTendenciaMensal(getTendenciaMensal(usuarioId, hoje.getYear()));

        dashboardDTO.setGastoNecessario(getGastoNecessario(usuarioId, inicioMes, fimMes));

        dashboardDTO.setPrevisaoProximos30Dias(fazerPrevisao(usuarioId, 30));

        dashboardDTO.setRecomendacoes(gerarRecomendacoes(usuarioId));

        return dashboardDTO;
    }

    public BigDecimal getTotalMes(Long usuarioId, int ano, int mes){
        BigDecimal total = analyticsRepository.getTotalMes(usuarioId, ano, mes);
        return total != null ? total : BigDecimal.ZERO;
    }

    public String getMaiorCategoria(Long usuarioId, LocalDate inicio, LocalDate fim){
        return analyticsRepository.getMaiorCategoria(usuarioId, inicio, fim);
    }

    public BigDecimal calcularEconomiaTotal(Long usuarioId){
        LocalDate hoje = LocalDate.now();
        LocalDate inicioMes = LocalDate.of(hoje.getYear(), hoje.getMonth(),1);

        List<GastoNecessario> gastos = getGastoNecessario(usuarioId, inicioMes, hoje);
        BigDecimal opcionais = gastos.stream()
                .filter(x -> "NAO".equals(x.getTipo()))
                .map(GastoNecessario::getTotal)
                .findFirst()
                .orElse(BigDecimal.ZERO);

        return opcionais;

    }

    //Total gasto por categoria
    public List<CategoriaTotal> getTotalPorCategoria(Long usuarioId, LocalDate inicio, LocalDate fim){
        log.debug("Buscando total por categoria para usuário: {}", usuarioId);

        List<Object[]> resultados = analyticsRepository.getTotalPorCategoria(usuarioId, inicio, fim);
        BigDecimal totalGeral = calcularTotalPeriodo(usuarioId, inicio, fim);

        return resultados.stream()
                .map(row -> {
                    String categoria = (String) row[0];
                    BigDecimal total = (BigDecimal) row[1];
                    Long quantidade = (Long) row[2];

                    Double percentual = totalGeral.compareTo(BigDecimal.ZERO) > 0
                            ? total.divide(totalGeral, 4, RoundingMode.HALF_UP).doubleValue() * 100
                            : 0.0;

                    return new CategoriaTotal(
                            categoria,
                            total,
                            percentual,
                            quantidade.intValue()
                    );
                })
                .collect(Collectors.toList());
    }

    //Gastos necessarios vs opcionais
    public List<GastoNecessario> getGastoNecessario(Long usuarioId, LocalDate inicio, LocalDate fim){
        log.debug("Buscando gastos necessários vs opcionais para usuário: {}", usuarioId);

        List<Object[]> resultados = analyticsRepository.getGastoNecessario(usuarioId, inicio, fim);
        BigDecimal totalGeral = calcularTotalPeriodo(usuarioId, inicio, fim);

        return resultados.stream()
                .map(row -> {
                    String tipo = (String) row[0];
                    BigDecimal total = (BigDecimal) row[1];
                    Long quantidade = (Long) row[2];

                    Double percentual = totalGeral.compareTo(BigDecimal.ZERO) > 0
                            ? total.divide(totalGeral, 4, RoundingMode.HALF_UP).doubleValue() * 100
                            : 0.0;

                    return new GastoNecessario(
                            tipo,
                            total,
                            percentual,
                            quantidade.intValue()
                    );
                })
                .collect(Collectors.toList());
    }

    public BigDecimal calcularTotalPeriodo(Long usuarioId, LocalDate inicio, LocalDate fim){
        BigDecimal total = analyticsRepository.getTotalPeriodo(usuarioId, inicio, fim);
        return total != null ? total : BigDecimal.ZERO;
    }

    public List<TendenciaMensal> getTendenciaMensal(Long usuarioId, int ano){
        log.debug("Buscando tendências mensal para usuário: {}", usuarioId);

        List<Object[]> resultados = analyticsRepository.getTendenciaMensal(usuarioId, ano);

        String[] nomeMeses = {
                "", "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
                "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
        };

        return resultados.stream()
                .map(row -> {
                    Integer mes = ((Number) row[0]).intValue();
                    BigDecimal total = (BigDecimal) row[1];
                    Long quantidade = (Long) row[2];

                    //Calcular media diaria
                    YearMonth ym = YearMonth.of(ano,mes);
                    int diasNoMes = ym.lengthOfMonth();
                    BigDecimal mediaDiaria = total.divide(
                            new BigDecimal(diasNoMes),
                            2,
                            RoundingMode.HALF_UP
                    );

                    return new TendenciaMensal(
                            mes,
                            nomeMeses[mes],
                            total,
                            quantidade.intValue(),
                            mediaDiaria
                    );
                })
                .collect(Collectors.toList());
    }

    //Faz previsao simples (media dos ultimos N dias)
    public BigDecimal fazerPrevisao(Long usuarioId, int dias){
        log.debug("Fazendo previsão de {} dias para usuário: {}", dias, usuarioId);

        LocalDate hoje = LocalDate.now();
        LocalDate inicio = hoje.minusDays(30);

        BigDecimal mediaDiaria = analyticsRepository.getMediaDiaria(usuarioId, inicio, hoje);

        if(mediaDiaria != null){
            return mediaDiaria.multiply(new BigDecimal(dias));
        }

        return BigDecimal.ZERO;
    }

    public List<RecomendacaoDTO> gerarRecomendacoes(Long usuarioId){
        log.debug("Gerando recomendações para usuário: {}", usuarioId);

        List<RecomendacaoDTO> recomendacoes = new ArrayList<>();
        LocalDate hoje = LocalDate.now();
        LocalDate inicioMes = LocalDate.of(hoje.getYear(), hoje.getMonth(), 1);

        //Recomendacao 1: Se tem categorias com aumento
        List<String> categoriasAltas = analyticsRepository.getCategoriaComAumentoAlto(
                usuarioId,
                inicioMes,
                hoje,
                inicioMes.minusMonths(1),
                inicioMes.minusDays(1)
        );

        for(String categoria : categoriasAltas){
            recomendacoes.add(new RecomendacaoDTO(
                    "Gasto alto em " + categoria,
                    "A categoria " + categoria + " aumento mais de 20% em relação ao mês anterior",
                    "ALERTA",
                    BigDecimal.valueOf(100),
                    1
            ));
        }

        // Recomendaçao 2: Se gasta muito em necessarios
        List<GastoNecessario> gastos = getGastoNecessario(
                usuarioId,
                inicioMes,
                hoje
        );

        Optional<GastoNecessario> necessarios = gastos.stream()
                .filter(g -> "SIM".equals(g.getTipo()))
                .findFirst();

        if (necessarios.isPresent() && necessarios.get().getPercentual() > 80) {
            recomendacoes.add(new RecomendacaoDTO(
                    "Gastos necessários muito altos",
                    "Seus gastos necessários representam " + String.format("%.1f", necessarios.get().getPercentual()) + "% do total",
                    "ALERTA",
                    BigDecimal.ZERO,
                    2
            ));
        }

        return recomendacoes;
    }

    public RelatorioPeriodoDTO gerarRelatorioPeriodo(Long usuarioId, LocalDate inicio, LocalDate fim){
        log.info("Gerando relatório do período {} a {} para usuário: {}", inicio, fim, usuarioId);

        RelatorioPeriodoDTO relatorio = new RelatorioPeriodoDTO();

        relatorio.setPeriodoInicio(inicio.toString());
        relatorio.setPeriodoFim(fim.toString());
        relatorio.setDias((int) java.time.temporal.ChronoUnit.DAYS.between(inicio, fim));

        relatorio.setTotalDespesa(calcularTotalPeriodo(usuarioId, inicio, fim));
        relatorio.setCategorias(getTotalPorCategoria(usuarioId, inicio, fim));
        relatorio.setRecomendacoes(gerarRecomendacoes(usuarioId));

        return relatorio;
    }

    //Score financeiro do usuario (0 - 100)
    public ScoreFinanceiro calcularScoreFinanceiro(Long usuarioId){
        log.debug("Calculando score financeiro para usuário: {}", usuarioId);

        LocalDate hoje = LocalDate.now();
        LocalDate inicioMes = LocalDate.of(hoje.getYear(), hoje.getMonth(),1);
        LocalDate inicioMesAnterior = inicioMes.minusMonths(1);
        LocalDate fimMesAnterior = inicioMes.minusDays(1);

        BigDecimal totalAtual = getTotalMes(usuarioId, hoje.getYear(), hoje.getMonthValue());
        BigDecimal totalAnterior = getTotalMes(usuarioId, inicioMesAnterior.getYear(), inicioMesAnterior.getMonthValue());

        int scoreEconomia = totalAtual.compareTo(totalAnterior) < 0 ? 90 : 60;

        //Score geral
        int scoreGeral = (scoreEconomia + 70 + 75 + 80) / 4;

        ScoreFinanceiro score = new ScoreFinanceiro();
        score.setScore(scoreGeral);
        score.setNivel(getNivelScore(scoreGeral));
        score.setDescricao("Sua saúde financeira está em nível " + score.getNivel());
        score.setScoreEconomia(scoreEconomia);
        score.setScorePlanejamento(70);
        score.setScoreAssinaturas(75);
        score.setScoreMetas(80);

        return score;
    }

    private String getNivelScore(int score) {
        if (score >= 90) return "Excelente";
        if (score >= 75) return "Bom";
        if (score >= 60) return "Médio";
        if (score >= 40) return "Ruim";
        return "Crítico";
    }
}