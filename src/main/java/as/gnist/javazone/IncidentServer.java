package as.gnist.javazone;

import jakarta.websocket.server.ServerEndpointConfig;
import org.eclipse.jetty.ee10.servlet.ServletContextHandler;
import org.eclipse.jetty.ee10.websocket.jakarta.server.config.JakartaWebSocketServletContainerInitializer;
import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.server.handler.ContextHandler;
import org.eclipse.jetty.server.handler.ContextHandlerCollection;
import org.eclipse.jetty.server.handler.ResourceHandler;
import org.eclipse.jetty.util.resource.ResourceFactory;

public class IncidentServer {

    private static final IncidentReactor incidentReactor = new IncidentReactor();
    private final Server server = new Server(8080);
    private final ResourceFactory resourceFactory = ResourceFactory.of(server);

    public static void main(String[] args) throws Exception {
        new IncidentServer().start();
    }

    private void start() throws Exception {
        server.setHandler(new ContextHandlerCollection(
                new ContextHandler(swaggerUi(), "/api-doc/swagger-ui"),
                new ContextHandler(apiDoc(), "/api-doc"),
                createWsHandler())
        );
        server.start();
    }

    private static ServletContextHandler createWsHandler() {
        var handler = new ServletContextHandler("/ws");
        handler.addServletContainerInitializer(new JakartaWebSocketServletContainerInitializer((_, serverContainer) -> serverContainer.addEndpoint(ServerEndpointConfig.Builder
                .create(IncidentsWsEndpoint.class, "/incidents")
                        .configurator(new ServerEndpointConfig.Configurator() {
                            @Override
                            public <T> T getEndpointInstance(Class<T> endpointClass) {
                                //noinspection unchecked
                                return (T)new IncidentsWsEndpoint(incidentReactor);
                            }
                        })
                .build()
        )));
        return handler;
    }

    private ResourceHandler apiDoc() {
        return new ContentResourceHandler(ContentResourceHandler.getProjectResource("webapp/api-doc", resourceFactory));
    }

    private ResourceHandler swaggerUi() {
        return ContentResourceHandler.getWebJarResource("swagger-ui", resourceFactory);
    }
}
