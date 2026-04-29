package org.example.projetofinanceiro.analise.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResumoFinanceiroDTO {
    private BigDecimal totalRenda;
    private BigDecimal totalDespesa;
    private BigDecimal saldo;
    private Double taxaPoupanca; // Percentual
    private List<CategoriaTotal> categoriasAltas; // Top 3 categorias
    private List<CategoriaTotal> categoriasLowCost; // Menores gastos
}
