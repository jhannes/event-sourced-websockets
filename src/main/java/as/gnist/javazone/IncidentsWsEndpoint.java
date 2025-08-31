package as.gnist.javazone;

import as.gnist.javazone.incident.generated.model.MessageFromServerDto;
import as.gnist.javazone.incident.generated.model.MessageToServerDto;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.websocket.Endpoint;
import jakarta.websocket.EndpointConfig;
import jakarta.websocket.RemoteEndpoint;
import jakarta.websocket.Session;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.eclipse.jetty.websocket.core.exception.WebSocketTimeoutException;

import java.nio.channels.ClosedChannelException;

@Slf4j
public class IncidentsWsEndpoint extends Endpoint implements IncidentListener {

    private final IncidentReactor incidentReactor;
    private final ObjectMapper objectMapper = new IncidentObjectMapper()

            ;
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
    }

    @Override
    public void onError(Session session, Throwable e) {
        if (e instanceof WebSocketTimeoutException || e instanceof ClosedChannelException) {
            return;
        }
        log.error("WebSocket error", e);
    }

    @SneakyThrows
    private void handleMessage(String message) {
        incidentReactor.handle(objectMapper.readValue(message, MessageToServerDto.class));
    }

    @SneakyThrows
    @Override
    public void sendMessage(MessageFromServerDto message) {
        remote.sendText(objectMapper.writeValueAsString(message));
    }
}
