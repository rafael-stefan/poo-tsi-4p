package com.example.demo.service;

import com.example.demo.dto.response.AmizadeResumoResponse;
import com.example.demo.dto.response.AvaliacaoResponse;
import com.example.demo.dto.response.PerfilResponse;
import com.example.demo.dto.response.RegistroJogoResponse;
import com.example.demo.dto.response.UsuarioResumoResponse;
import com.example.demo.entity.AmizadeEntity;
import com.example.demo.entity.AvaliacaoEntity;
import com.example.demo.entity.RegistroJogoEntity;
import com.example.demo.entity.StatusAmizade;
import com.example.demo.entity.StatusJogo;
import com.example.demo.entity.UsuarioEntity;
import com.example.demo.model.Estatisticas;
import com.example.demo.repository.AmizadeRepository;
import com.example.demo.repository.AvaliacaoRepository;
import com.example.demo.repository.RegistroJogoRepository;
import com.example.demo.repository.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class PerfilService {

    private final UsuarioRepository usuarioRepository;
    private final RegistroJogoRepository registroJogoRepository;
    private final AvaliacaoRepository avaliacaoRepository;
    private final AmizadeRepository amizadeRepository;

    public PerfilService(UsuarioRepository usuarioRepository, RegistroJogoRepository registroJogoRepository, AvaliacaoRepository avaliacaoRepository, AmizadeRepository amizadeRepository) {
        this.usuarioRepository = usuarioRepository;
        this.registroJogoRepository = registroJogoRepository;
        this.avaliacaoRepository = avaliacaoRepository;
        this.amizadeRepository = amizadeRepository;
    }

    public boolean podeVer(Integer idSolicitante, Integer idUsuario) {
        if (idSolicitante.equals(idUsuario)) {
            return true;
        }
        return amizadeRepository.existeVinculo(idSolicitante, idUsuario, List.of(StatusAmizade.ACEITA));
    }

    @Transactional(readOnly = true)
    public PerfilResponse buscarPerfil(Integer idSolicitante, Integer idUsuario) {
        UsuarioEntity usuario = buscarUsuarioVisivel(idSolicitante, idUsuario);

        Map<StatusJogo, List<RegistroJogoResponse>> jogosPorStatus = new LinkedHashMap<>();
        for (StatusJogo status : StatusJogo.values()) {
            List<RegistroJogoResponse> registros = new ArrayList<>();
            for (RegistroJogoEntity registro : registroJogoRepository.findByUsuario_UsuarioIdAndStatusOrderByDataInicioDesc(idUsuario, status)) {
                registros.add(montarRegistro(registro));
            }
            jogosPorStatus.put(status, registros);
        }

        List<AvaliacaoResponse> avaliacoes = new ArrayList<>();
        for (AvaliacaoEntity avaliacao : avaliacaoRepository.findByRegistroJogo_Usuario_UsuarioIdOrderByDataAvaliacaoDesc(idUsuario)) {
            avaliacoes.add(AvaliacaoResponse.de(avaliacao));
        }

        AmizadeResumoResponse amizade = null;
        if (!idSolicitante.equals(idUsuario)) {
            AmizadeEntity entidade = amizadeRepository.buscarAceitaEntre(idSolicitante, idUsuario).orElse(null);
            if (entidade != null) {
                amizade = AmizadeResumoResponse.de(entidade);
            }
        }

        return new PerfilResponse(UsuarioResumoResponse.de(usuario), calcularEstatisticas(idUsuario), jogosPorStatus, avaliacoes, amizade);
    }

    @Transactional(readOnly = true)
    public Estatisticas buscarEstatisticas(Integer idSolicitante, Integer idUsuario) {
        buscarUsuarioVisivel(idSolicitante, idUsuario);
        return calcularEstatisticas(idUsuario);
    }

    private UsuarioEntity buscarUsuarioVisivel(Integer idSolicitante, Integer idUsuario) {
        UsuarioEntity usuario = usuarioRepository.findById(idUsuario).orElse(null);
        if (usuario == null || !usuario.isAtivo() || !podeVer(idSolicitante, idUsuario)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado");
        }
        return usuario;
    }

    private Estatisticas calcularEstatisticas(Integer idUsuario) {
        long zerados = registroJogoRepository.contarJogosPorStatus(idUsuario, List.of(StatusJogo.ZERADO));
        long emAndamento = registroJogoRepository.contarJogosPorStatus(idUsuario, List.of(StatusJogo.JOGANDO, StatusJogo.REJOGANDO));
        long desistidos = registroJogoRepository.contarJogosPorStatus(idUsuario, List.of(StatusJogo.DESISTIDO));
        long totalRuns = registroJogoRepository.countByUsuario_UsuarioId(idUsuario);
        double media = avaliacaoRepository.mediaPorUsuario(idUsuario);
        long horas = registroJogoRepository.somarHoras(idUsuario);
        return new Estatisticas(zerados, emAndamento, desistidos, totalRuns, media, horas);
    }

    private RegistroJogoResponse montarRegistro(RegistroJogoEntity registro) {
        AvaliacaoEntity avaliacao = avaliacaoRepository.findByRegistroJogo_RegistroJogoId(registro.getRegistroJogoId()).orElse(null);
        return RegistroJogoResponse.de(registro, avaliacao);
    }
}
