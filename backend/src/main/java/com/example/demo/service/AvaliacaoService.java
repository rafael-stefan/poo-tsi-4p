package com.example.demo.service;

import com.example.demo.dto.request.AvaliacaoRequest;
import com.example.demo.dto.response.AvaliacaoResponse;
import com.example.demo.entity.AvaliacaoEntity;
import com.example.demo.entity.RegistroJogoEntity;
import com.example.demo.repository.AvaliacaoRepository;
import com.example.demo.repository.JogoRepository;
import com.example.demo.repository.RegistroJogoRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;

@Service
public class AvaliacaoService {

    private final AvaliacaoRepository avaliacaoRepository;
    private final RegistroJogoRepository registroJogoRepository;
    private final JogoRepository jogoRepository;

    public AvaliacaoService(AvaliacaoRepository avaliacaoRepository, RegistroJogoRepository registroJogoRepository, JogoRepository jogoRepository) {
        this.avaliacaoRepository = avaliacaoRepository;
        this.registroJogoRepository = registroJogoRepository;
        this.jogoRepository = jogoRepository;
    }

    @Transactional
    public AvaliacaoResponse avaliar(Integer idSolicitante, Integer registroId, AvaliacaoRequest request) {
        RegistroJogoEntity registro = registroJogoRepository.findByRegistroJogoIdAndUsuario_UsuarioId(registroId, idSolicitante)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Registro não encontrado"));

        if (!registro.podeSerAvaliado()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Só é possível avaliar jogos zerados, rejogados ou abandonados");
        }
        if (avaliacaoRepository.existsByRegistroJogo_RegistroJogoId(registroId)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Essa run já foi avaliada; edite a avaliação existente");
        }

        AvaliacaoEntity avaliacao = new AvaliacaoEntity();
        avaliacao.setRegistroJogo(registro);
        avaliacao.setNota(request.nota());
        avaliacao.setComentario(request.comentario());

        return AvaliacaoResponse.de(avaliacaoRepository.save(avaliacao));
    }

    @Transactional
    public AvaliacaoResponse editar(Integer idSolicitante, Integer avaliacaoId, AvaliacaoRequest request) {
        AvaliacaoEntity avaliacao = buscarDoAutor(idSolicitante, avaliacaoId);

        avaliacao.setNota(request.nota());
        avaliacao.setComentario(request.comentario());

        return AvaliacaoResponse.de(avaliacaoRepository.save(avaliacao));
    }

    @Transactional
    public void excluir(Integer idSolicitante, Integer avaliacaoId) {
        AvaliacaoEntity avaliacao = buscarDoAutor(idSolicitante, avaliacaoId);
        avaliacaoRepository.delete(avaliacao);
    }

    @Transactional(readOnly = true)
    public List<AvaliacaoResponse> listarPorJogo(Integer jogoId) {
        if (!jogoRepository.existsById(jogoId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Jogo não encontrado");
        }

        List<AvaliacaoResponse> resposta = new ArrayList<>();
        for (AvaliacaoEntity avaliacao : avaliacaoRepository.findByRegistroJogo_Jogo_JogoIdOrderByDataAvaliacaoDesc(jogoId)) {
            resposta.add(AvaliacaoResponse.de(avaliacao));
        }
        return resposta;
    }

    private AvaliacaoEntity buscarDoAutor(Integer idSolicitante, Integer avaliacaoId) {
        return avaliacaoRepository.findByAvaliacaoIdAndRegistroJogo_Usuario_UsuarioId(avaliacaoId, idSolicitante)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Avaliação não encontrada"));
    }
}
