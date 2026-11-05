package com.example.demo.service;

import com.example.demo.dto.request.AmizadeRequest;
import com.example.demo.dto.response.AmigoResponse;
import com.example.demo.dto.response.AmizadeResponse;
import com.example.demo.entity.AmizadeEntity;
import com.example.demo.entity.StatusAmizade;
import com.example.demo.entity.UsuarioEntity;
import com.example.demo.repository.AmizadeRepository;
import com.example.demo.repository.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;

@Service
public class AmizadeService {

    private final AmizadeRepository amizadeRepository;
    private final UsuarioRepository usuarioRepository;

    public AmizadeService(AmizadeRepository amizadeRepository, UsuarioRepository usuarioRepository) {
        this.amizadeRepository = amizadeRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Transactional
    public AmizadeResponse enviarPedido(Integer idSolicitante, AmizadeRequest request) {
        Integer idDestinatario = request.destinatarioId();
        if (idDestinatario.equals(idSolicitante)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Não é possível adicionar a si mesmo");
        }

        UsuarioEntity destinatario = usuarioRepository.findById(idDestinatario)
                .filter(UsuarioEntity::isAtivo)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));
        UsuarioEntity solicitante = usuarioRepository.findById(idSolicitante)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));

        boolean existe = amizadeRepository.existeVinculo(idSolicitante, idDestinatario,
                List.of(StatusAmizade.PENDENTE, StatusAmizade.ACEITA));
        if (existe) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Já existe um pedido ou amizade com esse usuário");
        }

        AmizadeEntity amizade = new AmizadeEntity();
        amizade.setSolicitante(solicitante);
        amizade.setDestinatario(destinatario);
        amizade.setStatus(StatusAmizade.PENDENTE);
        return AmizadeResponse.de(amizadeRepository.save(amizade));
    }

    @Transactional
    public AmizadeResponse aceitar(Integer idSolicitante, Integer idAmizade) {
        AmizadeEntity amizade = buscarPedidoRecebido(idSolicitante, idAmizade);
        amizade.setStatus(StatusAmizade.ACEITA);
        return AmizadeResponse.de(amizadeRepository.save(amizade));
    }

    @Transactional
    public AmizadeResponse recusar(Integer idSolicitante, Integer idAmizade) {
        AmizadeEntity amizade = buscarPedidoRecebido(idSolicitante, idAmizade);
        amizade.setStatus(StatusAmizade.RECUSADA);
        return AmizadeResponse.de(amizadeRepository.save(amizade));
    }

    @Transactional
    public void remover(Integer idSolicitante, Integer idAmizade) {
        AmizadeEntity amizade = amizadeRepository.findById(idAmizade)
                .filter(a -> a.envolve(idSolicitante))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Amizade não encontrada"));
        amizadeRepository.delete(amizade);
    }

    @Transactional(readOnly = true)
    public List<AmigoResponse> listarAmigos(Integer idSolicitante) {
        List<AmigoResponse> amigos = new ArrayList<>();
        for (AmizadeEntity amizade : amizadeRepository.listarAceitas(idSolicitante)) {
            amigos.add(AmigoResponse.de(amizade, idSolicitante));
        }
        return amigos;
    }

    @Transactional(readOnly = true)
    public List<AmizadeResponse> listarPedidosRecebidos(Integer idSolicitante) {
        return amizadeRepository
                .findByDestinatario_UsuarioIdAndStatusOrderByDataAmizadeDesc(idSolicitante, StatusAmizade.PENDENTE)
                .stream()
                .map(AmizadeResponse::de)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<AmizadeResponse> listarPedidosEnviados(Integer idSolicitante) {
        return amizadeRepository
                .findBySolicitante_UsuarioIdAndStatusOrderByDataAmizadeDesc(idSolicitante, StatusAmizade.PENDENTE)
                .stream()
                .map(AmizadeResponse::de)
                .toList();
    }

    private AmizadeEntity buscarPedidoRecebido(Integer idSolicitante, Integer idAmizade) {
        AmizadeEntity amizade = amizadeRepository.findById(idAmizade)
                .filter(a -> a.getDestinatario().getUsuarioId().equals(idSolicitante))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pedido não encontrado"));
        if (amizade.getStatus() != StatusAmizade.PENDENTE) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "O pedido já foi respondido");
        }
        return amizade;
    }
}
