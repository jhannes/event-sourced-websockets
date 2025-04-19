package com.johannesbrodwall;

import jakarta.websocket.Endpoint;
import jakarta.websocket.EndpointConfig;
import jakarta.websocket.Session;

public class IncidentsWsEndpoint extends Endpoint {
    @Override
    public void onOpen(Session session, EndpointConfig config) {
        session.getAsyncRemote().sendText("Hello from server");
    }
}
