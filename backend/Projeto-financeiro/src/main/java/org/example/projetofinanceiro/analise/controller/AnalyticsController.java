package org.example.projetofinanceiro.analise.controller;

import lombok.extern.slf4j.Slf4j;
import org.apache.coyote.Response;
import org.example.projetofinanceiro.analise.AnalyticsRepository;
import org.example.projetofinanceiro.analise.dto.*;
import org.example.projetofinanceiro.analise.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cglib.core.Local;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
@Slf4j
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    @GetMapping("/dashboard/{usuarioId}")
    public ResponseEntity<DashboardDTO> getDashboardCompleto(@PathVariable Long usuarioId){
        log.info("Requisição de dashboard para usuário: {}", usuarioId);
        DashboardDTO dashboardDTO = analyticsService.getDashboardCompleto(usuarioId);
        return ResponseEntity.ok(dashboardDTO);
    }

    //Total gasto por categoria no mes atual
    @GetMapping("/categoria/{usuarioId}")
    public ResponseEntity<List<CategoriaTotal>> getTotalPorCategoria(@PathVariable Long usuarioId){
        log.info("Requisição de categorias para usuário: {}", usuarioId);

        LocalDate hoje = LocalDate.now();
        LocalDate inicioMes = LocalDate.of(hoje.getYear(), hoje.getMonth(), 1);

        List<CategoriaTotal> categorias = analyticsService.getTotalPorCategoria(
                usuarioId,
                inicioMes,
                hoje
        );
        return ResponseEntity.ok(categorias);
    }

    //Total gasto por categoria em um periodo especifico
    @GetMapping("/categoria/{usuarioId}/periodo")
    public ResponseEntity<List<CategoriaTotal>> getTotalPorCategoriaPeriodo(
            @PathVariable Long usuarioId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate inicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fim) {

        log.info("Requisição de categorias para período {} a {} do usuário: {}", inicio, fim, usuarioId);

        //Se nao informar datas, usar mes atual
        if (inicio == null || fim == null){
            LocalDate hoje = LocalDate.now();
            inicio = LocalDate.of(hoje.getYear(), hoje.getMonth(), 1);
            fim = hoje;
        }

        List<CategoriaTotal> categorias = analyticsService.getTotalPorCategoria(usuarioId, inicio, fim);
        return ResponseEntity.ok(categorias);
    }

    //Tendencias mensal de gastos
    @GetMapping("/tendencia/{usuariosId}/{ano}")
    public ResponseEntity<List<TendenciaMensal>> getTendenciaMensal(
            @PathVariable Long usuariosId,
            @PathVariable int ano) {

        log.info("Requisição de tendência para usuário {} ano {}", usuariosId, ano);
        List<TendenciaMensal> tendencias = analyticsService.getTendenciaMensal(usuariosId, ano);
        return ResponseEntity.ok(tendencias);
    }

    //Gastos necessarios vs opcionais no mes atual
    @GetMapping("/necessario/{usuarioId}")
    public ResponseEntity<List<GastoNecessario>> getGastoNecessario(@PathVariable Long usuarioId) {
        log.info("Requisição de gastos necessários para usuários: {}", usuarioId);

        LocalDate hoje = LocalDate.now();
        LocalDate inicioMes = LocalDate.of(hoje.getYear(), hoje.getMonth(), 1);

        List<GastoNecessario> gastos = analyticsService.getGastoNecessario(
                usuarioId,
                inicioMes,
                hoje
        );
        return ResponseEntity.ok(gastos);
    }

    //Gastos necessarios vs opcionais em um periodo especifico
    @GetMapping("/necessario/{usuarioId}/periodo")
    public ResponseEntity<List<GastoNecessario>> getGastoNecessarioPeriodo(
            @PathVariable Long usuarioId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate inicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fim) {

        log.info("Requisição de gastos necessários pra período {} a {} do usuário: {}", inicio, fim, usuarioId);

        if(inicio == null || fim == null){
            LocalDate hoje = LocalDate.now();
            inicio = LocalDate.of(hoje.getYear(), hoje.getMonth(), 1);
            fim = hoje;
        }

        List<GastoNecessario> gastos = analyticsService.getGastoNecessario(usuarioId, inicio, fim);
        return ResponseEntity.ok(gastos);
    }

    //Recomendaçoes de economia para o usuario
    @GetMapping("/recomendacoes/{usuarioId}")
    public ResponseEntity<List<RecomendacaoDTO>> getRecomendacoes(@PathVariable Long usuarioId) {
        log.info("Requisição de recomendações para usuário: {}", usuarioId);
        List<RecomendacaoDTO> recomendacoes = analyticsService.gerarRecomendacoes(usuarioId);
        return ResponseEntity.ok(recomendacoes);
    }

    //Previsao de gasto para os proximos N dias
    @GetMapping("/previsao/{usuarioId}")
    public ResponseEntity<Map<String, Object>> getPrevisao(
            @PathVariable Long usuarioId,
            @RequestParam(defaultValue = "30") int dias) {

        log.info("Requisição de previsão para {} dias do usuário: {}", dias, usuarioId);

        var previsao = new java.util.HashMap<String, Object>();
        previsao.put("dias", dias);
        previsao.put("previsaoDespesa", analyticsService.fazerPrevisao(usuarioId,dias));
        previsao.put("dataPrevisao", LocalDate.now().plusDays(dias));

        return ResponseEntity.ok(previsao);
    }

    //Relatorio completo de um periodo
    @GetMapping("/relatorio/{usuarioId}")
    public ResponseEntity<RelatorioPeriodoDTO> getRelatorioCompleto(
            @PathVariable Long usuarioId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate inicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fim) {

        log.info("Requisição de relatório para período {} a {} do usuário: {}", inicio, fim, usuarioId);

        if(inicio == null || fim == null){
            LocalDate hoje = LocalDate.now();
            inicio = LocalDate.of(hoje.getYear(), hoje.getMonth(), 1);
            fim = hoje;
        }

        RelatorioPeriodoDTO relatorio = analyticsService.gerarRelatorioPeriodo(usuarioId, inicio, fim);
        return ResponseEntity.ok(relatorio);
    }

    //Score financeiro do usuario (0-100)
    @GetMapping("/score/{usuarioId}")
    public ResponseEntity<ScoreFinanceiro> getScoreFinanceiro(@PathVariable Long usuarioId){
        log.info("Requisição de score financeiro para usuário: {}", usuarioId);
        ScoreFinanceiro score = analyticsService.calcularScoreFinanceiro(usuarioId);
        return ResponseEntity.ok(score);
    }

    //Economia total potencial do usuario
    @GetMapping("/economia/{usuarioId}")
    public ResponseEntity<Map<String, Object>> getEconomiaTotal(@PathVariable Long usuarioId) {
        log.info("Requisição de economia total para usuário: {}", usuarioId);

        var economia = new HashMap<String, Object>();
        economia.put("economiaTotal", analyticsService.calcularEconomiaTotal(usuarioId));
        economia.put("descricao", "Economia potencial baseada em assinaturas e gastos opcionais");

        return ResponseEntity.ok(economia);
    }
}
