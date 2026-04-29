package org.example.projetofinanceiro.financeiro;

import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.example.projetofinanceiro.financeiro.dto.CriarFinanceiroDTO;
import org.example.projetofinanceiro.financeiro.dto.FinanceiroDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/financeiro")
@Slf4j
public class FinanceiroController {

    @Autowired
    private FinanceiroService financeiroService;

    @PostMapping
    public ResponseEntity<FinanceiroDTO> criarFinanceiro(
            @RequestBody @Valid CriarFinanceiroDTO dto) throws IllegalAccessException {
        log.info("Criando novo financeiro para usuário: {}", dto.getUsuarioId());
        FinanceiroDTO financeiroCriado = financeiroService.criarDespesa(dto.getUsuarioId(), dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(financeiroCriado);
    }

    @GetMapping("/{id}")
    public ResponseEntity<FinanceiroDTO> getFinanceiroPorId(@PathVariable Long id){
        log.info("Buscando financeiro com ID: {}", id);
        FinanceiroDTO financeiro = financeiroService.obterPorId(id);
        return ResponseEntity.ok(financeiro);
    }

    //Lista todos os financeiros de um usuario (com paginaçao)
    //GET /api/financeiro?despesaId=1&size=10
    @GetMapping
    public ResponseEntity<Page<FinanceiroDTO>> listarFinanceiroUsuario(
            @RequestParam Long usuarioId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "100") int size) {
        log.info("Listando financeiro do usuário: {} - Página: {}, Tamanho: {}", usuarioId, page, size);

        Pageable pageable = PageRequest.of(page, size, Sort.by("data").descending());
        Page<FinanceiroDTO> financeiros = financeiroService.listarPorUsuario(usuarioId, pageable);
        return ResponseEntity.ok(financeiros);
    }

    /*
    * Obter resumo mensal de despesas
    @GetMapping("/resumo/mensal")
    public ResponseEntity<ResumoMensalDTO> obterResumoMensal(
            @RequestParam Long usuarioId,
            @RequestParam int ano,
            @RequestParam int mes) {
        log.info("Obtendo resumo mensal para usuário: {} - {}/{}", usuarioId, mes, ano);
        ResumoMensalDTO resumo = despesaService.obterResumoMensal(usuarioId, ano, mes);
        return ResponseEntity.ok(resumo);
    }*/

    /*
    @GetMapping("/categoria/{categoria}")
    public ResponseEntity<Page<FinanceiroDTO>> obterDespesasPorCategoria(
            @RequestParam Long usuarioId,
            @PathVariable Categoria categoria,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "100") int size) {
        log.info("Listando despesas da categoria {} para usuário: {}", categoria, usuarioId);
        Pageable pageable = PageRequest.of(page, size, Sort.by("data").descending());

        Page<FinanceiroDTO> despesas = financeiroService.obterPorCategoria(usuarioId, categoria, pageable);
        return ResponseEntity.ok(despesas);
    }*/

    //Atualizar uma despesa
    @PutMapping("/{id}")
    public ResponseEntity<FinanceiroDTO> atualizarFinanceiro(
            @PathVariable Long id,
            @RequestBody @Valid CriarFinanceiroDTO dto) {
        log.info("Iniciando atualização do financeiro com ID: {}", id);
        FinanceiroDTO financeiroAtualizado = financeiroService.atualizarFinanceiro(id, dto);
        return ResponseEntity.ok(financeiroAtualizado);
    }

    //Deleta um financeiro
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletaFinanceiro(@PathVariable Long id){
        log.info("Deletando financeiro com ID: {}", id);
        financeiroService.deletarFinanceiro(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/lote")
    public ResponseEntity<Void> excluirLote(@RequestBody List<Long> ids) {
        financeiroService.excluirPorIds(ids);
        return ResponseEntity.noContent().build();
    }
}
