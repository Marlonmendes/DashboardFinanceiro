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
    private BigDecimal qtdDinheiroEntrada;
    private String maiorCategoria;
    private List<CategoriaTotal> porCategoria;
    private List<TendenciaMensal> porMes;
    private List<GastoNecessario> gastoNecessario;
    private List<RecomendacaoDTO> recomendacoes;
}
