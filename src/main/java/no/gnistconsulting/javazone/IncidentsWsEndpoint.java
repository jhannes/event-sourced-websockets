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
public class IncidentsWsEndpoint extends Endpoint implements IncidentListener {

    private final IncidentObjectMapper mapper = new IncidentObjectMapper();
    private final IncidentReactor incidentReactor;
    private RemoteEndpoint.Async remote;

    public IncidentsWsEndpoint(IncidentReactor incidentReactor) {
        this.incidentReactor = incidentReactor;
    }

    @Override
    public void onOpen(Session session, EndpointConfig config) {
        session.setMaxIdleTimeout(1000*60*30);
        this.remote = session.getAsyncRemote();
        this.incidentReactor.subscribe(this);
        session.addMessageHandler(String.class, this::handleMessage);
    }

    @Override
    public void onError(Session session, Throwable exception) {
        log.error("Websocket error", exception);
    }

    @SneakyThrows
    @Override
    public void sendMessage(MessageFromServerDto message) {
        remote.sendText(mapper.writeValueAsString(message));
    }

    @SneakyThrows
    private void handleMessage(String text) {
        var message = mapper.readValue(text, MessageToServerDto.class);
        incidentReactor.handleMessage(message);
    }
}
