package com.soprasteria.eventsource.api;

import com.soprasteria.eventsource.generated.api.ConversationSnapshotDto;
import com.soprasteria.eventsource.generated.api.SampleModelData;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;

import java.util.List;

@Path("/conversations")
public class ConversationController {

    private final List<ConversationSnapshotDto> conversationDtos;

    public ConversationController() {
        conversationDtos = new SampleModelData(100).sampleListOfConversationSnapshotDto();
    }

    @GET
    @Produces("application/json")
    public List<ConversationSnapshotDto> listConversations() {
        return conversationDtos;
    }

}
