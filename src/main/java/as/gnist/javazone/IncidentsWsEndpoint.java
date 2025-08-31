package as.gnist.javazone;

import as.gnist.javazone.incident.generated.model.IncidentDto;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.websocket.Endpoint;
import jakarta.websocket.EndpointConfig;
import jakarta.websocket.RemoteEndpoint;
import jakarta.websocket.Session;
import lombok.SneakyThrows;

import java.util.List;

public class IncidentsWsEndpoint extends Endpoint implements IncidentListener {

    private final IncidentReactor incidentReactor;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private RemoteEndpoint.Async remote;

    public IncidentsWsEndpoint(IncidentReactor incidentReactor) {
        this.incidentReactor = incidentReactor;
    }

    @SneakyThrows
    @Override
    public void onOpen(Session session, EndpointConfig config) {
        session.addMessageHandler(String.class, this::handleMessage);
        remote = session.getAsyncRemote();
        incidentReactor.subscribe(this);
        remote.sendText(objectMapper.writeValueAsString(incidentReactor.getIncidents()));
    }

    @SneakyThrows
    private void handleMessage(String message) {
        var incident = objectMapper.readValue(message, IncidentDto.class);
        incidentReactor.handle(incident);
    }

    @SneakyThrows
    @Override
    public void sendMessage(List<IncidentDto> incidents) {
        remote.sendText(objectMapper.writeValueAsString(incidents));
    }
}
