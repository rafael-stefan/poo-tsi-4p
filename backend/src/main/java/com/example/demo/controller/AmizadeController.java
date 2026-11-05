package com.example.demo.controller;

import com.example.demo.dto.request.AmizadeRequest;
import com.example.demo.dto.response.AmigoResponse;
import com.example.demo.dto.response.AmizadeResponse;
import com.example.demo.security.IdSolicitante;
import com.example.demo.service.AmizadeService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/amizades")
public class AmizadeController {

    private final AmizadeService amizadeService;

    public AmizadeController(AmizadeService amizadeService) {
        this.amizadeService = amizadeService;
    }

    @PostMapping
    public ResponseEntity<AmizadeResponse> enviarPedido(@IdSolicitante Integer idSolicitante,
                                                        @Valid @RequestBody AmizadeRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(amizadeService.enviarPedido(idSolicitante, request));
    }

    @GetMapping
    public List<AmigoResponse> listarAmigos(@IdSolicitante Integer idSolicitante) {
        return amizadeService.listarAmigos(idSolicitante);
    }

    @GetMapping("/pedidos/recebidos")
    public List<AmizadeResponse> listarPedidosRecebidos(@IdSolicitante Integer idSolicitante) {
        return amizadeService.listarPedidosRecebidos(idSolicitante);
    }

    @GetMapping("/pedidos/enviados")
    public List<AmizadeResponse> listarPedidosEnviados(@IdSolicitante Integer idSolicitante) {
        return amizadeService.listarPedidosEnviados(idSolicitante);
    }

    @PatchMapping("/{id}/aceitar")
    public AmizadeResponse aceitar(@IdSolicitante Integer idSolicitante, @PathVariable Integer id) {
        return amizadeService.aceitar(idSolicitante, id);
    }

    @PatchMapping("/{id}/recusar")
    public AmizadeResponse recusar(@IdSolicitante Integer idSolicitante, @PathVariable Integer id) {
        return amizadeService.recusar(idSolicitante, id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remover(@IdSolicitante Integer idSolicitante, @PathVariable Integer id) {
        amizadeService.remover(idSolicitante, id);
        return ResponseEntity.noContent().build();
    }
}
