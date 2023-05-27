package com.soprasteria.eventsource;

import com.soprasteria.eventsource.api.ConversationApiConfig;
import org.eclipse.jetty.server.CustomRequestLog;
import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.servlet.ServletContextHandler;
import org.eclipse.jetty.servlet.ServletHolder;
import org.glassfish.jersey.servlet.ServletContainer;

public class ChatServer {

    private final Server server = new Server(8080);

    public ChatServer() {
        server.setHandler(createContextHandler());
        server.setRequestLog(new CustomRequestLog());
    }

    private static ServletContextHandler createContextHandler() {
        var handler = new ServletContextHandler();
        handler.addServlet(new ServletHolder(new ServletContainer(new ConversationApiConfig())), "/api/*");
        handler.addServlet(new ServletHolder(ContentServlet.webjar("swagger-ui")), "/api-doc/swagger-ui/*");
        handler.addServlet(new ServletHolder(ContentServlet.createWithDefault("/webapp", "/index.html")), "/*");
        return handler;
    }

    public static void main(String[] args) throws Exception {
        new ChatServer().start();
    }

    private void start() throws Exception {
        server.start();
    }

}
