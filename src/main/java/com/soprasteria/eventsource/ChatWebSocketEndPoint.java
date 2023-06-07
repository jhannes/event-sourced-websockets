package com.soprasteria.eventsource;

import com.soprasteria.eventsource.api.ConversationApiJsonbContextResolver;
import com.soprasteria.eventsource.core.ConversationService;
import com.soprasteria.eventsource.generated.api.SnapshotSetDto;
import jakarta.json.bind.Jsonb;
import org.eclipse.jetty.websocket.api.Session;
import org.eclipse.jetty.websocket.api.WebSocketListener;
import org.eclipse.jetty.websocket.server.JettyServerUpgradeRequest;

import java.io.IOException;

public class ChatWebSocketEndPoint implements WebSocketListener {

    private final static Jsonb jsonb = ConversationApiJsonbContextResolver.createJsonb();

    private final ConversationService conversationService;

    public ChatWebSocketEndPoint(JettyServerUpgradeRequest req, ConversationService conversationService) {

        this.conversationService = conversationService;
    }

    @Override
    public void onWebSocketConnect(Session session) {
        var snapshotSetDto = new SnapshotSetDto()
                .conversations(conversationService.listConversations());
        try {
            session.getRemote().sendString(jsonb.toJson(snapshotSetDto));
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
