package com.example.demo.service;

import com.example.demo.dto.request.AtualizarRegistroRequest;
import com.example.demo.dto.request.RegistroJogoRequest;
import com.example.demo.dto.response.RegistroJogoResponse;
import com.example.demo.entity.AvaliacaoEntity;
import com.example.demo.entity.JogoEntity;
import com.example.demo.entity.RegistroJogoEntity;
import com.example.demo.entity.StatusJogo;
import com.example.demo.repository.AvaliacaoRepository;
import com.example.demo.repository.JogoRepository;
import com.example.demo.repository.RegistroJogoRepository;
import com.example.demo.repository.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class RegistroJogoService {

    private final RegistroJogoRepository registroJogoRepository;
    private final JogoRepository jogoRepository;
    private final UsuarioRepository usuarioRepository;
    private final AvaliacaoRepository avaliacaoRepository;

    public RegistroJogoService(RegistroJogoRepository registroJogoRepository, JogoRepository jogoRepository, UsuarioRepository usuarioRepository, AvaliacaoRepository avaliacaoRepository) {
        this.registroJogoRepository = registroJogoRepository;
        this.jogoRepository = jogoRepository;
        this.usuarioRepository = usuarioRepository;
        this.avaliacaoRepository = avaliacaoRepository;
    }

    @Transactional
    public RegistroJogoResponse cadastrar(Integer idSolicitante, RegistroJogoRequest request) {
        JogoEntity jogo = jogoRepository.findById(request.jogoId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Jogo não encontrado"));

        LocalDate dataInicio = request.dataInicio();
        if (dataInicio == null) {
            dataInicio = LocalDate.now();
        }

        validarDatas(request.status(), dataInicio, request.dataConclusao());
        validarStatus(idSolicitante, jogo.getJogoId(), request.status(), 0);

        RegistroJogoEntity registro = new RegistroJogoEntity();
        registro.setUsuario(usuarioRepository.getReferenceById(idSolicitante));
        registro.setJogo(jogo);
        registro.setStatus(request.status());
        registro.setDataInicio(dataInicio);
        registro.setDataConclusao(request.dataConclusao());
        registro.setHorasJogo(request.horasJogo());

        return montarResposta(registroJogoRepository.save(registro));
    }

    @Transactional(readOnly = true)
    public List<RegistroJogoResponse> listarMeus(Integer idSolicitante, StatusJogo status) {
        List<RegistroJogoEntity> registros;
        if (status != null) {
            registros = registroJogoRepository.findByUsuario_UsuarioIdAndStatusOrderByDataInicioDesc(idSolicitante, status);
        } else {
            registros = registroJogoRepository.findByUsuario_UsuarioIdOrderByDataInicioDesc(idSolicitante);
        }

        List<RegistroJogoResponse> resposta = new ArrayList<>();
        for (RegistroJogoEntity registro : registros) {
            resposta.add(montarResposta(registro));
        }
        return resposta;
    }

    @Transactional(readOnly = true)
    public RegistroJogoResponse buscar(Integer idSolicitante, Integer id) {
        return montarResposta(buscarDoDono(idSolicitante, id));
    }

    @Transactional
    public RegistroJogoResponse atualizar(Integer idSolicitante, Integer id, AtualizarRegistroRequest request) {
        RegistroJogoEntity registro = buscarDoDono(idSolicitante, id);

        LocalDate dataInicio = request.dataInicio();
        if (dataInicio == null) {
            dataInicio = registro.getDataInicio();
        }

        validarDatas(request.status(), dataInicio, request.dataConclusao());
        validarStatus(idSolicitante, registro.getJogo().getJogoId(), request.status(), id);

        registro.setStatus(request.status());
        registro.setDataInicio(dataInicio);
        registro.setDataConclusao(request.dataConclusao());
        registro.setHorasJogo(request.horasJogo());

        return montarResposta(registroJogoRepository.save(registro));
    }

    @Transactional
    public void remover(Integer idSolicitante, Integer id) {
        RegistroJogoEntity registro = buscarDoDono(idSolicitante, id);
        registroJogoRepository.delete(registro);
    }

    private RegistroJogoResponse montarResposta(RegistroJogoEntity registro) {
        Integer avaliacaoId = null;
        Optional<AvaliacaoEntity> avaliacao = avaliacaoRepository.findByRegistroJogo_RegistroJogoId(registro.getRegistroJogoId());
        if (avaliacao.isPresent()) {
            avaliacaoId = avaliacao.get().getAvaliacaoId();
        }
        return RegistroJogoResponse.de(registro, avaliacaoId);
    }

    private RegistroJogoEntity buscarDoDono(Integer idSolicitante, Integer id) {
        return registroJogoRepository.findByRegistroJogoIdAndUsuario_UsuarioId(id, idSolicitante)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Registro não encontrado"));
    }

    private void validarDatas(StatusJogo status, LocalDate dataInicio, LocalDate dataConclusao) {
        if (status.getExigeDataConclusao() && dataConclusao == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Informe a data de conclusão");
        }
        if (!status.getExigeDataConclusao() && dataConclusao != null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A data de conclusão só pode ser informada para jogos zerados");
        }
        if (dataInicio != null && dataConclusao != null && dataConclusao.isBefore(dataInicio)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A data de conclusão não pode ser anterior à data de início");
        }
    }

    private void validarStatus(Integer idUsuario, Integer jogoId, StatusJogo status, Integer registroIdIgnorado) {
        if (status.emAndamento()
                && registroJogoRepository.existsByUsuario_UsuarioIdAndJogo_JogoIdAndStatusInAndRegistroJogoIdNot(
                        idUsuario, jogoId, List.of(StatusJogo.JOGANDO, StatusJogo.REJOGANDO), registroIdIgnorado)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Você já tem uma run em andamento desse jogo");
        }
        if (status == StatusJogo.REJOGANDO
                && !registroJogoRepository.existsByUsuario_UsuarioIdAndJogo_JogoIdAndStatusAndRegistroJogoIdNot(
                        idUsuario, jogoId, StatusJogo.ZERADO, registroIdIgnorado)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Só é possível rejogar um jogo que você já zerou");
        }
    }
}
