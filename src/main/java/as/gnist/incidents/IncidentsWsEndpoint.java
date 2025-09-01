package as.gnist.incidents;

import com.fasterxml.jackson.databind.ObjectMapper;
import as.gnist.app.ApplicationObjectMapper;
import as.gnist.incidents.model.UnauthenticatedErrorSignalDto;
import jakarta.websocket.CloseReason;
import jakarta.websocket.Endpoint;
import jakarta.websocket.EndpointConfig;
import jakarta.websocket.RemoteEndpoint;
import jakarta.websocket.Session;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.eclipse.jetty.websocket.core.exception.WebSocketTimeoutException;
import as.gnist.incidents.model.IncidentCommandDto;
import as.gnist.incidents.model.IncidentSubscribeRequestDto;
import as.gnist.incidents.model.IncidentSummarySubscribeRequestDto;
import as.gnist.incidents.model.MessageFromServerDto;
import as.gnist.incidents.model.MessageToServerDto;

import java.nio.channels.ClosedChannelException;
import java.security.Principal;

@Slf4j
public class IncidentsWsEndpoint extends Endpoint implements IncidentListener {

    private static final ObjectMapper mapper = new ApplicationObjectMapper();
    private final IncidentReactor incidentReactor;
    private RemoteEndpoint.Async remote;
    private Principal userPrincipal;

    public IncidentsWsEndpoint(IncidentReactor incidentReactor) {
        this.incidentReactor = incidentReactor;
    }

    @Override
    public void onOpen(Session session, EndpointConfig config) {
        this.remote = session.getAsyncRemote();
        userPrincipal = session.getUserPrincipal();
        if (userPrincipal != null) {
            session.addMessageHandler(String.class, this::handleMessage);
        } else {
            sendMessage(new UnauthenticatedErrorSignalDto());
        }
    }

    @SneakyThrows
    private void handleMessage(String s) {
        var message = mapper.readValue(s, MessageToServerDto.class);
        switch (message) {
            case IncidentSummarySubscribeRequestDto subscribe -> incidentReactor.subscribe(this, subscribe);
            case IncidentSubscribeRequestDto subscribe -> sendMessage(incidentReactor.snapshot(subscribe.getIncidentId()));
            case IncidentCommandDto command -> incidentReactor.processCommand(command, userPrincipal);
        }
    }

    @Override
    public void onError(Session session, Throwable throwable) {
        if (throwable instanceof WebSocketTimeoutException) return;
        if (throwable instanceof ClosedChannelException) return;
        log.error("Web socket error", throwable);
    }

    @Override
    public void onClose(Session session, CloseReason closeReason) {
        incidentReactor.unsubscribe(this);
    }

    @Override
    @SneakyThrows
    public void sendMessage(MessageFromServerDto message) {
        if (message == null) return;
        if (!message.missingRequiredFields("").isEmpty()) {
            throw new IllegalArgumentException("Missing required fields " + message.missingRequiredFields("") + " in " + message);
        }
        remote.sendText(mapper.writeValueAsString(message));
    }
}
