package com.johannesbrodwall;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.module.SimpleModule;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.johannesbrodwall.incidents.model.IncidentDeltaDto;
import com.johannesbrodwall.incidents.model.IncidentEventDto;
import com.johannesbrodwall.incidents.model.IncidentSnapshotDto;
import com.johannesbrodwall.incidents.model.IncidentSummaryListDto;
import com.johannesbrodwall.incidents.model.MessageFromServerDto;
import com.johannesbrodwall.incidents.model.MessageToServerDto;

import java.io.IOException;
import java.util.function.Function;

class ApplicationObjectMapper extends ObjectMapper {
    public ApplicationObjectMapper() {
        setSerializationInclusion(JsonInclude.Include.NON_ABSENT);
        configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);
        configure(DeserializationFeature.ADJUST_DATES_TO_CONTEXT_TIME_ZONE, false);
        registerModule(new JavaTimeModule());
        registerModule(new ApplicationModule());
    }

    private static class ApplicationModule extends SimpleModule {
        {
            addInterfaceDeserializer(MessageToServerDto.class, o -> MessageToServerDto.getType(o.get("type").asText()));
            addInterfaceDeserializer(IncidentDeltaDto.class, o -> IncidentDeltaDto.getType(o.get("delta").asText()));
            addInterfaceDeserializer(MessageFromServerDto.class, o -> {
                if (o.has("summaries")) return IncidentSummaryListDto.class;
                if (o.has("delta")) return IncidentEventDto.class;
                if (o.has("id")) return IncidentSnapshotDto.class;
                throw new IllegalArgumentException("Don't know how to deserialize " + o);
            });
        }

        private <T> void addInterfaceDeserializer(Class<T> type, Function<ObjectNode, Class<? extends T>> resolver) {
            addDeserializer(type, new JsonDeserializer<>() {
                @Override
                public T deserialize(JsonParser p, DeserializationContext context) throws IOException {
                    var mapper = (ObjectMapper) p.getCodec();
                    ObjectNode o = mapper.readTree(p);
                    return mapper.treeToValue(o, resolver.apply(o));
                }
            });
        }
    }
}
