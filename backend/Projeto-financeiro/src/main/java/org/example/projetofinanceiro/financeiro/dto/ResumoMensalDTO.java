package org.example.projetofinanceiro.financeiro.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.projetofinanceiro.financeiro.Categoria;

import java.math.BigDecimal;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResumoMensalDTO {

    private BigDecimal totalMensal;
    private Map<Categoria, BigDecimal> despesasPorCategoria;
    private int ano;
    private int mes;

    public ResumoMensalDTO(BigDecimal totalMensal, Map<Categoria, BigDecimal> despesasPorCategoria){
        this.totalMensal = totalMensal;
        this.despesasPorCategoria = despesasPorCategoria;
    }

}
