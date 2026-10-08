package com.example.demo.security.jwt;

import java.time.Instant;
import java.util.List;

public record TokenValido(Integer usuarioId, String jti, Instant expiraEm, List<String> roles) {
}
