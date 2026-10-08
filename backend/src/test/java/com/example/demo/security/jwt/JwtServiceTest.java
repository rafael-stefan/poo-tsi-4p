package com.example.demo.security.jwt;

import com.example.demo.entity.AdminEntity;
import com.example.demo.entity.UsuarioEntity;
import com.example.demo.security.UsuarioAutenticado;
import org.junit.jupiter.api.Test;

import java.time.Duration;
import java.time.Instant;
import java.util.Base64;

import static org.assertj.core.api.Assertions.assertThat;

class JwtServiceTest {

    private static final String SEGREDO = Base64.getEncoder()
            .encodeToString("segredo-de-teste-com-32-bytes!!!".getBytes());

    private final JwtService jwtService = new JwtService(SEGREDO, Duration.ofHours(1));

    @Test
    void tokenGeradoValidaComIdJtiExpiracaoERoles() {
        UsuarioEntity usuario = new UsuarioEntity("Ana", "ana@email.com", "hash", null);
        usuario.setUsuarioId(42);

        TokenValido token = jwtService.validar(jwtService.gerarToken(UsuarioAutenticado.de(usuario))).orElseThrow();

        assertThat(token.usuarioId()).isEqualTo(42);
        assertThat(token.jti()).isNotBlank();
        assertThat(token.expiraEm()).isAfter(Instant.now());
        assertThat(token.roles()).containsExactly("ROLE_USUARIO");
    }

    @Test
    void adminRecebeAsDuasRoles() {
        AdminEntity admin = new AdminEntity();
        admin.setUsuarioId(7);
        admin.setEmail("admin@email.com");
        admin.setSenha("hash");

        TokenValido token = jwtService.validar(jwtService.gerarToken(UsuarioAutenticado.de(admin))).orElseThrow();

        assertThat(token.roles()).containsExactly("ROLE_USUARIO", "ROLE_ADMIN");
    }

    @Test
    void cadaTokenTemJtiDiferente() {
        UsuarioEntity usuario = new UsuarioEntity("Ana", "ana@email.com", "hash", null);
        usuario.setUsuarioId(42);
        UsuarioAutenticado autenticado = UsuarioAutenticado.de(usuario);

        String jti1 = jwtService.validar(jwtService.gerarToken(autenticado)).orElseThrow().jti();
        String jti2 = jwtService.validar(jwtService.gerarToken(autenticado)).orElseThrow().jti();

        assertThat(jti1).isNotEqualTo(jti2);
    }

    @Test
    void tokenAdulteradoEhRecusado() {
        UsuarioEntity usuario = new UsuarioEntity("Ana", "ana@email.com", "hash", null);
        usuario.setUsuarioId(42);
        String token = jwtService.gerarToken(UsuarioAutenticado.de(usuario));
        String[] partes = token.split("\\.");
        String payloadForjado = Base64.getUrlEncoder().withoutPadding()
                .encodeToString("{\"sub\":\"1\",\"roles\":[\"ROLE_ADMIN\"]}".getBytes());

        String adulterado = partes[0] + "." + payloadForjado + "." + partes[2];

        assertThat(jwtService.validar(adulterado)).isEmpty();
    }

    @Test
    void tokenAssinadoComOutroSegredoEhRecusado() {
        String outroSegredo = Base64.getEncoder()
                .encodeToString("outro-segredo-tambem-de-32-bytes".getBytes());
        JwtService outroServico = new JwtService(outroSegredo, Duration.ofHours(1));
        UsuarioEntity usuario = new UsuarioEntity("Ana", "ana@email.com", "hash", null);
        usuario.setUsuarioId(42);

        String tokenDeOutraChave = outroServico.gerarToken(UsuarioAutenticado.de(usuario));

        assertThat(jwtService.validar(tokenDeOutraChave)).isEmpty();
    }

    @Test
    void tokenExpiradoEhRecusado() {
        JwtService jaExpira = new JwtService(SEGREDO, Duration.ofSeconds(-1));
        UsuarioEntity usuario = new UsuarioEntity("Ana", "ana@email.com", "hash", null);
        usuario.setUsuarioId(42);

        String expirado = jaExpira.gerarToken(UsuarioAutenticado.de(usuario));

        assertThat(jwtService.validar(expirado)).isEmpty();
    }

    @Test
    void valoresInvalidosNaoLancamExcecao() {
        assertThat(jwtService.validar(null)).isEmpty();
        assertThat(jwtService.validar("")).isEmpty();
        assertThat(jwtService.validar("nao.e.um.jwt")).isEmpty();
    }
}
