package com.soprasteria.eventsource.api;

import com.soprasteria.eventsource.core.ConversationService;
import com.soprasteria.eventsource.generated.api.CommandToServerDto;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.core.SecurityContext;

import java.security.Principal;

@Path("/commands")
public class CommandsController {

    private final ConversationService conversationService;
    private final Principal userPrincipal;

    @Inject
    public CommandsController(ConversationService conversationService, SecurityContext securityContext) {
        this.conversationService = conversationService;
        userPrincipal = securityContext.getUserPrincipal();
    }

    @POST
    @Consumes("application/json")
    public void postCommand(CommandToServerDto command) {
        conversationService.submitCommand(command, "dummy user");
    }
}
