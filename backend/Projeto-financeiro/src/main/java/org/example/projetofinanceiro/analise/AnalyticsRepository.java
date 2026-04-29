package org.example.projetofinanceiro.analise;

import org.example.projetofinanceiro.financeiro.Financeiro;
import org.example.projetofinanceiro.usuario.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public interface AnalyticsRepository extends JpaRepository<Financeiro, Long> {

    //Total por categoria
    @Query(value = """
        SELECT f.categoria as categoria,
               SUM(f.valor) as total,
               COUNT(*) as quantidade
        FROM Financeiro f
        WHERE f.usuario_id = :usuarioId
        AND f.data >= :dataInicio
        AND f.data <= :dataFim
        GROUP BY f.categoria
        ORDER BY total DESC
    """, nativeQuery = true)
    List<Object[]> getTotalPorCategoria(
            @Param("usuarioId") Long usuarioId,
            @Param("dataInicio") LocalDate dataInicio,
            @Param("dataFim") LocalDate dataFim
    );

    /**
     * Total gasto por categoria no mês atual
     */
    @Query(value = """
        SELECT f.categoria as categoria,
               SUM(f.valor) as total,
               COUNT(*) as quantidade
        FROM Financeiro f
        WHERE f.usuario_id = :usuarioId
        AND EXTRACT(YEAR FROM f.data) = :ano
        AND EXTRACT(MONTH FROM f.data) = :mes
        GROUP BY f.categoria
        ORDER BY total DESC
    """, nativeQuery = true)
    List<Object[]> getTotalPorCategoriaMes(
            @Param("usuarioId") Long usuarioId,
            @Param("ano") int ano,
            @Param("mes") int mes
    );

    /**
     * Tendência mensal de gastos
     */
    @Query(value = """
        SELECT EXTRACT(MONTH FROM (f.data)) as mes,
               SUM(f.valor) as total,
               COUNT(*) as quantidade
        FROM Financeiro f
        WHERE f.usuario_id = :usuarioId
        AND EXTRACT(YEAR FROM f.data) = :ano
        GROUP BY EXTRACT(MONTH FROM f.data)
        ORDER BY EXTRACT(MONTH FROM f.data)
    """, nativeQuery = true)
    List<Object[]> getTendenciaMensal(
            @Param("usuarioId") Long usuarioId,
            @Param("ano") int ano
    );

    /**
     * Tendência diária no mês (para gráfico detalhado)
     */
    @Query(value = """
        SELECT DATE(f.data) as data,
               SUM(f.valor) as total,
               COUNT(*) as quantidade
        FROM Financeiro f
        WHERE f.usuario_id = :usuarioId
        AND EXTRACT(YEAR FROM f.data) = :ano
        AND EXTRACT(MONTH FROM f.data) = :mes
        GROUP BY DATE(f.data)
        ORDER BY DATE(f.data)
    """, nativeQuery = true)
    List<Object[]> getTendenciaDiaria(
            @Param("usuarioId") Long usuarioId,
            @Param("ano") int ano,
            @Param("mes") int mes
    );

    /**
     * Gastos necessários vs opcionais
     */
    @Query(value = """
        SELECT f.necessario as tipo,
               SUM(f.valor) as total,
               COUNT(*) as quantidade
        FROM Financeiro f
        WHERE f.usuario_id = :usuarioId
        AND f.data >= :dataInicio
        AND f.data <= :dataFim
        GROUP BY f.necessario
    """, nativeQuery = true)
    List<Object[]> getGastoNecessario(
            @Param("usuarioId") Long usuarioId,
            @Param("dataInicio") LocalDate dataInicio,
            @Param("dataFim") LocalDate dataFim
    );

    /**
     * Necessário vs opcional no mês atual
     */
    @Query(value = """
        SELECT f.necessario as tipo,
               SUM(f.valor) as total,
               COUNT(*) as quantidade
        FROM Financeiro f
        WHERE f.usuario_id = :usuarioId
        AND EXTRACT(YEAR FROM f.data) = :ano
        AND EXTRACT(MONTH FROM f.data) = :mes
        GROUP BY f.necessario
    """, nativeQuery = true)
    List<Object[]> getGastoNecessarioMes(
            @Param("usuarioId") Long usuarioId,
            @Param("ano") int ano,
            @Param("mes") int mes
    );

    /**
     * Total gasto em um período
     */
    @Query(value = """
        SELECT SUM(f.valor)
        FROM Financeiro f
        WHERE f.usuario_id = :usuarioId
        AND f.data >= :dataInicio
        AND f.data <= :dataFim
    """, nativeQuery = true)
    BigDecimal getTotalPeriodo(
            @Param("usuarioId") Long usuarioId,
            @Param("dataInicio") LocalDate dataInicio,
            @Param("dataFim") LocalDate dataFim
    );

    /**
     * Total do mês atual
     */
    @Query(value = """
        SELECT SUM(f.valor)
        FROM Financeiro f
        WHERE f.usuario_id = :usuarioId
        AND EXTRACT(YEAR FROM f.data) = :ano
        AND EXTRACT(MONTH FROM f.data) = :mes
    """, nativeQuery = true)
    BigDecimal getTotalMes(
            @Param("usuarioId") Long usuarioId,
            @Param("ano") int ano,
            @Param("mes") int mes
    );

    /**
     * Categoria com maior gasto
     */
    @Query(value = """
        SELECT f.categoria
        FROM Financeiro f
        WHERE f.usuario_id = :usuarioId
        AND f.data >= :dataInicio
        AND f.data <= :dataFim
        GROUP BY f.categoria
        ORDER BY SUM(f.valor) DESC
        LIMIT 1
    """, nativeQuery = true)
    String getMaiorCategoria(
            @Param("usuarioId") Long usuarioId,
            @Param("dataInicio") LocalDate dataInicio,
            @Param("dataFim") LocalDate dataFim
    );

    /**
     * Variação percentual entre dois períodos
     */
    @Query(value = """
        SELECT EXTRACT(MONTH FROM f.data) as mes,
               SUM(f.valor) as total,
               SUM(f.valor) - LAG(SUM(f.valor)) OVER (ORDER BY EXTRACT(MONTH FROM f.data)) as variacao
        FROM Financeiro f
        WHERE f.usuario_id = :usuarioId
        AND EXTRACT(YEAR FROM f.data) = :ano
        GROUP BY EXTRACT(MONTH FROM f.data)
        ORDER BY EXTRACT(MONTH FROM f.data)
    """, nativeQuery = true)
    List<Object[]> getVariacaoMensal(
            @Param("usuarioId") Long usuarioId,
            @Param("ano") int ano
    );

    /**
     * Categoria com aumento de gasto
     */
    @Query(value = """
        SELECT f.categoria,
               SUM(CASE WHEN EXTRACT(MONTH FROM f.data) = :mesBefore THEN f.valor ELSE 0 END) as mesAnterior,
               SUM(CASE WHEN EXTRACT(MONTH FROM f.data) = :mesAtual THEN f.valor ELSE 0 END) as mesAtual
        FROM Financeiro f
        WHERE f.usuario_id = :usuarioId
        AND EXTRACT(YEAR FROM f.data) = :ano
        AND EXTRACT(MONTH FROM f.data) IN (:mesBefore, :mesAtual)
        GROUP BY f.categoria
        HAVING SUM(CASE WHEN EXTRACT(MONTH FROM f.data) = :mesAtual THEN f.valor ELSE 0 END) > 0
        ORDER BY mesAtual DESC
    """, nativeQuery = true)
    List<Object[]> getCategoriaComAumento(
            @Param("usuarioId") Long usuarioId,
            @Param("ano") int ano,
            @Param("mesBefore") int mesBefore,
            @Param("mesAtual") int mesAtual
    );

    /**
     * Maiores gastos (Top transações)
     */
    @Query(value = """
        SELECT f.descricao, f.valor, f.categoria, f.data
        FROM Financeiro f
        WHERE f.usuario_id = :usuarioId
        AND f.data >= :dataInicio
        AND f.data <= :dataFim
        ORDER BY f.valor DESC
        LIMIT :limit
    """, nativeQuery = true)
    List<Object[]> getTopGastos(
            @Param("usuarioId") Long usuarioId,
            @Param("dataInicio") LocalDate dataInicio,
            @Param("dataFim") LocalDate dataFim,
            @Param("limit") int limit
    );

    /**
     * Média diária de gastos
     */
    @Query(value = """
        SELECT SUM(f.valor) / (SELECT COUNT(DISTINCT DATE(f2.data))
                FROM Financeiro f2
                WHERE f2.usuario_id = :usuarioId
                AND f2.data >= :dataInicio
                AND f2.data <= :dataFim)
        FROM Financeiro f
        WHERE f.usuario_id = :usuarioId
        AND f.data >= :dataInicio
        AND f.data <= :dataFim
    """, nativeQuery = true)
    BigDecimal getMediaDiaria(
            @Param("usuarioId") Long usuarioId,
            @Param("dataInicio") LocalDate dataInicio,
            @Param("dataFim") LocalDate dataFim
    );

    //Contagem de transações por categoria
    @Query(value = """
        SELECT f.categoria, COUNT(*) as quantidade
        FROM Financeiro f
        WHERE f.usuario_id = :usuarioId
        AND f.data >= :dataInicio
        AND f.data <= :dataFim
        GROUP BY f.categoria
        ORDER BY quantidade DESC
    """, nativeQuery = true)
    List<Object[]> getContagemPorCategoria(
            @Param("usuarioId") Long usuarioId,
            @Param("dataInicio") LocalDate dataInicio,
            @Param("dataFim") LocalDate dataFim
    );


    //Desvio padrão de gastos (volatilidade)
    @Query(value = """
        SELECT SQRT(AVG((f.valor - (SELECT AVG(f2.valor) FROM Financeiro f2 WHERE f2.usuario_id = :usuarioId)) * 
                        (f.valor - (SELECT AVG(f2.valor) FROM Financeiro f2 WHERE f2.usuario_id = :usuarioId))))
        FROM Financeiro f
        WHERE f.usuario_id = :usuarioId
        AND f.data >= :dataInicio
        AND f.data <= :dataFim
    """, nativeQuery = true)
    BigDecimal getDesvioPadrao(
            @Param("usuarioId") Long usuarioId,
            @Param("dataInicio") LocalDate dataInicio,
            @Param("dataFim") LocalDate dataFim
    );

    /**
     * Percentil 75 de gastos (P75 - onde 75% das transações estão abaixo)
     */
    @Query(value = """
        SELECT f.valor
        FROM Financeiro f
        WHERE f.usuario_id = :usuarioId
        AND f.data >= :dataInicio
        AND f.data <= :dataFim
        ORDER BY f.valor
        LIMIT 1 OFFSET (
            SELECT FLOOR(COUNT(*) * 0.75)
            FROM Financeiro f2
            WHERE f2.usuario_id = :usuarioId
            AND f2.data >= :dataInicio
            AND f2.data <= :dataFim
        )
    """, nativeQuery = true)
    BigDecimal getPercentil75(
            @Param("usuarioId") Long usuarioId,
            @Param("dataInicio") LocalDate dataInicio,
            @Param("dataFim") LocalDate dataFim
    );

    /**
     * Categorias que tiveram aumento acima de 20%
     */
    @Query(value = """
        SELECT f.categoria
        FROM Financeiro f
        WHERE f.usuario_id = :usuarioId
        AND f.data >= :dataInicio
        AND f.data <= :dataFim
        GROUP BY f.categoria
        HAVING SUM(f.valor) > (
            SELECT SUM(f2.valor) * 1.2
            FROM Financeiro f2
            WHERE f2.usuario_id = :usuarioId
            AND f2.data >= :dataAnteriorInicio
            AND f2.data <= :dataAnteriorFim
            AND f2.categoria = f.categoria
        )
    """, nativeQuery = true)
    List<String> getCategoriaComAumentoAlto(
            @Param("usuarioId") Long usuarioId,
            @Param("dataInicio") LocalDate dataInicio,
            @Param("dataFim") LocalDate dataFim,
            @Param("dataAnteriorInicio") LocalDate dataAnteriorInicio,
            @Param("dataAnteriorFim") LocalDate dataAnteriorFim
    );

    /**
     * Quantidade de dias sem gastos
     */
    @Query(value = """
        SELECT COUNT(DISTINCT DATE(f.data))
        FROM Financeiro f
        WHERE f.usuario_id = :usuarioId
        AND f.data >= :dataInicio
        AND f.data <= :dataFim
    """, nativeQuery = true)
    Long getDiasComGastos(
            @Param("usuarioId") Long usuarioId,
            @Param("dataInicio") LocalDate dataInicio,
            @Param("dataFim") LocalDate dataFim
    );
}