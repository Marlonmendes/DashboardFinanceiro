package org.example.projetofinanceiro.analise.dto.summary;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.sql.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MonthSummaryDTO {
    private BigDecimal highestExpense;
    private BigDecimal dailyAverageExpense;
    private Date mostExpensiveDay;
    private BigDecimal longestNoSpendStreak;
    private BigDecimal weeklyBudget;
    private String topCategory;
    private String variationLastMonth;
    private BigDecimal totalTransactions;
}
