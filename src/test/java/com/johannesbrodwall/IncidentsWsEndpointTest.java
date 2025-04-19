package com.johannesbrodwall;

import jakarta.websocket.ClientEndpointConfig;
import jakarta.websocket.ContainerProvider;
import jakarta.websocket.Endpoint;
import jakarta.websocket.EndpointConfig;
import jakarta.websocket.Session;
import org.eclipse.jetty.util.BlockingArrayQueue;
import org.junit.jupiter.api.Test;

import java.net.URI;
import java.util.concurrent.TimeUnit;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

public class IncidentsWsEndpointTest {

    private final EventSourcingServer server = new EventSourcingServer(0);

    public IncidentsWsEndpointTest() throws Exception {
        server.start();
    }

    @Test
    void testHello() throws Exception {
        var uri = new URI("ws", server.getURI().getAuthority(), "/ws/incidents", null, null);

        var wsClient = new WsClient();
        try (var connection = ContainerProvider.getWebSocketContainer().connectToServer(wsClient, ClientEndpointConfig.Builder.create().build(), uri)) {
            var message = wsClient.poll(5, TimeUnit.SECONDS);
            assertThat(message).isEqualTo("Hello from server");
        }
    }

    private static class WsClient extends Endpoint {
        private final BlockingArrayQueue<String> buffer = new BlockingArrayQueue<>(1000);

        @Override
        public void onOpen(Session session, EndpointConfig config) {
            session.addMessageHandler(String.class, message -> buffer.add(message));
        }

        public String poll(long time, TimeUnit timeUnit) throws InterruptedException {
            return buffer.poll(time, timeUnit);
        }
    }
}
