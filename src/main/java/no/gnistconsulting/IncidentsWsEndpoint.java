package no.gnistconsulting;

import com.fasterxml.jackson.core.JsonProcessingException;
import jakarta.websocket.Endpoint;
import jakarta.websocket.EndpointConfig;
import jakarta.websocket.RemoteEndpoint;
import jakarta.websocket.Session;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.openapitools.client.model.IncidentDto;
import org.openapitools.client.model.IncidentSnapshotListDto;
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

    @SneakyThrows
    @Override
    public void onOpen(Session session, EndpointConfig config) {
        remote = session.getAsyncRemote();
        session.addMessageHandler(String.class, this::handleData);
        incidentReactor.subscribe(this);
    }

    @Override
    public void onError(Session session, Throwable exception) {
        log.error("Error in websocket", exception);
    }

    @SneakyThrows
    @Override
    public void sendMessage(MessageFromServerDto message) {
        remote.sendText(mapper.writeValueAsString(message));
    }

    @SneakyThrows
    public void handleData(String data) {
        var message = mapper.readValue(data, MessageToServerDto.class);
        incidentReactor.handleMessage(message);
    }
}
