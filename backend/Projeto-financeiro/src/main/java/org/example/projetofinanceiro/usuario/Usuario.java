package org.example.projetofinanceiro.usuario;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.projetofinanceiro.financeiro.Financeiro;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Entity
@Table(name = "usuario")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String nome;

    private String senha; //Alterar para hash futuramente

    private BigDecimal salary;

    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL)
    private List<Financeiro> financeiros;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime criadoEm;
}
