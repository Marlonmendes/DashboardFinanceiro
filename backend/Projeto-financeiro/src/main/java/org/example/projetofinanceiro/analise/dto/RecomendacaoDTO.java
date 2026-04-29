package org.example.projetofinanceiro.analise.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RecomendacaoDTO {
    private String titulo;
    private String descricao;
    private String tipo; // "ALERTA", "OPORTUNIDADE", "ECONOMIA"
    private BigDecimal impactoFinanceiro; // Quanto pode economizar
    private Integer prioridade; // 1 = alta, 2 = média, 3 = baixa
}
