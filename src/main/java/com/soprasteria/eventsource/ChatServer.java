package com.soprasteria.eventsource;

import com.soprasteria.eventsource.api.ConversationApiConfig;
import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.servlet.ServletContextHandler;
import org.eclipse.jetty.servlet.ServletHolder;
import org.glassfish.jersey.servlet.ServletContainer;

public class ChatServer {

    private final Server server = new Server(8080);

    public ChatServer() {
        var handler = new ServletContextHandler();
        handler.addServlet(new ServletHolder(new ServletContainer(new ConversationApiConfig())), "/api/*");
        handler.addServlet(new ServletHolder(ContentServlet.webjar("swagger-ui")), "/api-doc/swagger-ui/*");
        handler.addServlet(new ServletHolder(ContentServlet.create("/webapp")), "/*");
        server.setHandler(handler);
    }

    public static void main(String[] args) throws Exception {
        new ChatServer().start();
    }

    private void start() throws Exception {
        server.start();
    }

}
