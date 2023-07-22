package com.soprasteria.eventsource;

import com.soprasteria.eventsource.api.ConversationApiConfig;
import com.soprasteria.eventsource.core.ConversationService;
import org.eclipse.jetty.server.CustomRequestLog;
import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.servlet.ServletContextHandler;
import org.eclipse.jetty.servlet.ServletHolder;
import org.eclipse.jetty.websocket.server.config.JettyWebSocketServletContainerInitializer;
import org.glassfish.jersey.servlet.ServletContainer;

public class ChatServer {

    private final ConversationService conversationService = new ConversationService();
    private final Server server = new Server(8080);

    public ChatServer() {
        server.setHandler(createContextHandler());
        server.setRequestLog(new CustomRequestLog());
    }

    private ServletContextHandler createContextHandler() {
        var handler = new ServletContextHandler();
        handler.addServlet(new ServletHolder(new ServletContainer(new ConversationApiConfig(conversationService))), "/api/*");
        handler.addServlet(new ServletHolder(ContentServlet.webjar("swagger-ui")), "/api-doc/swagger-ui/*");
        handler.addServlet(new ServletHolder(ContentServlet.createWithDefault("/webapp", "/index.html")), "/*");

        handler.addServletContainerInitializer(new JettyWebSocketServletContainerInitializer((servletContext, container) ->
                container.addMapping("/ws", (req, resp) -> new ChatWebSocketEndPoint(conversationService))
        ));

        return handler;
    }

    public static void main(String[] args) throws Exception {
        new ChatServer().start();
    }

    private void start() throws Exception {
        server.start();
    }

}
