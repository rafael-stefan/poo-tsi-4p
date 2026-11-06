package com.example.demo.service;

import com.example.demo.auditoria.LogAuditoriaRepository;
import com.example.demo.auditoria.LogAuditoriaResponse;
import com.example.demo.dto.request.PromoverAdminRequest;
import com.example.demo.dto.response.UsuarioAdminResponse;
import com.example.demo.entity.UsuarioEntity;
import com.example.demo.repository.AvaliacaoRepository;
import com.example.demo.repository.UsuarioRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;

@Service
public class AdminService {

    private final UsuarioRepository usuarioRepository;
    private final AvaliacaoRepository avaliacaoRepository;
    private final LogAuditoriaRepository logAuditoriaRepository;

    public AdminService(UsuarioRepository usuarioRepository, AvaliacaoRepository avaliacaoRepository,
                        LogAuditoriaRepository logAuditoriaRepository) {
        this.usuarioRepository = usuarioRepository;
        this.avaliacaoRepository = avaliacaoRepository;
        this.logAuditoriaRepository = logAuditoriaRepository;
    }

    @Transactional(readOnly = true)
    public List<LogAuditoriaResponse> listarAuditoria() {
        return logAuditoriaRepository.listarRecentes(PageRequest.of(0, 200));
    }

    @Transactional(readOnly = true)
    public List<UsuarioAdminResponse> listarUsuarios() {
        List<UsuarioAdminResponse> lista = new ArrayList<>();
        for (UsuarioEntity usuario : usuarioRepository.findAllByOrderByNomeAsc()) {
            lista.add(UsuarioAdminResponse.de(usuario));
        }
        return lista;
    }

    @Transactional
    public UsuarioAdminResponse suspender(Integer idSolicitante, Integer idUsuario) {
        UsuarioEntity usuario = buscarUsuario(idUsuario);
        if (usuario.validarIdentidade(idSolicitante)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Você não pode suspender a própria conta");
        }
        if (!usuario.isAtivo()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "A conta já está suspensa");
        }
        usuario.setAtivo(false);
        return UsuarioAdminResponse.de(usuarioRepository.save(usuario));
    }

    @Transactional
    public UsuarioAdminResponse reativar(Integer idSolicitante, Integer idUsuario) {
        UsuarioEntity usuario = buscarUsuario(idUsuario);
        if (usuario.isAtivo()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "A conta já está ativa");
        }
        usuario.setAtivo(true);
        return UsuarioAdminResponse.de(usuarioRepository.save(usuario));
    }

    @Transactional
    public void promover(Integer idSolicitante, Integer idUsuario, PromoverAdminRequest request) {
        buscarUsuario(idUsuario);
        if (usuarioRepository.ehAdmin(idUsuario)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "O usuário já é administrador");
        }
        usuarioRepository.promover(idUsuario, request.matriculaAdmin());
    }

    @Transactional
    public void excluirAvaliacao(Integer idSolicitante, Integer idAvaliacao) {
        if (!avaliacaoRepository.existsById(idAvaliacao)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Avaliação não encontrada");
        }
        avaliacaoRepository.deleteById(idAvaliacao);
    }

    private UsuarioEntity buscarUsuario(Integer idUsuario) {
        return usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));
    }
}
