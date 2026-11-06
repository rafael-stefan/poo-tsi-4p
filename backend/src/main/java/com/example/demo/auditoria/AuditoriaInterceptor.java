package com.example.demo.auditoria;

import com.example.demo.security.UsuarioSessao;
import com.example.demo.security.limite.IpCliente;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.util.Set;

@Component
public class AuditoriaInterceptor implements HandlerInterceptor {

    public static final String ATRIBUTO_USUARIO = "auditoria.usuarioId";
    private static final Set<String> METODOS_AUDITADOS = Set.of("POST", "PUT", "PATCH", "DELETE");

    private final LogAuditoriaRepository logAuditoriaRepository;

    public AuditoriaInterceptor(LogAuditoriaRepository logAuditoriaRepository) {
        this.logAuditoriaRepository = logAuditoriaRepository;
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) {
        if (!METODOS_AUDITADOS.contains(request.getMethod())) {
            return;
        }
        logAuditoriaRepository.save(new LogAuditoriaEntity(
                identificarUsuario(request),
                IpCliente.de(request),
                request.getMethod(),
                request.getRequestURI(),
                response.getStatus()));
    }

    private Integer identificarUsuario(HttpServletRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof UsuarioSessao usuario) {
            return usuario.usuarioId();
        }
        if (request.getAttribute(ATRIBUTO_USUARIO) instanceof Integer id) {
            return id;
        }
        return null;
    }
}
