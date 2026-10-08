package com.example.demo.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "usuarios")
@Inheritance(strategy = InheritanceType.JOINED)
@NoArgsConstructor
@Getter
@Setter
public class UsuarioEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer usuarioId;

    @NotBlank
    @Column(name = "nome", nullable = false)
    private String nome;

    @NotBlank
    @Email
    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @NotBlank
    @Column(name = "senha", nullable = false)
    private String senha;

    @Column(name = "foto_perfil")
    private String fotoPerfil;

    @CreationTimestamp
    @Column(name = "data_criacao", nullable = false)
    private LocalDateTime dataCriacao;

    @UpdateTimestamp
    @Column(name = "data_atualizacao")
    private LocalDateTime dataAtualizacao;

    @Column(name = "ativo", nullable = false)
    private boolean ativo = true;

    public UsuarioEntity(@NotBlank String nome, @NotBlank @Email String email, @NotBlank @Size(min = 8, max = 72) String senha, String s) {
        this.nome = nome;
        this.email = email;
        this.senha = senha;
        this.fotoPerfil = s;
    }
}
