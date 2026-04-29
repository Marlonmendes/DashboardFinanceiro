package org.example.projetofinanceiro.analise.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GastoVsReceita {
    private String tipo; // "RECEITA" ou "DESPESA"
    private BigDecimal total;
    private Integer quantidade;
    private BigDecimal percentualDaRenda;
}
