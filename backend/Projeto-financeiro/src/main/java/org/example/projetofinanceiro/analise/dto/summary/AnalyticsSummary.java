package org.example.projetofinanceiro.analise.dto.summary;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class AnalyticsSummary {
    private MonthSummaryDTO monthSummary;
    private OverviewDTO overview;
}
