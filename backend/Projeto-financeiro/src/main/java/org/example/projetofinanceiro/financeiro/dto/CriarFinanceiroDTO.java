package org.example.projetofinanceiro.financeiro.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.projetofinanceiro.financeiro.Categoria;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CriarFinanceiroDTO {

    @Positive(message = "Valor deve ser maior que zero")
    private BigDecimal valor;

    @NotNull(message = "Categoria não pode ser nula")
    private Categoria categoria;

    @NotNull(message = "Data não pode ser nula")
    private LocalDate data;

    @NotNull(message = "Tipo de movimentação não pode ser nula")
    private int recdesp;

    @NotNull(message = "Informe se a movimentação foi necessario ou não")
    private String necessario;

    @NotNull(message = "Descrição não pode ser nula")
    private String descricao;

    private Long usuarioId;
}
