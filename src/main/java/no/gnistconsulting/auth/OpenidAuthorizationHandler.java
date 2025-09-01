package no.gnistconsulting.auth;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.ws.rs.InternalServerErrorException;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import no.gnistconsulting.openid.model.DiscoveryDocumentDto;
import no.gnistconsulting.openid.model.UserinfoDto;
import org.eclipse.jetty.security.AuthenticationState;
import org.eclipse.jetty.security.UserPrincipal;
import org.eclipse.jetty.security.authentication.LoginAuthenticator;
import org.eclipse.jetty.security.internal.DefaultUserIdentity;
import org.eclipse.jetty.server.CookieCache;
import org.eclipse.jetty.server.Handler;
import org.eclipse.jetty.server.Request;
import org.eclipse.jetty.server.Response;
import org.eclipse.jetty.server.handler.ContextHandler;
import org.eclipse.jetty.util.Callback;

import javax.security.auth.Subject;
import java.net.HttpURLConnection;
import java.util.Set;

@Slf4j
public class OpenidAuthorizationHandler extends ContextHandler {
    private static final ObjectMapper mapper = new ObjectMapper();
    private final OpenIdClientConfiguration environment;

    public OpenidAuthorizationHandler(OpenIdClientConfiguration environment, Handler handler) {
        setHandler(handler);
        this.environment = environment;
    }

    @Override
    public boolean handle(Request request, Response response, Callback callback) throws Exception {
        CookieCache.getCookies(request).stream()
                .filter(c -> c.getName().equals("accessToken")).findAny()
                .ifPresent(cookie -> setUserPrincipal(request, cookie.getValue()));
        return super.handle(request, response, callback);
    }

    @SneakyThrows
    private void setUserPrincipal(Request request, String value) {
        var connection = (HttpURLConnection) getDiscoveryDocument().getUserinfo_endpoint().toURL().openConnection();
        connection.setRequestProperty("Authorization", "Bearer " + value);
        if (connection.getResponseCode() == 401) {
            log.debug("Expired cookie");
            return;
        }
        if (connection.getResponseCode() != 200) {
            throw new InternalServerErrorException(jakarta.ws.rs.core.Response.status(500).entity("Failed to get userinfo status=" + connection.getResponseCode()).build());
        }
        var userinfo = mapper.readValue(connection.getInputStream(), UserinfoDto.class);
        var principal = new UserPrincipal(userinfo.getName(), null);
        AuthenticationState.setAuthenticationState(
                request,
                new LoginAuthenticator.UserAuthenticationSucceeded("openid-connect", createUserIdentity(principal))
        );
    }

    private static DefaultUserIdentity createUserIdentity(UserPrincipal principal) {
        var subject = new Subject(true, Set.of(principal), Set.of(), Set.of());
        return new DefaultUserIdentity(subject, principal, new String[0]);
    }

    @SneakyThrows
    private DiscoveryDocumentDto getDiscoveryDocument() {
        return mapper.readValue(environment.getDiscoveryUri().toURL(), DiscoveryDocumentDto.class);
    }

}
