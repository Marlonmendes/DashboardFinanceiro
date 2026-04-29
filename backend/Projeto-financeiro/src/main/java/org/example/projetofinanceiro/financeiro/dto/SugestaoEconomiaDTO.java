package org.example.projetofinanceiro.financeiro.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SugestaoEconomiaDTO {

    private String titulo;
    private BigDecimal valorPotencialEconomia;
    private String descricao;
    private String categoria;

    public SugestaoEconomiaDTO(String titulo, BigDecimal valorPotencialEconomia, String descricao){
        this.titulo = titulo;
        this.valorPotencialEconomia = valorPotencialEconomia;
        this.descricao = descricao;
    }

}
