package com.example.demo.controller;

import com.example.demo.dto.request.JogoRequest;
import com.example.demo.dto.response.JogoResponse;
import com.example.demo.service.JogoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin/jogos")
public class AdminJogoController {

    private final JogoService jogoService;

    public AdminJogoController(JogoService jogoService) {
        this.jogoService = jogoService;
    }

    @PostMapping
    public ResponseEntity<JogoResponse> cadastrar(@Valid @RequestBody JogoRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(jogoService.cadastrar(request));
    }

    @PutMapping("/{id}")
    public JogoResponse atualizar(@PathVariable Integer id, @Valid @RequestBody JogoRequest request) {
        return jogoService.atualizar(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remover(@PathVariable Integer id) {
        jogoService.remover(id);
        return ResponseEntity.noContent().build();
    }
}
