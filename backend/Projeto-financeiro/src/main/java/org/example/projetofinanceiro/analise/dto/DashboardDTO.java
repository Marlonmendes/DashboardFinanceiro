package org.example.projetofinanceiro.analise.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardDTO {
    private BigDecimal totalMensal;
    private String maiorCategoria;
    private BigDecimal economiaTotal;
    private List<CategoriaTotal> porCategoria;
    private List<TendenciaMensal> tendenciaMensal;
    private List<GastoNecessario> gastoNecessario;
    private List<GastoVsReceita> gastoVsReceita;
    private BigDecimal previsaoProximos30Dias;
    private List<RecomendacaoDTO> recomendacoes;
}
