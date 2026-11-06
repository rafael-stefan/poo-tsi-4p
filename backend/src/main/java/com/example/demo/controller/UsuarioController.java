package com.example.demo.controller;

import com.example.demo.dto.request.EditarPerfilRequest;
import com.example.demo.dto.response.UsuarioResponse;
import com.example.demo.dto.response.UsuarioResumoResponse;
import com.example.demo.security.IdSolicitante;
import com.example.demo.security.limite.LimiteRequisicoes;
import com.example.demo.service.UsuarioService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;
    private final LimiteRequisicoes limiteRequisicoes;

    public UsuarioController(UsuarioService usuarioService, LimiteRequisicoes limiteRequisicoes) {
        this.usuarioService = usuarioService;
        this.limiteRequisicoes = limiteRequisicoes;
    }

    @GetMapping
    public String getUsuarios() {
        return "Lista de usuários";
    }

    @GetMapping("/me")
    public UsuarioResponse me(@IdSolicitante Integer idSolicitante) {
        return usuarioService.buscarPerfil(idSolicitante);
    }

    @PutMapping("/me")
    public UsuarioResponse editarPerfil(@IdSolicitante Integer idSolicitante, @Valid @RequestBody EditarPerfilRequest request) {
        return usuarioService.editarPerfil(idSolicitante, request);
    }

    @GetMapping("/busca")
    public List<UsuarioResumoResponse> buscar(@RequestParam String nome, @IdSolicitante Integer idSolicitante,
                                              HttpServletRequest request) {
        limiteRequisicoes.verificarBusca(request);
        return usuarioService.buscarPorNome(nome, idSolicitante);
    }
}
