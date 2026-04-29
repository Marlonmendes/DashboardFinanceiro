package org.example.projetofinanceiro.analise.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategoriaTotal {
    private String categoria;
    private BigDecimal total;
    private Double percentualDoTotal; // Para gráfico de pizza
    private Integer quantidade; // Número de transações
}
