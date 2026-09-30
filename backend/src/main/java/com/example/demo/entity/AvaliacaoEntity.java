package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "avaliacoes")
@Getter
@Setter
public class AvaliacaoEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer avaliacaoId;

    @Column(name = "nota", nullable = false)
    private Double nota;

    @Column(name = "comentario", length = 500)
    private String comentario;

    @CreationTimestamp
    @Column(name = "data_avaliacao")
    private LocalDateTime dataAvaliacao;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "registro_jogo_id", nullable = false, unique = true)
    private RegistroJogoEntity registroJogo;
}
