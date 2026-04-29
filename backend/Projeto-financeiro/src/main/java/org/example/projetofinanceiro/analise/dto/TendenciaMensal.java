package org.example.projetofinanceiro.analise.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TendenciaMensal {
    private Integer mes;
    private String nomeMes; // Janeiro, Fevereiro, etc
    private BigDecimal total;
    private Integer quantidade;
    private BigDecimal mediadiaria;
}
