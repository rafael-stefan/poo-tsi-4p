package com.example.demo.security.jwt.revogar;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.Instant;

@Component
public class LimpezaTokensJob {

    private final TokenRevogadoRepository tokenRevogadoRepository;

    public LimpezaTokensJob(TokenRevogadoRepository tokenRevogadoRepository) {
        this.tokenRevogadoRepository = tokenRevogadoRepository;
    }

    @Scheduled(fixedRate = 60 * 60 * 1000)
    public void apagarExpirados() {
        tokenRevogadoRepository.apagarExpirados(Instant.now());
    }
}
