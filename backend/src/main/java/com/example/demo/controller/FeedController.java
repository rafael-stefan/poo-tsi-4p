package com.example.demo.controller;

import com.example.demo.dto.response.FeedItemResponse;
import com.example.demo.security.IdSolicitante;
import com.example.demo.service.FeedService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/feed")
public class FeedController {

    private final FeedService feedService;

    public FeedController(FeedService feedService) {
        this.feedService = feedService;
    }

    @GetMapping
    public List<FeedItemResponse> listar(@IdSolicitante Integer idSolicitante,
                                         @RequestParam(defaultValue = "amigos") String escopo) {
        return feedService.listar(idSolicitante, escopo);
    }
}
