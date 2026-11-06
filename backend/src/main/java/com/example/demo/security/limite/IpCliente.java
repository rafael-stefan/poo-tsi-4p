package com.example.demo.security.limite;

import jakarta.servlet.http.HttpServletRequest;

public class IpCliente {

    public static String de(HttpServletRequest request) {
        String encaminhado = request.getHeader("X-Forwarded-For");
        if (encaminhado != null && !encaminhado.isBlank()) {
            return encaminhado.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
