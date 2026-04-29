package org.example.projetofinanceiro.financeiro;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.projetofinanceiro.usuario.Usuario;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "financeiro")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Financeiro {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal valor;

    @Column(nullable = false)
    private int recdesp;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Categoria categoria;

    private String necessario;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Column(nullable = false)
    private LocalDateTime data;

    @Column(nullable = false)
    private String descricao;
}
