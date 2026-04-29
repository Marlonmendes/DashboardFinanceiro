package org.example.projetofinanceiro.usuario;

import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.example.projetofinanceiro.usuario.dto.CriarUsuarioDTO;
import org.example.projetofinanceiro.usuario.dto.UsuarioDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@Transactional
//Adicionar CRIPTOGRAFIA
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    public UsuarioDTO usuarioDTO;

    public UsuarioDTO criarUsuario(CriarUsuarioDTO dto){
        log.info("Iniciando criação de novo usuário: {}", dto.getNome());


        if(usuarioRepository.existsByEmail(dto.getEmail())){
            log.warn("Tentativa de criar usuário com email já existente: {}", dto.getEmail());
            throw new IllegalArgumentException("Email já cadastrado: " + dto.getEmail());
        }

        Usuario usuario = new Usuario();
        usuario.setNome(dto.getNome());
        usuario.setSenha(dto.getSenha());
        usuario.setEmail(dto.getEmail());

        Usuario usuarioSalvo = usuarioRepository.save(usuario);
        log.info("Usuário criado com sucesso. ID: {}", usuarioSalvo.getId());

        return converterParaDTO(usuario);
    }

    @Transactional(readOnly = true)
    public UsuarioDTO obterPorEmail(String email){
        log.info("Buscando usuário por email: {}", email);
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado com email: " + email));

        return converterParaDTO(usuario);
    }

    @Transactional(readOnly = true)
    public UsuarioDTO obterPorId(Long id){
        log.info("Buscando usuário por id: {}", id);
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado com id: " + id));

        return converterParaDTO(usuario);
    }

    @Transactional(readOnly = true)
    public Page<UsuarioDTO> listarTodos(Pageable pageable){
        log.info("Listando todos os usuários. Pagina: {}, Tamanho: {}",
                pageable.getPageNumber(), pageable.getPageSize());

        Page<Usuario> usuarios = usuarioRepository.findAll(pageable);

        List<UsuarioDTO> usuariosDTO = usuarios.getContent()
                .stream()
                .map(this::converterParaDTO)
                .toList();

        return new PageImpl<>(usuariosDTO, pageable, usuarios.getTotalElements());
    }

    public UsuarioDTO atualizarUsuario(Long id, CriarUsuarioDTO dto){
        log.info("Autliazando usuários com ID: {}", id);

        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado com ID: " + id));

        if(!usuario.getEmail().equals(dto.getEmail()) && usuarioRepository.existsByEmail(dto.getEmail())){
            log.warn("Tentativa de atualizar para email já existente: {}", dto.getEmail());
            throw new IllegalArgumentException("Email já cadastrado " + dto.getEmail());
        }

        usuario.setNome(dto.getNome());
        usuario.setEmail(dto.getEmail());
        usuario.setSenha(dto.getSenha());//Adicionar criptografia

        Usuario usuarioAtualizado = usuarioRepository.save(usuario);
        log.info("Usuário atualizado com sucesso. ID: {}", id);

        return converterParaDTO(usuarioAtualizado);
    }

    public void deletarUsuario(Long id){
        log.info("Deletando usuário com ID: {}", id);

        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado com ID: " + id));

        usuarioRepository.delete(usuario);
        log.info("Usuário deletado com sucesso. ID: {}", id);
    }

    private UsuarioDTO converterParaDTO(Usuario usuario){
        return new UsuarioDTO(
                usuario.getId(),
                usuario.getNome(),
                usuario.getEmail(),
                usuario.getCriadoEm()
        );
    }
}
