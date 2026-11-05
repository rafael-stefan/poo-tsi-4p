package com.example.demo.service;

import com.example.demo.dto.response.DestaquesResponse;
import com.example.demo.dto.response.JogoDestaqueResponse;
import com.example.demo.dto.response.JogoResumoResponse;
import com.example.demo.entity.JogoEntity;
import com.example.demo.entity.StatusJogo;
import com.example.demo.repository.AvaliacaoRepository;
import com.example.demo.repository.JogoRepository;
import com.example.demo.repository.RegistroJogoRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class DestaqueService {

    private final JogoRepository jogoRepository;
    private final RegistroJogoRepository registroJogoRepository;
    private final AvaliacaoRepository avaliacaoRepository;

    public DestaqueService(JogoRepository jogoRepository, RegistroJogoRepository registroJogoRepository, AvaliacaoRepository avaliacaoRepository) {
        this.jogoRepository = jogoRepository;
        this.registroJogoRepository = registroJogoRepository;
        this.avaliacaoRepository = avaliacaoRepository;
    }

    @Transactional(readOnly = true)
    public DestaquesResponse buscar() {
        List<JogoDestaqueResponse> melhores = new ArrayList<>();
        for (Object[] linha : avaliacaoRepository.rankingPorMedia(PageRequest.of(0, 6))) {
            JogoDestaqueResponse destaque = montar((Integer) linha[0], 0);
            if (destaque != null) {
                melhores.add(destaque);
            }
        }

        JogoDestaqueResponse manchete = null;
        if (!melhores.isEmpty()) {
            manchete = melhores.get(0);
        }

        return new DestaquesResponse(
            manchete,
            rankingPorStatus(List.of(StatusJogo.ZERADO)),
            rankingPorStatus(List.of(StatusJogo.JOGANDO, StatusJogo.REJOGANDO)),
            rankingPorStatus(List.of(StatusJogo.REJOGANDO)),
            rankingPorStatus(List.of(StatusJogo.DESISTIDO)),
            melhores
        );
    }

    private JogoDestaqueResponse rankingPorStatus(List<StatusJogo> status) {
        List<Object[]> ranking = registroJogoRepository.rankingPorStatus(status, PageRequest.of(0, 1));
        if (ranking.isEmpty()) {
            return null;
        }
        Object[] linha = ranking.get(0);
        return montar((Integer) linha[0], (Long) linha[1]);
    }

    private JogoDestaqueResponse montar(Integer jogoId, long pessoas) {
        JogoEntity jogo = jogoRepository.findById(jogoId).orElse(null);
        if (jogo == null) {
            return null;
        }
        Double notaMedia = avaliacaoRepository.mediaPorJogo(jogoId);
        long total = avaliacaoRepository.countByRegistroJogo_Jogo_JogoId(jogoId);
        return new JogoDestaqueResponse(JogoResumoResponse.de(jogo), jogo.getGenero(), notaMedia, total, pessoas);
    }
}
