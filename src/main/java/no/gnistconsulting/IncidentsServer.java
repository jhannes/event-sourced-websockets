package no.gnistconsulting;

import jakarta.websocket.server.ServerEndpointConfig;
import lombok.SneakyThrows;
import no.gnistconsulting.app.ApiConfig;
import no.gnistconsulting.app.ApplicationEnvironment;
import no.gnistconsulting.auth.OpenIdClientConfiguration;
import no.gnistconsulting.auth.OpenidAuthorizationHandler;
import no.gnistconsulting.incidents.IncidentReactor;
import no.gnistconsulting.incidents.IncidentsWsEndpoint;
import no.gnistconsulting.infra.ContentResourceHandler;
import org.eclipse.jetty.ee10.servlet.ServletContextHandler;
import org.eclipse.jetty.ee10.servlet.ServletHolder;
import org.eclipse.jetty.ee10.websocket.jakarta.server.config.JakartaWebSocketServletContainerInitializer;
import org.eclipse.jetty.server.CustomRequestLog;
import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.server.handler.ContextHandler;
import org.eclipse.jetty.server.handler.ContextHandlerCollection;
import org.eclipse.jetty.server.handler.ResourceHandler;
import org.eclipse.jetty.util.resource.ResourceFactory;
import org.glassfish.jersey.servlet.ServletContainer;

import java.net.URI;

public class IncidentsServer extends Server {

    private final ResourceFactory resourceFactory = ResourceFactory.of(this);
    private final IncidentReactor incidentReactor = new IncidentReactor();

    @SneakyThrows
    public IncidentsServer(int port, OpenIdClientConfiguration environment) {
        super(port);
        setHandler(new OpenidAuthorizationHandler(environment,
                new ContextHandlerCollection(
                        getServletContextHandler(environment),
                        getWebSocketContextHandler(),
                        new ContextHandler(swaggerUi(), "/api-doc/swagger-ui"),
                        new ContextHandler(apiDoc(), "/api-doc"),
                        new ContextHandler(reactApplication(), "/")
                )));
        setRequestLog(new CustomRequestLog());
    }

    private ContextHandler getWebSocketContextHandler() {
        var handler = new ServletContextHandler("/ws");
        handler.addServletContainerInitializer(new JakartaWebSocketServletContainerInitializer((_, container) -> {
            container.addEndpoint(incidentsWsEndpointConfig());
        }));
        return handler;
    }

    private ServerEndpointConfig incidentsWsEndpointConfig() {
        return ServerEndpointConfig.Builder
                .create(IncidentsWsEndpoint.class, "/incidents")
                .configurator(new ServerEndpointConfig.Configurator() {
                    @SuppressWarnings("unchecked")
                    @Override
                    public <T> T getEndpointInstance(Class<T> endpointClass) {
                        return (T) new IncidentsWsEndpoint(incidentReactor);
                    }
                }).build();
    }

    private ContentResourceHandler reactApplication() {
        return new ContentResourceHandler(resourceFactory.newClassLoaderResource("webapp", false));
    }

    private ResourceHandler apiDoc() {
        return new ContentResourceHandler(ContentResourceHandler.getProjectResource("webapp/api-doc", resourceFactory));
    }

    private ResourceHandler swaggerUi() {
        return ContentResourceHandler.getWebJarResource("swagger-ui", resourceFactory);
    }

    private static ServletContextHandler getServletContextHandler(OpenIdClientConfiguration environment) {
        var handler = new ServletContextHandler();
        handler.getServletHandler().setEnsureDefaultServlet(false);
        handler.addServlet(new ServletHolder(new ServletContainer(new ApiConfig(environment))), "/api/*");
        return handler;
    }

    @SneakyThrows
    public static void main(String[] args) {
        new IncidentsServer(9080, new ApplicationEnvironment()).start();
    }

    @SneakyThrows
    public URI getWsUri() {
        return new URI("ws", getURI().getAuthority(), "/ws/incidents", null, null);
    }
}
