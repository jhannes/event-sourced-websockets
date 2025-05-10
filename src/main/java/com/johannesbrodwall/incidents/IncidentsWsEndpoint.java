package com.johannesbrodwall.incidents;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.johannesbrodwall.app.ApplicationObjectMapper;
import com.johannesbrodwall.incidents.model.IncidentSummaryListDto;
import com.johannesbrodwall.incidents.model.UnauthenticatedErrorSignalDto;
import jakarta.websocket.CloseReason;
import jakarta.websocket.Endpoint;
import jakarta.websocket.EndpointConfig;
import jakarta.websocket.RemoteEndpoint;
import jakarta.websocket.Session;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.eclipse.jetty.websocket.core.exception.WebSocketTimeoutException;
import com.johannesbrodwall.incidents.model.IncidentCommandDto;
import com.johannesbrodwall.incidents.model.IncidentSubscribeRequestDto;
import com.johannesbrodwall.incidents.model.IncidentSummarySubscribeRequestDto;
import com.johannesbrodwall.incidents.model.MessageFromServerDto;
import com.johannesbrodwall.incidents.model.MessageToServerDto;

import java.nio.channels.ClosedChannelException;
import java.security.Principal;

@Slf4j
public class IncidentsWsEndpoint extends Endpoint implements IncidentListener {

    private static final ObjectMapper mapper = new ApplicationObjectMapper();
    private final IncidentReactor incidents;
    private RemoteEndpoint.Async remote;
    private Principal userPrincipal;

    public IncidentsWsEndpoint(IncidentReactor incidentReactor) {
        incidents = incidentReactor;
    }

    @Override
    public void onOpen(Session session, EndpointConfig config) {
        this.remote = session.getAsyncRemote();
        userPrincipal = session.getUserPrincipal();
        if (userPrincipal != null) {
            session.addMessageHandler(String.class, this::handleMessage);
            sendMessage(new IncidentSummaryListDto()
                    .setSummaries(incidents.getSummaries(null)));
        } else {
            sendMessage(new UnauthenticatedErrorSignalDto());
        }
    }

    @SneakyThrows
    private void handleMessage(String s) {
        var message = mapper.readValue(s, MessageToServerDto.class);
        switch (message) {
            case IncidentSummarySubscribeRequestDto subscribe -> incidents.subscribe(this, subscribe);
            case IncidentSubscribeRequestDto subscribe -> sendMessage(incidents.snapshot(subscribe.getIncidentId()));
            case IncidentCommandDto command -> incidents.processCommand(command, userPrincipal);
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
        incidents.unsubscribe(this);
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
