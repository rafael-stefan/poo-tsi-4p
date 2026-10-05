package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "amizades", check = @CheckConstraint(
  name = "ck_amizade_sem_autovinculo",
  constraint = "id_solicitante <> id_destinatario"))
@Getter
@Setter
public class AmizadeEntity {
    @Id
    @GeneratedValue( strategy = GenerationType.IDENTITY)
    private Integer amizadeId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "solicitante_id", nullable = false)
    private UsuarioEntity solicitante;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "destinatario_id", nullable = false)
    private UsuarioEntity destinatario;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private StatusAmizade status = StatusAmizade.PENDENTE;

    @CreationTimestamp
    @Column(name = "data_amizade", nullable = false)
    private LocalDateTime data_amizade;
}
