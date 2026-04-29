package org.example.projetofinanceiro.analise.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ScoreFinanceiro {
    private Integer score; // 0-100
    private String nivel; // "Crítico", "Ruim", "Médio", "Bom", "Excelente"
    private String descricao;

    private Integer scoreEconomia; // Quanto economiza
    private Integer scorePlanejamento; // Planejamento de gastos
    private Integer scoreAssinaturas; // Gestão de assinaturas
    private Integer scoreMetas; // Cumprimento de metas
}
