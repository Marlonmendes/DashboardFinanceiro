package org.example.projetofinanceiro.usuario;

import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.example.projetofinanceiro.usuario.dto.CriarUsuarioDTO;
import org.example.projetofinanceiro.usuario.dto.UsuarioDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/usuarios")
@Slf4j
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @PostMapping
    public ResponseEntity<UsuarioDTO> criarUsuario(@RequestBody @Valid CriarUsuarioDTO dto){
        log.info("Criando novo usuário: {}", dto.getEmail());
        UsuarioDTO usuarioCriado = usuarioService.criarUsuario(dto);

        return ResponseEntity.status(HttpStatus.CREATED).body(usuarioCriado);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UsuarioDTO> obterUsuarioPorId(@PathVariable Long id){
        log.info("Buscando usuário com ID: {}", id);
        UsuarioDTO usuario = usuarioService.obterPorId(id);

        return ResponseEntity.ok(usuario);
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<UsuarioDTO> obterUsuarioPorEmail(@PathVariable String email){
        log.info("Buscando usuário com email: {}", email);
        UsuarioDTO usuario = usuarioService.obterPorEmail(email);

        return ResponseEntity.ok(usuario);
    }

    @GetMapping
    public ResponseEntity<Page<UsuarioDTO>> listarUsuarios(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        log.info("Listando usuários - página: {}, tamanho:{}", page, size);
        Pageable pageable = PageRequest.of(page,size);
        Page<UsuarioDTO> usuarios = usuarioService.listarTodos(pageable);

        return ResponseEntity.ok(usuarios);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UsuarioDTO> atualizarUsuario(
            @PathVariable Long id,
            @RequestBody @Valid CriarUsuarioDTO dto){
        log.info("Atualizando usuário com ID: {}", id);

        UsuarioDTO usuarioAtualizado = usuarioService.atualizarUsuario(id, dto);

        return ResponseEntity.ok(usuarioAtualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarUsuario(@PathVariable Long id){
        log.info("Deletando usuário com ID: {}", id);
        usuarioService.deletarUsuario(id);

        return ResponseEntity.noContent().build();
    }
}
