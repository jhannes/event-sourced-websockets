package com.soprasteria.eventsource;

import org.eclipse.jetty.server.Server;

public class ChatServer {

    private final Server server = new Server(8080);

    public static void main(String[] args) throws Exception {
        new ChatServer().start();
    }

    private void start() throws Exception {
        server.start();
    }

}
