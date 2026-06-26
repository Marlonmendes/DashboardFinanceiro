package org.example.projetofinanceiro.analise.dto.summary;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class BalanceDTO {
    private Integer value;
    private Double variation;
}
