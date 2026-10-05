package com.example.demo.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDateTime;

@Entity
@Table(name = "avaliacoes")
@Getter
@Setter
public class AvaliacaoEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer avaliacaoId;

    @NotNull
    @Min(value = 0, message = "A nota deve ser maior ou igual a zero")
    @Max(value = 10, message = "A nota deve ser menor ou igual a dez")
    @Column(name = "nota", nullable = false)
    private Double nota;

    @Column(name = "comentario", length = 500)
    private String comentario;

    @CreationTimestamp
    @Column(name = "data_avaliacao")
    private LocalDateTime dataAvaliacao;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "registro_jogo_id", nullable = false, unique = true)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private RegistroJogoEntity registroJogo;
}
