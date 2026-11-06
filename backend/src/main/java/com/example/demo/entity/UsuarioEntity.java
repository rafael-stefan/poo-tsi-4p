package com.example.demo.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;

@Entity
@Table(name = "usuarios")
@Inheritance(strategy = InheritanceType.JOINED)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
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
    @Column(name = "data_criacao", nullable = false, updatable = false)
    private LocalDateTime dataCriacao;

    @UpdateTimestamp
    @Column(name = "data_atualizacao")
    private LocalDateTime dataAtualizacao;

    @Column(name = "ativo", nullable = false)
    private boolean ativo = true;

    public UsuarioEntity(String nome, String email, String senhaHash, String fotoPerfil) {
        this.nome = nome;
        this.email = email;
        this.senha = senhaHash;
        this.fotoPerfil = fotoPerfil;
    }

    public boolean validarIdentidade(Integer idSolicitante) {
        return idSolicitante != null && idSolicitante.equals(usuarioId);
    }

    public boolean validarSenha(String senha, PasswordEncoder encoder) {
        return senha != null && encoder.matches(senha, this.senha);
    }

    public void editarPerfil(String nome, String fotoPerfil) {
        this.nome = nome;
        this.fotoPerfil = fotoPerfil;
    }

    public void alterarSenha(String novaSenhaHash) {
        this.senha = novaSenhaHash;
    }
}
