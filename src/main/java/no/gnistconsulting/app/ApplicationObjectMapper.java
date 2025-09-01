package no.gnistconsulting.app;

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
import no.gnistconsulting.incidents.model.IncidentDeltaDto;
import no.gnistconsulting.incidents.model.IncidentEventDto;
import no.gnistconsulting.incidents.model.IncidentSnapshotDto;
import no.gnistconsulting.incidents.model.IncidentSummaryListDto;
import no.gnistconsulting.incidents.model.MessageFromServerDto;
import no.gnistconsulting.incidents.model.MessageToServerDto;
import no.gnistconsulting.incidents.model.SignalFromServerDto;

import java.io.IOException;
import java.util.function.Function;

public class ApplicationObjectMapper extends ObjectMapper {
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
                if (o.has("signal")) return SignalFromServerDto.getType(o.get("signal").asText());
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
