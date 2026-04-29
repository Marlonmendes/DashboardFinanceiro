package org.example.projetofinanceiro.analise.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GastoNecessario {
    private String tipo; // "SIM" ou "NAO"
    private BigDecimal total;
    private Double percentual;
    private Integer quantidade;
}
