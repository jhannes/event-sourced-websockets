package com.johannesbrodwall;

import jakarta.websocket.server.ServerEndpointConfig;
import lombok.SneakyThrows;
import org.eclipse.jetty.ee10.servlet.ServletContextHandler;
import org.eclipse.jetty.ee10.servlet.ServletHolder;
import org.eclipse.jetty.ee10.websocket.jakarta.server.config.JakartaWebSocketServletContainerInitializer;
import org.eclipse.jetty.server.CustomRequestLog;
import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.server.handler.ContextHandler;
import org.eclipse.jetty.server.handler.ContextHandlerCollection;
import org.eclipse.jetty.server.handler.ResourceHandler;
import org.eclipse.jetty.util.resource.ResourceFactory;

import java.net.URI;

public class EventSourcingServer extends Server {

    private final ResourceFactory resourceFactory = ResourceFactory.of(this);

    @SneakyThrows
    EventSourcingServer(int port) {
        super(port);
        setHandler(new ContextHandlerCollection(
                getServletContextHandler(),
                getWebSocketContextHandler(),
                new ContextHandler(swaggerUi(), "/api-doc/swagger-ui"),
                new ContextHandler(apiDoc(), "/api-doc"),
                new ContextHandler(reactApplication(), "/")
        ));
        setRequestLog(new CustomRequestLog());
    }

    private ContextHandler getWebSocketContextHandler() {
        var handler = new ServletContextHandler("/ws");
        handler.addServletContainerInitializer(new JakartaWebSocketServletContainerInitializer((_, container) -> {
            container.addEndpoint(ServerEndpointConfig.Builder.create(IncidentsWsEndpoint.class, "/incidents").build());
        }));
        return handler;
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

    private static ServletContextHandler getServletContextHandler() {
        var handler = new ServletContextHandler();
        handler.getServletHandler().setEnsureDefaultServlet(false);
        handler.addServlet(new ServletHolder(new HelloWorldServlet()), "/api/hello");
        return handler;
    }

    @SneakyThrows
    public static void main(String[] args) {
        new EventSourcingServer(9080).start();
    }

    @SneakyThrows
    public URI getWsUri() {
        return new URI("ws", getURI().getAuthority(), "/ws/incidents", null, null);
    }
}
