package org.example.projetofinanceiro.analise.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PredictionCategoria {
    private String categoria;
    private BigDecimal predicao;
    private BigDecimal limiteInferior; // Confidence interval
    private BigDecimal limiteSuperior;
    private Double confianca; // 0.0 a 1.0
}
