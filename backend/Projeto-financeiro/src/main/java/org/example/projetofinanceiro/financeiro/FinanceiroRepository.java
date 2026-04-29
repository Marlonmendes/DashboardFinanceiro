package org.example.projetofinanceiro.financeiro;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface FinanceiroRepository extends JpaRepository<Financeiro, Long> {

    List<Financeiro> findByUsuarioIdAndDataBetween(
            Long usuarioId,
            LocalDate inicio,
            LocalDate fim
    );

    List<Financeiro> findByUsuarioIdAndCategoria(
            Long usuarioId,
            Categoria categoria
    );

    List<Financeiro> findByUsuarioId(Long usuarioId);

    @Query("SELECT SUM(d.valor) FROM Financeiro d WHERE d.usuario.id = :usuarioId AND YEAR(d.data) = :ano AND MONTH(d.data) = :mes")
    BigDecimal getTotalMensalPorUsuario(
            @Param("usuarioId") Long usuarioId,
            @Param("ano") int ano,
            @Param("mes") int mes
    );
}