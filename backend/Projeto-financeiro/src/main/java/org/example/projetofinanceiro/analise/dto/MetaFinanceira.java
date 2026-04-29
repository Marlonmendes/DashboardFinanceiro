package org.example.projetofinanceiro.analise.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MetaFinanceira {
    private Long id;
    private String categoria;
    private BigDecimal metaMensal;
    private BigDecimal gastoAtual;
    private Double percentualCumprimento;
    private Boolean atingida;
    private BigDecimal sobraResto; // Se atingida
    private BigDecimal faltaValor; // Se não atingida
}
