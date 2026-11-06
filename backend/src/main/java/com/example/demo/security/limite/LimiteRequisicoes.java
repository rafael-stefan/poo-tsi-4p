package com.example.demo.security.limite;

import com.example.demo.security.UsuarioSessao;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

import java.time.Duration;
import java.time.Instant;
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

@Component
public class LimiteRequisicoes {

    private static final int LIMITE_BUSCAS = 30;
    private static final Duration JANELA_BUSCAS = Duration.ofMinutes(1);
    private static final int LIMITE_LOGIN = 5;
    private static final Duration JANELA_LOGIN = Duration.ofMinutes(10);

    private final Map<String, Deque<Instant>> registros = new ConcurrentHashMap<>();

    public void verificarBusca(HttpServletRequest request) {
        verificar("busca:" + identificarSolicitante(request), LIMITE_BUSCAS, JANELA_BUSCAS,
                "Muitas pesquisas em pouco tempo.");
    }

    public void verificarLogin(String email) {
        verificar("login:" + email.trim().toLowerCase(), LIMITE_LOGIN, JANELA_LOGIN,
                "Muitas tentativas de login.");
    }

    private void verificar(String chave, int limite, Duration janela, String mensagem) {
        Instant agora = Instant.now();
        Deque<Instant> tentativas = registros.computeIfAbsent(chave, k -> new ArrayDeque<>());
        synchronized (tentativas) {
            while (!tentativas.isEmpty() && tentativas.peekFirst().isBefore(agora.minus(janela))) {
                tentativas.pollFirst();
            }
            if (tentativas.size() >= limite) {
                long segundos = Duration.between(agora, tentativas.peekFirst().plus(janela)).toSeconds() + 1;
                throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS,
                        mensagem + " Tente de novo em " + formatarEspera(segundos) + ".");
            }
            tentativas.addLast(agora);
        }
    }

    private String identificarSolicitante(HttpServletRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof UsuarioSessao usuario) {
            return "usuario:" + usuario.usuarioId();
        }
        return "ip:" + IpCliente.de(request);
    }

    private String formatarEspera(long segundos) {
        if (segundos < 60) {
            return segundos + " segundos";
        }
        long minutos = (segundos + 59) / 60;
        return minutos == 1 ? "1 minuto" : minutos + " minutos";
    }

    @Scheduled(fixedRate = 10, timeUnit = TimeUnit.MINUTES)
    public void limparAntigos() {
        Instant corte = Instant.now().minus(JANELA_LOGIN);
        registros.entrySet().removeIf(entrada -> {
            synchronized (entrada.getValue()) {
                return entrada.getValue().isEmpty() || entrada.getValue().peekLast().isBefore(corte);
            }
        });
    }
}
