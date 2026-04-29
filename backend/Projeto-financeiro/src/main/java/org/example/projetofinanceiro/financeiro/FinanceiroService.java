package org.example.projetofinanceiro.financeiro;

import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.example.projetofinanceiro.financeiro.dto.CriarFinanceiroDTO;
import org.example.projetofinanceiro.financeiro.dto.FinanceiroDTO;
import org.example.projetofinanceiro.usuario.Usuario;
import org.example.projetofinanceiro.usuario.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class FinanceiroService {

    @Autowired
    private FinanceiroRepository financeiroRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    private FinanceiroDTO financeiroDTO;

    public FinanceiroDTO criarDespesa(Long usuarioId, CriarFinanceiroDTO dto) throws IllegalAccessException {

        if (dto.getValor().compareTo(BigDecimal.ZERO) <= 0){
            throw new IllegalAccessException("Valor deve ser maior que zero");
        }

        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado"));

        Financeiro financeiro = new Financeiro();
        financeiro.setValor(dto.getValor());
        financeiro.setDescricao(dto.getDescricao());
        financeiro.setData(dto.getData().atStartOfDay());
        financeiro.setCategoria(dto.getCategoria());
        financeiro.setRecdesp(dto.getRecdesp());
        financeiro.setUsuario(usuario);
        financeiro.setNecessario(dto.getNecessario());

        Financeiro salva = financeiroRepository.save(financeiro);
        return financeiroDTO.converterParaDTO(salva);
    }

    //Obter financeiro por ID
    @Transactional(readOnly = true)
    public FinanceiroDTO obterPorId(Long id){
        Financeiro financeiro = financeiroRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Financeiro não encontrado com ID: " + id));
        return financeiroDTO.converterParaDTO(financeiro);
    }

    public Page<FinanceiroDTO> obterPorCategoria(Long usuarioId, Categoria categoria, Pageable pageable){
        log.info("Listando financeiro do usuário: {}", usuarioId);

        if(!usuarioRepository.existsById(usuarioId)){
            throw new EntityNotFoundException("Usuário não encontrado com ID: " + usuarioId);
        }

        Page<Financeiro> financeiros = financeiroRepository.findAll(pageable);

        List<FinanceiroDTO> financeiroDTOS = financeiros.getContent()
                .stream()
                .filter(d -> d.getUsuario().getId().equals(usuarioId) && d.getCategoria().equals(categoria))
                .map(FinanceiroDTO::converterParaDTO)
                .collect(Collectors.toList());

        return new PageImpl<>(financeiroDTOS, pageable, financeiros.getTotalElements());
    }


    //Listar financeiro de um usuario com paginação
    @Transactional(readOnly = true)
    public Page<FinanceiroDTO> listarPorUsuario(Long usuarioId, Pageable pageable){
        log.info("Listando financeiros do usuário: {}", usuarioId);

        if(!usuarioRepository.existsById(usuarioId)){
            throw new EntityNotFoundException("Usuário não encontrado com ID: " + usuarioId);
        }

        Page<Financeiro> financeiros = financeiroRepository.findAll(pageable);

        List<FinanceiroDTO> financeiroDTOS = financeiros.getContent()
                .stream()
                .filter(d -> d.getUsuario().getId().equals(usuarioId))
                .map(FinanceiroDTO::converterParaDTO)
                .collect(Collectors.toList());

        return new PageImpl<>(financeiroDTOS, pageable, financeiros.getTotalElements());
    }

    //Atualizar um financeiro
    public FinanceiroDTO atualizarFinanceiro(Long id, CriarFinanceiroDTO dto){
        log.info("Atualizando financeiro com ID: {}", id);

        if(dto.getValor().compareTo(BigDecimal.ZERO) <= 0){
            throw new IllegalArgumentException("Valor deve ser maior que zero");
        }

        Financeiro financeiro = financeiroRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Financeiro não encontrado com ID: " + id));

        financeiro.setDescricao(dto.getDescricao());
        financeiro.setValor(dto.getValor());
        financeiro.setCategoria(dto.getCategoria());
        financeiro.setData(dto.getData().atStartOfDay());
        financeiro.setNecessario(dto.getNecessario());

        Financeiro financeiroAtualizado = financeiroRepository.save(financeiro);
        log.info("Financeiro atualizado com sucesso. ID: {}", id);

        return FinanceiroDTO.converterParaDTO(financeiroAtualizado);
    }

    //Deleta um financeiro
    public void deletarFinanceiro(Long id) {
        log.info("Deletando financeiro com ID: {}", id);

        Financeiro financeiro = financeiroRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Financeiro não encontrada com ID: " + id));

        financeiroRepository.delete(financeiro);
        log.info("Financeiro deletado com sucesso. ID: {}", id);
    }

    //Deletar em lote
    public void excluirPorIds(List<Long> ids){

        for (Long id : ids){
            Financeiro financeiro = financeiroRepository.findById(id)
                    .orElseThrow(() -> new EntityNotFoundException("Financeiro não encontrado com ID: " + id));
            financeiroRepository.delete(financeiro);

            log.info("Financeiro deletado com sucesso. ID: {}", id);
        }
    }

}
