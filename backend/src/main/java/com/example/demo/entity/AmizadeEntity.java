package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "amizades", check = @CheckConstraint(
  name = "ck_amizade_sem_autovinculo",
  constraint = "solicitante_id <> destinatario_id"))
@Getter
@Setter
public class AmizadeEntity {
    @Id
    @GeneratedValue( strategy = GenerationType.IDENTITY)
    private Integer amizadeId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "solicitante_id", nullable = false)
    private UsuarioEntity solicitante;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "destinatario_id", nullable = false)
    private UsuarioEntity destinatario;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private StatusAmizade status = StatusAmizade.PENDENTE;

    @CreationTimestamp
    @Column(name = "data_amizade", nullable = false, updatable = false)
    private LocalDateTime dataAmizade;

    public boolean envolve(Integer idUsuario) {
        return solicitante.getUsuarioId().equals(idUsuario) || destinatario.getUsuarioId().equals(idUsuario);
    }

    public UsuarioEntity obterAmigoDe(Integer idUsuario) {
        if (solicitante.getUsuarioId().equals(idUsuario)) {
            return destinatario;
        }
        return solicitante;
    }
}
