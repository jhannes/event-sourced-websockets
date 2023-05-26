package com.soprasteria.eventsource.api;

import com.soprasteria.eventsource.generated.api.ConversationDto;
import com.soprasteria.eventsource.generated.api.SampleModelData;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;

import java.util.List;

@Path("/conversations")
public class ConversationController {

    @GET
    @Produces("application/json")
    public List<ConversationDto> listConversations() {
        return new SampleModelData(100).sampleListOfConversationDto();
    }

}
