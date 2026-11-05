package com.example.demo.controller;

import com.example.demo.dto.response.UsuarioResponse;
import com.example.demo.security.IdSolicitante;
import com.example.demo.service.UsuarioService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @GetMapping
    public String getUsuarios() {
        return "Lista de usuários";
    }

    @GetMapping("/me")
    public UsuarioResponse me(@IdSolicitante Integer idSolicitante) {
        return usuarioService.buscarPerfil(idSolicitante);
    }
}
