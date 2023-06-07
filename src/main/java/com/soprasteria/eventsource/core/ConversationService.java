package com.soprasteria.eventsource.core;

import com.soprasteria.eventsource.generated.api.AddMessageToConversationDeltaDto;
import com.soprasteria.eventsource.generated.api.CommandToServerDto;
import com.soprasteria.eventsource.generated.api.ConversationMessageSnapshotDto;
import com.soprasteria.eventsource.generated.api.ConversationSnapshotDto;
import com.soprasteria.eventsource.generated.api.CreateConversationDeltaDto;
import com.soprasteria.eventsource.generated.api.EventFromServerDto;
import com.soprasteria.eventsource.generated.api.UpdateConversationDeltaDto;
import com.soprasteria.eventsource.infrastructure.SafeCloseable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;

import java.time.OffsetDateTime;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Set;


public class ConversationService {

    private final Set<ConversationEventListener> listeners = new HashSet<>();

    public interface ConversationEventListener {
        void onEvent(EventFromServerDto event);
    }

    private static final Logger log = LoggerFactory.getLogger(ConversationService.class);

    private final List<ConversationSnapshotDto> conversations = new SampleConversationData().sampleListOfConversationSnapshotDto();

    public void submitCommand(CommandToServerDto command, String username) {
        var timestamp = command.getClientTime();
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
                    .forEach(c -> c.getMessages().put(
                            addMessage.getMessageId().toString(),
                            addMessage.getMessage().copyTo(new ConversationMessageSnapshotDto())
                                    .createdAt(timestamp).updatedAt(timestamp)
                    ));
        } else if (delta instanceof UpdateConversationDeltaDto updateDelta) {
            conversations.stream().filter(c -> c.getId().equals(updateDelta.getConversationId()))
                    .forEach(c -> updateDelta.getInfo().copyTo(c.getInfo()));
        } else {
            log.error("Unhandled {}", delta);
        }

        var eventFromServerDto = command.copyTo(new EventFromServerDto()).serverTime(OffsetDateTime.now()).username(username);
        try (var ignored = MDC.putCloseable("event.delta.type", eventFromServerDto.getDelta().getClass().getSimpleName());
             var ignored2 = MDC.putCloseable("event.id", eventFromServerDto.getId().toString())
        ) {
            listeners.forEach(listener -> listener.onEvent(eventFromServerDto));
        }
    }

    public List<ConversationSnapshotDto> listConversations() {
        return conversations;
    }

    public SafeCloseable listen(ConversationEventListener listener) {
        this.listeners.add(listener);
        return () -> listeners.remove(listener);
    }
}
