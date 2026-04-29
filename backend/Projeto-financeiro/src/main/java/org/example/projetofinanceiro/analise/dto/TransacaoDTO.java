package org.example.projetofinanceiro.analise.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransacaoDTO {
    private Long id;
    private String descricao;
    private BigDecimal valor;
    private String categoria;
    private String data;
    private String necessario;
}
