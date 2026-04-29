package org.example.projetofinanceiro.analise.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ComparativoPeriodo {
    private String periodo1; // Jan 2024
    private String periodo2; // Fev 2024
    private BigDecimal total1;
    private BigDecimal total2;
    private BigDecimal diferenca;
    private Double percentualMudanca;
    private String indicador; // ↑ ou ↓
}
