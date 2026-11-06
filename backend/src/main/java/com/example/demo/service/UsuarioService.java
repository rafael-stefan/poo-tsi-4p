package com.example.demo.service;

import com.example.demo.dto.request.EditarPerfilRequest;
import com.example.demo.dto.response.UsuarioResponse;
import com.example.demo.dto.response.UsuarioResumoResponse;
import com.example.demo.entity.UsuarioEntity;
import com.example.demo.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;

    public UsuarioEntity findById(Integer id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));
    }

    public UsuarioEntity findByEmail(String email) {
        String normalizedEmail = email.trim().toLowerCase();
        return usuarioRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));
    }

    public boolean existsByEmail(String email) {
        String normalizedEmail = email.trim().toLowerCase();
        return usuarioRepository.existsByEmail(normalizedEmail);
    }

    public UsuarioEntity save(UsuarioEntity usuario) {
        return usuarioRepository.save(usuario);
    }

    public UsuarioResponse buscarPerfil(Integer idSolicitante) {
        return UsuarioResponse.de(findById(idSolicitante));
    }

    @Transactional
    public UsuarioResponse editarPerfil(Integer idSolicitante, EditarPerfilRequest request) {
        UsuarioEntity usuario = findById(idSolicitante);
        String foto = request.fotoPerfil() == null || request.fotoPerfil().isBlank() ? null : request.fotoPerfil().trim();
        usuario.editarPerfil(request.nome().trim(), foto);
        return UsuarioResponse.de(usuarioRepository.save(usuario));
    }

    public List<UsuarioResumoResponse> buscarPorNome(String nome, Integer idSolicitante) {
        if (nome == null || nome.trim().length() < 2) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Informe pelo menos 2 caracteres para buscar");
        }
        List<UsuarioEntity> encontrados = usuarioRepository.findTop20ByNomeContainingIgnoreCaseAndAtivoTrueOrderByNomeAsc(nome.trim());
        List<UsuarioResumoResponse> resultado = new ArrayList<>();
        for (UsuarioEntity usuario : encontrados) {
            if (!usuario.getUsuarioId().equals(idSolicitante)) {
                resultado.add(UsuarioResumoResponse.de(usuario));
            }
        }
        return resultado;
    }
}
