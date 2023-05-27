package com.soprasteria.eventsource.api;

import com.soprasteria.eventsource.core.ConversationService;
import com.soprasteria.eventsource.generated.api.CommandToServerDto;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;

@Path("/commands")
public class CommandsController {

    private final ConversationService conversationService;

    @Inject
    public CommandsController(ConversationService conversationService) {
        this.conversationService = conversationService;
    }

    @POST
    @Consumes("application/json")
    public void postCommand(CommandToServerDto command) {
        conversationService.submitCommand(command);
    }
}
