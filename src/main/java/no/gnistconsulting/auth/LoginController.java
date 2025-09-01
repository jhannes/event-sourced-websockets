package no.gnistconsulting.auth;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.InternalServerErrorException;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.NewCookie;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.UriInfo;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import no.gnistconsulting.openid.api.IdentityProviderApi;
import no.gnistconsulting.openid.model.DiscoveryDocumentDto;
import no.gnistconsulting.openid.model.GrantTypeDto;
import no.gnistconsulting.openid.model.OauthErrorDto;
import no.gnistconsulting.openid.model.ResponseTypeDto;
import no.gnistconsulting.openid.model.TokenResponseDto;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URI;
import java.nio.charset.StandardCharsets;

@Path("/login")
@Slf4j
public class LoginController {
    private static final ObjectMapper mapper = new ObjectMapper();

    private final OpenIdClientConfiguration configuration;

    @Context private UriInfo uriInfo;

    @Inject
    public LoginController(OpenIdClientConfiguration configuration) {
        this.configuration = configuration;
    }

    @Path("/start")
    @GET
    public Response startLogin() {
        var configuration = getDiscoveryDocument();

        var query = new IdentityProviderApi.AuthorizationQuery()
                .setClientId(this.configuration.getClientId())
                .setResponseType(ResponseTypeDto.code)
                .setRedirectUri(uriInfo.getBaseUri().resolve("/api/login/callback"))
                .toUrlEncoded();

        return Response
                .temporaryRedirect(URI.create(configuration.getAuthorization_endpoint() + "?" + query))
                .build();
    }

    @Path("/callback")
    @GET
    public Response completeLogin(@QueryParam("code") String code) throws IOException {
        var configuration = getDiscoveryDocument();

        var tokenPayload = new IdentityProviderApi.FetchTokenForm()
                .setGrantType(GrantTypeDto.authorization_code)
                .setClientId(this.configuration.getClientId())
                .setClientSecret(this.configuration.getClientSecret())
                .setCode(code);
        var urlConnection = (HttpURLConnection)configuration.getToken_endpoint().toURL().openConnection();
        urlConnection.setRequestMethod("POST");
        urlConnection.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
        urlConnection.setDoOutput(true);
        urlConnection.getOutputStream().write(tokenPayload.toUrlEncoded().getBytes(StandardCharsets.UTF_8));
        if (urlConnection.getResponseCode() != 200) {
            var error = mapper.readValue(urlConnection.getErrorStream(), OauthErrorDto.class);
            log.error("Failed to get token: {}", error);
            throw new InternalServerErrorException("Failed to read token");
        }
        var tokenResponse = mapper.readValue(urlConnection.getInputStream(), TokenResponseDto.class);

        return Response
                .temporaryRedirect(uriInfo.getBaseUri().resolve("/"))
                .cookie(new NewCookie.Builder("accessToken").path("/").value(tokenResponse.getAccess_token()).build())
                .build();

    }

    @SneakyThrows
    private DiscoveryDocumentDto getDiscoveryDocument() {
        return mapper.readValue(this.configuration.getDiscoveryUri().toURL(), DiscoveryDocumentDto.class);
    }
}
