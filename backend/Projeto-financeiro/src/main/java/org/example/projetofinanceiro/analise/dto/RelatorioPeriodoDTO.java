package org.example.projetofinanceiro.analise.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RelatorioPeriodoDTO {
    private String periodoInicio;
    private String periodoFim;
    private Integer dias;

    // Resumo
    private BigDecimal totalRenda;
    private BigDecimal totalDespesa;
    private BigDecimal saldo;

    // Análises
    private List<CategoriaTotal> categorias;
    private List<TendenciaMensal> tendencias;
    private ResumoFinanceiroDTO resumo;
    private List<RecomendacaoDTO> recomendacoes;

    // Metas
    private List<MetaFinanceira> metas;
    private Double percentualMetasAtingidas;
}
