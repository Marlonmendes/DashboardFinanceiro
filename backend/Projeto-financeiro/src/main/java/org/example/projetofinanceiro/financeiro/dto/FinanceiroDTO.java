package org.example.projetofinanceiro.financeiro.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.projetofinanceiro.financeiro.Categoria;
import org.example.projetofinanceiro.financeiro.Financeiro;
import org.example.projetofinanceiro.usuario.Usuario;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FinanceiroDTO {

    private Long id;
    private String descricao;
    private BigDecimal valor;
    private LocalDateTime data;
    private int recdesp;
    private Categoria categoria;
    private String necessario;
    private Long usuarioId;

    public static FinanceiroDTO converterParaDTO(Financeiro financeiro){
        return new FinanceiroDTO(
                financeiro.getId(),
                financeiro.getDescricao(),
                financeiro.getValor(),
                financeiro.getData(),
                financeiro.getRecdesp(),
                financeiro.getCategoria(),
                financeiro.getNecessario(),
                financeiro.getUsuario().getId()
        );
    }
}
