package org.example.projetofinanceiro.analise.dto.summary;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OverviewDTO {
    private IncomeDTO income;
    private ExpensesDTO expense;
    private BalanceDTO balance;
    private SavingRateDTO savingRate;
}
