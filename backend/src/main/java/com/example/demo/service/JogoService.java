package com.example.demo.service;

import com.example.demo.dto.request.JogoRequest;
import com.example.demo.dto.response.EstatisticasJogoResponse;
import com.example.demo.dto.response.FaixaNotaResponse;
import com.example.demo.dto.response.JogoResponse;
import com.example.demo.dto.response.PlataformaResponse;
import com.example.demo.entity.JogoEntity;
import com.example.demo.entity.PlataformaJogo;
import com.example.demo.entity.StatusJogo;
import com.example.demo.repository.AvaliacaoRepository;
import com.example.demo.repository.JogoRepository;
import com.example.demo.repository.RegistroJogoRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class JogoService {

    private final JogoRepository jogoRepository;
    private final RegistroJogoRepository registroJogoRepository;
    private final AvaliacaoRepository avaliacaoRepository;

    public JogoService(JogoRepository jogoRepository, RegistroJogoRepository registroJogoRepository, AvaliacaoRepository avaliacaoRepository) {
        this.jogoRepository = jogoRepository;
        this.registroJogoRepository = registroJogoRepository;
        this.avaliacaoRepository = avaliacaoRepository;
    }

    @Transactional(readOnly = true)
    public List<JogoResponse> pesquisar(String titulo, String genero, PlataformaJogo plataforma, String ordem) {
        List<JogoEntity> jogos;
        if (titulo != null && !titulo.isBlank()) {
            jogos = jogoRepository.findByTituloContainingIgnoreCaseOrderByTituloAsc(titulo.trim());
        } else if (genero != null && !genero.isBlank()) {
            jogos = jogoRepository.findByGeneroIgnoreCaseOrderByTituloAsc(genero.trim());
        } else if (plataforma != null) {
            jogos = jogoRepository.buscarPorPlataforma(plataforma);
        } else if ("recentes".equals(ordem)) {
            jogos = jogoRepository.findTop12ByOrderByJogoIdDesc();
        } else {
            jogos = jogoRepository.findAllByOrderByTituloAsc();
        }

        List<JogoResponse> resposta = new ArrayList<>();
        for (JogoEntity jogo : jogos) {
            resposta.add(montarResposta(jogo));
        }
        return resposta;
    }

    @Transactional(readOnly = true)
    public JogoResponse buscarPorId(Integer id) {
        JogoEntity jogo = jogoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Jogo não encontrado"));
        return montarResposta(jogo);
    }

    public List<String> listarGeneros() {
        return jogoRepository.listarGeneros();
    }

    @Transactional(readOnly = true)
    public EstatisticasJogoResponse estatisticas(Integer id) {
        if (!jogoRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Jogo não encontrado");
        }

        Map<StatusJogo, Long> pessoasPorStatus = new LinkedHashMap<>();
        for (StatusJogo status : StatusJogo.values()) {
            pessoasPorStatus.put(status, 0L);
        }
        for (Object[] linha : registroJogoRepository.contarPessoasPorStatus(id)) {
            pessoasPorStatus.put((StatusJogo) linha[0], (Long) linha[1]);
        }

        long faixa9 = 0;
        long faixa7 = 0;
        long faixa5 = 0;
        long faixa0 = 0;
        for (Double nota : avaliacaoRepository.listarNotasDoJogo(id)) {
            if (nota >= 9) {
                faixa9++;
            } else if (nota >= 7) {
                faixa7++;
            } else if (nota >= 5) {
                faixa5++;
            } else {
                faixa0++;
            }
        }

        List<FaixaNotaResponse> distribuicao = new ArrayList<>();
        distribuicao.add(new FaixaNotaResponse("9-10", faixa9));
        distribuicao.add(new FaixaNotaResponse("7-8", faixa7));
        distribuicao.add(new FaixaNotaResponse("5-6", faixa5));
        distribuicao.add(new FaixaNotaResponse("0-4", faixa0));

        return new EstatisticasJogoResponse(pessoasPorStatus, distribuicao);
    }

    public List<PlataformaResponse> listarPlataformas() {
        List<PlataformaResponse> resposta = new ArrayList<>();
        for (PlataformaJogo plataforma : PlataformaJogo.values()) {
            resposta.add(PlataformaResponse.de(plataforma));
        }
        return resposta;
    }

    @Transactional
    public JogoResponse cadastrar(JogoRequest request) {
        String titulo = request.titulo().trim();
        if (jogoRepository.existsByTituloIgnoreCase(titulo)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Já existe um jogo com esse título");
        }

        JogoEntity jogo = new JogoEntity();
        jogo.setTitulo(titulo);
        jogo.setGenero(request.genero());
        jogo.setCapa(request.capa());
        jogo.getPlataformas().addAll(request.plataformas());
        jogo.setDesenvolvedora(request.desenvolvedora());
        jogo.setAnoLancamento(request.anoLancamento());

        return montarResposta(jogoRepository.save(jogo));
    }

    @Transactional
    public JogoResponse atualizar(Integer id, JogoRequest request) {
        JogoEntity jogo = jogoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Jogo não encontrado"));

        String titulo = request.titulo().trim();
        if (jogoRepository.existsByTituloIgnoreCaseAndJogoIdNot(titulo, id)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Já existe um jogo com esse título");
        }

        jogo.setTitulo(titulo);
        jogo.setGenero(request.genero());
        jogo.setCapa(request.capa());
        jogo.getPlataformas().clear();
        jogo.getPlataformas().addAll(request.plataformas());
        jogo.setDesenvolvedora(request.desenvolvedora());
        jogo.setAnoLancamento(request.anoLancamento());

        return montarResposta(jogoRepository.save(jogo));
    }

    @Transactional
    public void remover(Integer id) {
        JogoEntity jogo = jogoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Jogo não encontrado"));

        if (registroJogoRepository.existsByJogo_JogoId(id)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "O jogo está na biblioteca de usuários e não pode ser removido");
        }

        jogoRepository.delete(jogo);
    }

    private JogoResponse montarResposta(JogoEntity jogo) {
        Double notaMedia = avaliacaoRepository.mediaPorJogo(jogo.getJogoId());
        long total = avaliacaoRepository.countByRegistroJogo_Jogo_JogoId(jogo.getJogoId());
        return JogoResponse.de(jogo, notaMedia, total);
    }
}
