package org.example.projetofinanceiro.analise.dto;

import java.math.BigDecimal;

public class TendenciaAnalise {
    private String categoria;
    private BigDecimal mesAnterior;
    private BigDecimal mesAtual;
    private BigDecimal variacao;
    private Double percentualVariacao;
    private String tendencia; // "CRESCIMENTO", "QUEDA", "ESTÁVEL"
}
