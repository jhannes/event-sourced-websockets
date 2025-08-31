package as.gnist.javazone;

import as.gnist.javazone.incident.generated.model.IncidentDto;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.websocket.Endpoint;
import jakarta.websocket.EndpointConfig;
import jakarta.websocket.Session;
import lombok.SneakyThrows;

import java.util.List;

public class IncidentsWsEndpoint extends Endpoint {
    @SneakyThrows
    @Override
    public void onOpen(Session session, EndpointConfig config) {
        var message = new ObjectMapper().writeValueAsString(List.of(new IncidentDto().setSummary("Fire from websocket")));
        session.getAsyncRemote().sendText(message);
    }
}
