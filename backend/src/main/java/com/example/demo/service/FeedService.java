package com.example.demo.service;

import com.example.demo.dto.response.FeedItemResponse;
import com.example.demo.entity.AmizadeEntity;
import com.example.demo.entity.AvaliacaoEntity;
import com.example.demo.entity.RegistroJogoEntity;
import com.example.demo.repository.AmizadeRepository;
import com.example.demo.repository.AvaliacaoRepository;
import com.example.demo.repository.RegistroJogoRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
public class FeedService {

    private final RegistroJogoRepository registroJogoRepository;
    private final AvaliacaoRepository avaliacaoRepository;
    private final AmizadeRepository amizadeRepository;

    public FeedService(RegistroJogoRepository registroJogoRepository, AvaliacaoRepository avaliacaoRepository, AmizadeRepository amizadeRepository) {
        this.registroJogoRepository = registroJogoRepository;
        this.avaliacaoRepository = avaliacaoRepository;
        this.amizadeRepository = amizadeRepository;
    }

    @Transactional(readOnly = true)
    public List<FeedItemResponse> listar(Integer idSolicitante, String escopo) {
        String escopoUsado = escopo;
        if (escopoUsado == null || escopoUsado.isBlank()) {
            escopoUsado = "amigos";
        }
        if (!escopoUsado.equals("amigos") && !escopoUsado.equals("comunidade")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Escopo inválido");
        }

        List<RegistroJogoEntity> registros;
        List<AvaliacaoEntity> avaliacoes;
        if (escopoUsado.equals("amigos")) {
            List<Integer> idsAmigos = new ArrayList<>();
            for (AmizadeEntity amizade : amizadeRepository.listarAceitas(idSolicitante)) {
                idsAmigos.add(amizade.obterAmigoDe(idSolicitante).getUsuarioId());
            }
            if (idsAmigos.isEmpty()) {
                return new ArrayList<>();
            }
            registros = registroJogoRepository.listarRecentesDosUsuarios(idsAmigos, PageRequest.of(0, 30));
            avaliacoes = avaliacaoRepository.findTop30ByRegistroJogo_Usuario_UsuarioIdInAndRegistroJogo_Usuario_AtivoTrueOrderByDataAvaliacaoDesc(idsAmigos);
        } else {
            registros = registroJogoRepository.listarRecentes(PageRequest.of(0, 30));
            avaliacoes = avaliacaoRepository.findTop30ByRegistroJogo_Usuario_AtivoTrueOrderByDataAvaliacaoDesc();
        }

        List<FeedItemResponse> itens = new ArrayList<>();
        for (RegistroJogoEntity registro : registros) {
            itens.add(FeedItemResponse.deRun(registro));
        }
        for (AvaliacaoEntity avaliacao : avaliacoes) {
            itens.add(FeedItemResponse.deAvaliacao(avaliacao));
        }

        itens.sort(Comparator.comparing(FeedItemResponse::quando, Comparator.nullsLast(Comparator.<LocalDateTime>reverseOrder())));

        if (itens.size() > 30) {
            return new ArrayList<>(itens.subList(0, 30));
        }
        return itens;
    }
}
