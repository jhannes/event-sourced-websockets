package no.gnistconsulting.javazone;

import jakarta.websocket.Endpoint;
import jakarta.websocket.EndpointConfig;
import jakarta.websocket.RemoteEndpoint;
import jakarta.websocket.Session;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.openapitools.client.model.MessageFromServerDto;
import org.openapitools.client.model.MessageToServerDto;

@Slf4j
public class IncidentWsEndpoint extends Endpoint implements IncidentListener {
    private final IncidentObjectMapper mapper = new IncidentObjectMapper();
    private final IncidentReactor incidentReactor;
    private RemoteEndpoint.Async remote;

    public IncidentWsEndpoint(IncidentReactor incidentReactor) {
        this.incidentReactor = incidentReactor;
    }

    @SneakyThrows
    @Override
    public void onOpen(Session session, EndpointConfig endpointConfig) {
        session.setMaxIdleTimeout(3600*1000);
        this.remote = session.getAsyncRemote();
        incidentReactor.subscribe(this);
        session.addMessageHandler(String.class, this::handleMessage);
    }

    @SneakyThrows
    private void handleMessage(String text) {
        var message = mapper.readValue(text, MessageToServerDto.class);
        incidentReactor.handleMessage(message);
    }

    @SneakyThrows
    @Override
    public void sendMessage(MessageFromServerDto messageFromServer) {
        remote.sendText(mapper.writeValueAsString(messageFromServer));
    }

    @Override
    public void onError(Session session, Throwable error) {
        log.error("Web Socket Error", error);
    }
}
