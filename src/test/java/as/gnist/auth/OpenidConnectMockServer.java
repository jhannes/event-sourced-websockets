package as.gnist.auth;

import com.fasterxml.jackson.databind.ObjectMapper;
import as.gnist.openid.api.DiscoveryApi;
import as.gnist.openid.api.IdentityClientApi;
import as.gnist.openid.model.DiscoveryDocumentDto;
import as.gnist.openid.model.GrantTypeDto;
import as.gnist.openid.model.JwksDocumentDto;
import as.gnist.openid.model.JwtPayloadDto;
import as.gnist.openid.model.OauthErrorDto;
import as.gnist.openid.model.ResponseTypeDto;
import as.gnist.openid.model.TokenResponseDto;
import as.gnist.openid.model.UserinfoDto;
import jakarta.ws.rs.BadRequestException;
import jakarta.ws.rs.ClientErrorException;
import jakarta.ws.rs.FormParam;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.HeaderParam;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.UriInfo;
import lombok.Data;
import lombok.SneakyThrows;
import lombok.experimental.Accessors;
import org.eclipse.jetty.ee10.servlet.ServletContextHandler;
import org.eclipse.jetty.ee10.servlet.ServletHolder;
import org.eclipse.jetty.server.CustomRequestLog;
import org.eclipse.jetty.server.Server;
import org.glassfish.jersey.server.ResourceConfig;
import org.glassfish.jersey.servlet.ServletContainer;

import java.net.URI;
import java.util.Base64;
import java.util.Map;
import java.util.Set;

public class OpenidConnectMockServer extends Server {

    private static final ObjectMapper mapper = new ObjectMapper();

    public OpenidConnectMockServer(int port) {
        super(port);
        var handler = new ServletContextHandler();
        handler.addServlet(new ServletHolder(new ServletContainer(getResourceConfig())), "/*");
        setHandler(handler);
        setRequestLog(new CustomRequestLog());
    }

    private static ResourceConfig getResourceConfig() {
        return new ResourceConfig(DiscoveryController.class, IdentityProviderController.class)
                .setProperties(Map.of(
                        "jersey.config.server.wadl.disableWadl", true,
                        "jersey.config.disableDefaultProvider", "DATASOURCE"
                ));
    }

    @SneakyThrows
    public static void main(String[] args) {
        new OpenidConnectMockServer(20080).start();
    }

    public OpenIdClientConfiguration getClientConfiguration() {
        return new OpenIdClientConfiguration() {
            @Override
            public URI getDiscoveryUri() {
                return getURI().resolve("/.well-known/openid-configuration");
            }

            @Override
            public String getClientId() {
                return "";
            }

            @Override
            public String getClientSecret() {
                return "";
            }
        };
    }

    @Data
    @Accessors(chain = true)
    public static class CodeJson {
        String username, clientId;
    }

    @Path("/.well-known")
    public static class DiscoveryController implements DiscoveryApi {

        @Context
        private UriInfo uriInfo;

        @GET
        @Path("/openid-configuration")
        @Override
        public DiscoveryDocumentDto getDiscoveryDocument() {
            var baseUri = uriInfo.getBaseUri();
            return new DiscoveryDocumentDto()
                    .setResponse_types_supported(Set.of(ResponseTypeDto.code))
                    .setAuthorization_endpoint(baseUri.resolve("/authorize"))
                    .setToken_endpoint(baseUri.resolve("/token"))
                    .setUserinfo_endpoint(baseUri.resolve("/userinfo"));
        }

        @GET
        @Path("/jwks")
        @Override
        public JwksDocumentDto getJwksDocument() {
            return null;
        }
    }

    @Path("/")
    public static class IdentityProviderController {
        @GET
        @Path("/authorize")
        @Produces(MediaType.TEXT_HTML)
        public String authorization(
                @QueryParam("redirect_uri") String redirectUri,
                @QueryParam("client_id") String clientId,
                @QueryParam("response_type") ResponseTypeDto responseType
        ) {
            if (responseType != ResponseTypeDto.code) {
                throw new BadRequestException("Invalid responseType=" + responseType);
            }
            return """
                    <html>
                        <body>
                          <h1>Login</h1>
                          <form action='/complete'>
                            <input type="hidden" name='redirect_uri' value='%s' />
                            <input type="hidden" name='client_id' value='%s' />
                            <button name='username' value='johannes'>Login as Johannes</submit>
                            <button name='username' value='randomuser'>Login as Someone Else</submit>
                          </form>
                        </body>
                    </html>
                    """.formatted(redirectUri, clientId);
        }

        @GET
        @Path("/complete")
        public Response complete(
                @QueryParam("redirect_uri") URI redirectUri,
                @QueryParam("client_id") String clientId,
                @QueryParam("username") String username
        ) {
            var value = new CodeJson().setUsername(username).setClientId(clientId);
            var query = new IdentityClientApi.HandleCallbackQuery()
                    .setCode(base64Json(value))
                    .toUrlEncoded();
            return Response
                    .temporaryRedirect(URI.create(redirectUri + "?" + query))
                    .build();
        }

        @POST
        @Path("/token")
        public TokenResponseDto token(
                @FormParam("grant_type") GrantTypeDto grantType,
                @FormParam("code") String code,
                @FormParam("client_id") String clientId,
                @FormParam("client_secret") String clientSecret
        ) {
            if (grantType != GrantTypeDto.authorization_code) {
                var error = new OauthErrorDto().setError(OauthErrorDto.ErrorEnum.invalid_grant).setError_description("Invalid grant " + grantType);
                throw new BadRequestException(Response.status(400).entity(error).build());
            }
            var codeJson = base64Json(code, CodeJson.class);
            if (!codeJson.getClientId().equals(clientId)) {
                throw new BadRequestException("Wrong clientId");
            }

            return new TokenResponseDto()
                    .setAccess_token(base64Json(new JwtPayloadDto()
                            .setName(codeJson.getUsername())
                            .setAud(clientId)
                            .setExp(System.currentTimeMillis() + 60*60*1000)
                    ));
        }

        @GET
        @Path("/userinfo")
        public UserinfoDto getUserInfo(@HeaderParam("Authorization") String authorization) {
            if (authorization == null || !authorization.toLowerCase().startsWith("bearer ")) {
                throw new ClientErrorException(Response.Status.UNAUTHORIZED);
            }
            var accessToken = base64Json(authorization.substring("bearer ".length()), JwtPayloadDto.class);
            if (accessToken.getExp() == null || accessToken.getExp() < System.currentTimeMillis()) {
                throw new ClientErrorException(Response.Status.UNAUTHORIZED);
            }
            return new UserinfoDto()
                    .setName(accessToken.getName());
        }

    }

    @SneakyThrows
    public static String base64Json(Object value) {
        return Base64.getUrlEncoder().encodeToString(mapper.writeValueAsBytes(value));
    }

    @SneakyThrows
    private static <T> T base64Json(String base64, Class<T> type) {
        return mapper.readValue(Base64.getUrlDecoder().decode(base64), type);
    }
}
