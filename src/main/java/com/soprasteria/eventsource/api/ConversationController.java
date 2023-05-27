package com.soprasteria.eventsource.api;

import com.soprasteria.eventsource.core.ConversationService;
import com.soprasteria.eventsource.generated.api.ConversationSnapshotDto;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;

import java.util.List;

@Path("/conversations")
public class ConversationController {

    private final ConversationService conversationService;

    @Inject
    public ConversationController(ConversationService conversationService) {
        this.conversationService = conversationService;
    }


    @GET
    @Produces("application/json")
    public List<ConversationSnapshotDto> listConversations() {
        return conversationService.listConversations();
    }

}
