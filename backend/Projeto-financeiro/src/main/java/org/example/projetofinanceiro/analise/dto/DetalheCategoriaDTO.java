package org.example.projetofinanceiro.analise.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DetalheCategoriaDTO {
    private String categoria;
    private BigDecimal totalMes;
    private Integer quantidadeTransacoes;
    private BigDecimal mediaTransacao;
    private BigDecimal maiorGasto;
    private BigDecimal menorGasto;
    private List<TransacaoDTO> transacoes; // Top 10 transações
}
