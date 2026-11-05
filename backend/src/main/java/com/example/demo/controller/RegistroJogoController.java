package com.example.demo.controller;

import com.example.demo.dto.request.AtualizarRegistroRequest;
import com.example.demo.dto.request.RegistroJogoRequest;
import com.example.demo.dto.response.RegistroJogoResponse;
import com.example.demo.entity.StatusJogo;
import com.example.demo.security.IdSolicitante;
import com.example.demo.service.RegistroJogoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/registros")
public class RegistroJogoController {

    private final RegistroJogoService registroJogoService;

    public RegistroJogoController(RegistroJogoService registroJogoService) {
        this.registroJogoService = registroJogoService;
    }

    @PostMapping
    public ResponseEntity<RegistroJogoResponse> cadastrar(@IdSolicitante Integer idSolicitante,
                                                          @Valid @RequestBody RegistroJogoRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(registroJogoService.cadastrar(idSolicitante, request));
    }

    @GetMapping
    public List<RegistroJogoResponse> listarMeus(@IdSolicitante Integer idSolicitante,
                                                 @RequestParam(required = false) StatusJogo status,
                                                 @RequestParam(required = false) Integer jogoId) {
        return registroJogoService.listarMeus(idSolicitante, status, jogoId);
    }

    @GetMapping("/{id}")
    public RegistroJogoResponse buscar(@IdSolicitante Integer idSolicitante, @PathVariable Integer id) {
        return registroJogoService.buscar(idSolicitante, id);
    }

    @PutMapping("/{id}")
    public RegistroJogoResponse atualizar(@IdSolicitante Integer idSolicitante, @PathVariable Integer id,
                                          @Valid @RequestBody AtualizarRegistroRequest request) {
        return registroJogoService.atualizar(idSolicitante, id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remover(@IdSolicitante Integer idSolicitante, @PathVariable Integer id) {
        registroJogoService.remover(idSolicitante, id);
        return ResponseEntity.noContent().build();
    }
}
