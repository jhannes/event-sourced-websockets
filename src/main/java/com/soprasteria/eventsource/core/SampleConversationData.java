package com.soprasteria.eventsource.core;

import com.soprasteria.eventsource.generated.api.ConversationInfoDto;
import com.soprasteria.eventsource.generated.api.ConversationMessageDto;
import com.soprasteria.eventsource.generated.api.ConversationSnapshotDto;
import com.soprasteria.eventsource.generated.api.SampleModelData;

import java.util.List;
import java.util.function.Supplier;

public class SampleConversationData extends SampleModelData {
    public SampleConversationData() {
        super(100L);
    }

    @Override
    public List<ConversationMessageDto> sampleListOfConversationMessageDto() {
        return sampleList(this::sampleConversationMessageDto, 3, 10);
    }

    @Override
    public List<ConversationSnapshotDto> sampleListOfConversationSnapshotDto() {
        return sampleList(this::sampleConversationSnapshotDto, 5, 10);
    }

    @Override
    public ConversationSnapshotDto sampleConversationSnapshotDto() {
        var messages = sampleMap(() -> sampleConversationMessageDto("messages"), "messages", 10, 15);
        return super.sampleConversationSnapshotDto().messages(messages);
    }

    @Override
    public ConversationMessageDto sampleConversationMessageDto() {
        return new ConversationMessageDto().text(randomMessageText());
    }

    @Override
    public ConversationInfoDto sampleConversationInfoDto() {
        return new ConversationInfoDto().title(randomConversationTitle()).summary(randomWords(50, 200));
    }

    private String randomMessageText() {
        return randomWords(10, 20);
    }

    private String randomConversationTitle() {
        List<Supplier<String>> alternatives = List.of(
                () -> pickOne(List.of("The question of ", "Dealing with ", "What to do about ")) +
                      pickOne(List.of("Spring vs Java EE", "XML vs JSON", "REST vs Web Sockets")) +
                      pickOne(List.of(" this time around", " for the next project", "")),
                () -> pickOne(List.of("Customer support for ", "New order for ", "Returns for ", "Another call from ")) +
                      pickOne(List.of("our favorite customer", "the boss", "a friend", "repeat business")) +
                      pickOne(List.of(" (urgent)", " in Oslo", " in London", ""))
        );
        return pickOne(alternatives).get();
    }

    private String randomWords(int min, int max) {
        return String.join(" ", sampleList(this::randomWord, min, max));
    }

    private String randomWord() {
        return pickOne(COMMON_WORDS);
    }

    private static final String[] COMMON_WORDS = {
            "the", "of", "to", "and", "a", "in", "is", "it", "you", "that", "he", "was", "for", "on", "are", "with", "as", "I", "his", "they", "be", "at", "one", "have", "this", "from", "or", "had", "by", "word", "but", "what", "some", "we", "can", "out", "other", "were", "all", "there", "when", "up", "use", "your", "how", "said", "an", "each", "she", "which", "do", "their", "time", "if", "will", "way", "about", "many", "then", "them", "write", "would", "like", "so", "these", "her", "long", "make", "thing", "see", "him", "two", "has", "look", "more", "day", "could", "go", "come", "did", "number", "sound", "no", "most", "people", "my", "over", "know", "water", "than", "call", "first", "who", "may", "down", "side", "been", "now", "find", "any",
    };
}
