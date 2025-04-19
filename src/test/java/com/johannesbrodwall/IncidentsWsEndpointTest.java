package com.johannesbrodwall;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.websocket.ClientEndpointConfig;
import jakarta.websocket.ContainerProvider;
import jakarta.websocket.Endpoint;
import jakarta.websocket.EndpointConfig;
import jakarta.websocket.Session;
import org.eclipse.jetty.util.BlockingArrayQueue;
import org.junit.jupiter.api.Test;
import org.openapitools.client.model.IncidentSummaryListDto;

import java.net.URI;
import java.util.concurrent.TimeUnit;

import static org.assertj.core.api.Assertions.assertThat;

public class IncidentsWsEndpointTest {
    private static final ObjectMapper mapper = new ObjectMapper();

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
            var summaries = mapper.readValue(message, IncidentSummaryListDto.class);
            assertThat(summaries.getSummaries()).isNotEmpty();
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
