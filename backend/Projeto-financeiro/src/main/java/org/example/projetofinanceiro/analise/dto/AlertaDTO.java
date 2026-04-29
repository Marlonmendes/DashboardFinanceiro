package org.example.projetofinanceiro.analise.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AlertaDTO {
    private Long id;
    private String titulo;
    private String mensagem;
    private String tipo; // "LIMITE_CATEGORIA", "ASSINATURA_VENCENDO", "GASTO_ALTO"
    private String severidade; // "BAIXA", "MÉDIA", "ALTA"
    private Boolean lido;
    private String dataAlerta;
}
