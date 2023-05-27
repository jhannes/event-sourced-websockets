package com.soprasteria.eventsource.core;

import com.soprasteria.eventsource.generated.api.AddMessageToConversationDeltaDto;
import com.soprasteria.eventsource.generated.api.CommandToServerDto;
import com.soprasteria.eventsource.generated.api.ConversationSnapshotDto;
import com.soprasteria.eventsource.generated.api.CreateConversationDeltaDto;
import com.soprasteria.eventsource.generated.api.UpdateConversationDeltaDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;

import java.util.HashMap;
import java.util.List;


public class ConversationService {
    private static final Logger log = LoggerFactory.getLogger(ConversationService.class);

    private final List<ConversationSnapshotDto> conversations = new SampleConversationData().sampleListOfConversationSnapshotDto();

    public void submitCommand(CommandToServerDto command) {
        var delta = command.getDelta();
        MDC.put("delta", delta.getDelta());
        log.debug("Handling command");
        if (delta instanceof CreateConversationDeltaDto createDelta) {
            conversations.add(new ConversationSnapshotDto()
                    .id(createDelta.getConversationId())
                    .info(createDelta.getInfo())
                    .messages(new HashMap<>())
            );
        } else if (delta instanceof AddMessageToConversationDeltaDto addMessage) {
            conversations.stream().filter(c -> c.getId().equals(addMessage.getConversationId()))
                    .forEach(c -> c.getMessages().put(addMessage.getMessageId().toString(), addMessage.getMessage()));
        } else if (delta instanceof UpdateConversationDeltaDto updateDelta) {
            conversations.stream().filter(c -> c.getId().equals(updateDelta.getConversationId()))
                    .forEach(c -> updateDelta.getInfo().copyTo(c.getInfo()));
        } else {
            log.error("Unhandled {}", delta);
        }
    }

    public List<ConversationSnapshotDto> listConversations() {
        return conversations;
    }
}
