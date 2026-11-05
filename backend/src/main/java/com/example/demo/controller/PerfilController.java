package com.example.demo.controller;

import com.example.demo.dto.response.PerfilResponse;
import com.example.demo.model.Estatisticas;
import com.example.demo.security.IdSolicitante;
import com.example.demo.service.PerfilService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/usuarios")
public class PerfilController {

    private final PerfilService perfilService;

    public PerfilController(PerfilService perfilService) {
        this.perfilService = perfilService;
    }

    @GetMapping("/me/perfil")
    public PerfilResponse meuPerfil(@IdSolicitante Integer idSolicitante) {
        return perfilService.buscarPerfil(idSolicitante, idSolicitante);
    }

    @GetMapping("/{id}/perfil")
    public PerfilResponse perfil(@PathVariable Integer id, @IdSolicitante Integer idSolicitante) {
        return perfilService.buscarPerfil(idSolicitante, id);
    }

    @GetMapping("/{id}/estatisticas")
    public Estatisticas estatisticas(@PathVariable Integer id, @IdSolicitante Integer idSolicitante) {
        return perfilService.buscarEstatisticas(idSolicitante, id);
    }
}
