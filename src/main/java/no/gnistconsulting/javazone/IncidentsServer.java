package no.gnistconsulting.javazone;

import jakarta.servlet.ServletContext;
import jakarta.websocket.DeploymentException;
import jakarta.websocket.server.ServerContainer;
import jakarta.websocket.server.ServerEndpointConfig;
import no.gnistconsulting.javazone.infrastructure.ContentResourceHandler;
import org.eclipse.jetty.ee10.servlet.ServletContextHandler;
import org.eclipse.jetty.ee10.websocket.jakarta.server.config.JakartaWebSocketServletContainerInitializer;
import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.server.handler.ContextHandler;
import org.eclipse.jetty.server.handler.ContextHandlerCollection;
import org.eclipse.jetty.server.handler.ResourceHandler;
import org.eclipse.jetty.util.resource.ResourceFactory;

public class IncidentsServer {

    private final IncidentReactor incidentReactor = new IncidentReactor();
    private final Server server = new Server(8080);
    private final ResourceFactory resourceFactory = ResourceFactory.of(server);

    public static void main(String[] args) throws Exception {
        new IncidentsServer().start();
    }

    private void start() throws Exception {
        server.setHandler(new ContextHandlerCollection(
                new ContextHandler(swaggerUi(), "/api-doc/swagger-ui"),
                new ContextHandler(apiDoc(), "/api-doc"),
                createWsHandler()
        ));
        server.start();
    }

    private ServletContextHandler createWsHandler() {
        var handler = new ServletContextHandler("/ws");
        handler.addServletContainerInitializer(new JakartaWebSocketServletContainerInitializer((servletContext, container) -> container.addEndpoint(ServerEndpointConfig.Builder.create(IncidentsWsEndpoint.class, "/incidents")
                .configurator(new ServerEndpointConfig.Configurator() {
                    @Override
                    public <T> T getEndpointInstance(Class<T> endpointClass) throws InstantiationException {
                        //noinspection unchecked
                        return (T) new IncidentsWsEndpoint(incidentReactor);
                    }
                })
                .build())));
        return handler;
    }

    private ResourceHandler apiDoc() {
        return new ContentResourceHandler(ContentResourceHandler.getProjectResource("webapp/api-doc", resourceFactory));
    }

    private ResourceHandler swaggerUi() {
        return ContentResourceHandler.getWebJarResource("swagger-ui", resourceFactory);
    }
}
