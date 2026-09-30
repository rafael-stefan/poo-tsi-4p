package com.example.demo.entity;

public enum PlataformaJogo {
  PC("PC"),
  PLAYSTATION("PlayStation"),
  XBOX("Xbox"),
  NINTENDO_SWITCH("Nintendo Switch"),
  MOBILE("Mobile");

  private final String nome;

  PlataformaJogo(String nome) { this.nome = nome; }

  public String getNome() { return nome; }
}
