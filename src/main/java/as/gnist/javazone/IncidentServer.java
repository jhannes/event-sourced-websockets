package as.gnist.javazone;

import jakarta.servlet.ServletContext;
import jakarta.websocket.DeploymentException;
import jakarta.websocket.server.ServerContainer;
import jakarta.websocket.server.ServerEndpointConfig;
import org.eclipse.jetty.ee10.servlet.ServletContextHandler;
import org.eclipse.jetty.ee10.servlet.ServletHolder;
import org.eclipse.jetty.ee10.websocket.jakarta.server.config.JakartaWebSocketServletContainerInitializer;
import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.server.handler.ContextHandlerCollection;

public class IncidentServer {

    private final Server server = new Server(8080);

    public static void main(String[] args) throws Exception {
        new IncidentServer().start();
    }

    private void start() throws Exception {
        server.setHandler(new ContextHandlerCollection(createServletContextHandler(), createWsHandler()));
        server.start();
    }

    private static ServletContextHandler createWsHandler() {
        var handler = new ServletContextHandler("/ws");
        handler.addServletContainerInitializer(new JakartaWebSocketServletContainerInitializer((servletContext, serverContainer) -> serverContainer.addEndpoint(ServerEndpointConfig.Builder
                .create(IncidentsWsEndpoint.class, "/incidents")
                .build()
        )));
        return handler;
    }

    private static ServletContextHandler createServletContextHandler() {
        var handler = new ServletContextHandler("/api");
        handler.addServlet(new ServletHolder(new IncidentApiServlet()), "/incidents/*");
        return handler;
    }
}
