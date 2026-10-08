package com.example.demo.security.jwt.revogar;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Entity
@Table(name = "tokens_revogados")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class TokenRevogadoEntity {
    @Id
    @Column(name = "jti", length = 36)
    private String jti;

    @Column(name = "expira_em", nullable = false)
    private Instant expiraEm;
}
