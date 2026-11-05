package com.example.demo.controller;

import com.example.demo.dto.response.DestaquesResponse;
import com.example.demo.service.DestaqueService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/destaques")
public class DestaqueController {

    private final DestaqueService destaqueService;

    public DestaqueController(DestaqueService destaqueService) {
        this.destaqueService = destaqueService;
    }

    @GetMapping
    public DestaquesResponse buscar() {
        return destaqueService.buscar();
    }
}
