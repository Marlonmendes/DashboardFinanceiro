package org.example.projetofinanceiro.analise.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TendenciaMensal {
    private Integer month;
    private String nameMonth; // Janeiro, Fevereiro, etc
    private BigDecimal totalEntrada;
    private BigDecimal totalSaida;
    private Integer quantidade;
    private BigDecimal mediadiaria;
}
