package no.gnistconsulting;

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
    public void onOpen(Session session, EndpointConfig config) {
        session.setMaxIdleTimeout(1000 * 60 * 30);
        remote = session.getAsyncRemote();
        incidentReactor.subscribe(this);
        session.addMessageHandler(String.class, this::handleStringMessage);
    }

    @Override
    public void onError(Session session, Throwable exception) {
        log.error("Web Socket Error", exception);
    }

    @SneakyThrows
    private void handleStringMessage(String data) {
        var message = mapper.readValue(data, MessageToServerDto.class);
        incidentReactor.handleMessage(message);
    }

    @SneakyThrows
    @Override
    public void sendMessage(MessageFromServerDto message) {
        remote.sendText(mapper.writeValueAsString(message));
    }
}
