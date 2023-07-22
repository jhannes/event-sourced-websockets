package com.soprasteria.eventsource;

import com.soprasteria.eventsource.api.ConversationApiJsonbContextResolver;
import com.soprasteria.eventsource.core.ConversationService;
import com.soprasteria.eventsource.generated.api.CommandToServerDto;
import com.soprasteria.eventsource.generated.api.EventFromServerDto;
import com.soprasteria.eventsource.generated.api.SnapshotSetDto;
import com.soprasteria.eventsource.infrastructure.SafeCloseable;
import jakarta.json.bind.Jsonb;
import org.eclipse.jetty.websocket.api.Session;
import org.eclipse.jetty.websocket.api.WebSocketListener;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;

import java.io.IOException;
import java.util.Optional;
import java.util.UUID;

public class ChatWebSocketEndPoint implements WebSocketListener, ConversationService.ConversationEventListener {

    private final static Jsonb jsonb = ConversationApiJsonbContextResolver.createJsonb();

    private static final Logger log = LoggerFactory.getLogger(ChatWebSocketEndPoint.class);

    private final UUID requestId = UUID.randomUUID();

    private final ConversationService conversationService;
    private final SafeCloseable subscription;
    private Optional<Session> session = Optional.empty();

    public ChatWebSocketEndPoint(ConversationService conversationService) {
        this.conversationService = conversationService;
        this.subscription = conversationService.listen(this);
    }

    @Override
    public void onEvent(EventFromServerDto event) {
        session.ifPresentOrElse(s -> sendEvent(event, s), () -> log.warn("Session not connected"));
    }

    private void sendEvent(EventFromServerDto event, Session s) {
        try (var ignored = withMdc()) {
            try {
                log.trace("Sending event");
                s.getRemote().sendString(jsonb.toJson(event));
            } catch (IOException e) {
                log.error("While sending event", e);
            }
        }
    }

    @Override
    public void onWebSocketConnect(Session session) {
        var mdc = withMdc();
        //session.setIdleTimeout(Duration.ofSeconds(15));
        this.session = Optional.of(session);
        var snapshotSetDto = new SnapshotSetDto().conversations(conversationService.listConversations());
        try {
            session.getRemote().sendString(jsonb.toJson(snapshotSetDto));
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        mdc.close();
    }

    @Override
    public void onWebSocketText(String message) {
        var mdc = withMdc();
        log.trace("onWebSocketText raw {}", message);
        var command = jsonb.fromJson(message, CommandToServerDto.class);
        MDC.put("delta.type", command.getDelta().getDelta());
        log.debug("onWebSocketText {}", command);
        conversationService.submitCommand(command, "anon");
        mdc.close();
    }

    @Override
    public void onWebSocketClose(int statusCode, String reason) {
        var mdc = withMdc();
        log.debug("Closing");
        subscription.close();
        mdc.close();
    }

    private SafeCloseable withMdc() {
        var remoteUserMdc = MDC.putCloseable("remoteUser", "dummy user");
        var requestIdMdc = MDC.putCloseable("requestId", requestId.toString());
        return () -> {
            requestIdMdc.close();
            remoteUserMdc.close();
        };
    }
}
