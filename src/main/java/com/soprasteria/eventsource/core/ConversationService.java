package com.soprasteria.eventsource.core;

import com.soprasteria.eventsource.generated.api.AddMessageToConversationDeltaDto;
import com.soprasteria.eventsource.generated.api.CommandToServerDto;
import com.soprasteria.eventsource.generated.api.ConversationSnapshotDto;
import com.soprasteria.eventsource.generated.api.CreateConversationDeltaDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.List;


public class ConversationService {
    private static final Logger log = LoggerFactory.getLogger(ConversationService.class);

    private final List<ConversationSnapshotDto> conversations = new SampleConversationData().sampleListOfConversationSnapshotDto();

    public void submitCommand(CommandToServerDto command) {
        if (command.getDelta() instanceof CreateConversationDeltaDto createDelta) {
            conversations.add(new ConversationSnapshotDto()
                    .id(createDelta.getConversationId())
                    .info(createDelta.getInfo())
                    .messages(new HashMap<>())
            );
        } else if (command.getDelta() instanceof AddMessageToConversationDeltaDto addMessage) {
            conversations.stream().filter(c -> c.getId().equals(addMessage.getConversationId()))
                    .forEach(c -> c.getMessages().put(addMessage.getMessageId().toString(), addMessage.getMessage()));
        } else {
            log.error("Unhandled {}", command.getDelta());
        }
    }

    public List<ConversationSnapshotDto> listConversations() {
        return conversations;
    }
}
