package com.example.demo.controller;

import com.example.demo.dto.response.AvaliacaoResponse;
import com.example.demo.dto.response.JogoResponse;
import com.example.demo.dto.response.PlataformaResponse;
import com.example.demo.service.AvaliacaoService;
import com.example.demo.service.JogoService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/jogos")
public class JogoController {

    private final JogoService jogoService;
    private final AvaliacaoService avaliacaoService;

    public JogoController(JogoService jogoService, AvaliacaoService avaliacaoService) {
        this.jogoService = jogoService;
        this.avaliacaoService = avaliacaoService;
    }

    @GetMapping
    public List<JogoResponse> pesquisar(@RequestParam(required = false) String titulo,
                                        @RequestParam(required = false) String genero) {
        return jogoService.pesquisar(titulo, genero);
    }

    @GetMapping("/plataformas")
    public List<PlataformaResponse> listarPlataformas() {
        return jogoService.listarPlataformas();
    }

    @GetMapping("/{id}")
    public JogoResponse buscarPorId(@PathVariable Integer id) {
        return jogoService.buscarPorId(id);
    }

    @GetMapping("/{id}/avaliacoes")
    public List<AvaliacaoResponse> listarAvaliacoes(@PathVariable Integer id) {
        return avaliacaoService.listarPorJogo(id);
    }
}
