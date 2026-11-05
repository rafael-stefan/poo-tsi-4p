package com.example.demo.controller;

import com.example.demo.dto.request.AvaliacaoRequest;
import com.example.demo.dto.response.AvaliacaoResponse;
import com.example.demo.security.IdSolicitante;
import com.example.demo.service.AvaliacaoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AvaliacaoController {

    private final AvaliacaoService avaliacaoService;

    public AvaliacaoController(AvaliacaoService avaliacaoService) {
        this.avaliacaoService = avaliacaoService;
    }

    @PostMapping("/registros/{registroId}/avaliacao")
    public ResponseEntity<AvaliacaoResponse> avaliar(@IdSolicitante Integer idSolicitante, @PathVariable Integer registroId,
                                                     @Valid @RequestBody AvaliacaoRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(avaliacaoService.avaliar(idSolicitante, registroId, request));
    }

    @PutMapping("/avaliacoes/{id}")
    public AvaliacaoResponse editar(@IdSolicitante Integer idSolicitante, @PathVariable Integer id,
                                    @Valid @RequestBody AvaliacaoRequest request) {
        return avaliacaoService.editar(idSolicitante, id, request);
    }

    @DeleteMapping("/avaliacoes/{id}")
    public ResponseEntity<Void> excluir(@IdSolicitante Integer idSolicitante, @PathVariable Integer id) {
        avaliacaoService.excluir(idSolicitante, id);
        return ResponseEntity.noContent().build();
    }
}
