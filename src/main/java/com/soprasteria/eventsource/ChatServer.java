package com.soprasteria.eventsource;

import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.servlet.ServletContextHandler;
import org.eclipse.jetty.servlet.ServletHolder;

public class ChatServer {

    private final Server server = new Server(8080);

    public ChatServer() {
        var handler = new ServletContextHandler();
        handler.addServlet(new ServletHolder(DevelopmentDefaultServlet.create("/webapp")), "/*");
        server.setHandler(handler);
    }

    public static void main(String[] args) throws Exception {
        new ChatServer().start();
    }

    private void start() throws Exception {
        server.start();
    }

}
