package no.gnistconsulting.javazone;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.core.JacksonException;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.module.SimpleModule;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.openapitools.client.model.IncidentDeltaDto;
import org.openapitools.client.model.MessageToServerDto;

import java.io.IOException;
import java.util.function.Function;

public class IncidentObjectMapper extends ObjectMapper {

    public IncidentObjectMapper() {
        registerModule(new IncidentModule())
                .registerModule(new JavaTimeModule())
                .setSerializationInclusion(JsonInclude.Include.NON_ABSENT)
                .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    }

    private static class IncidentModule extends SimpleModule {
        {
            addDeserializer(MessageToServerDto.class, subtypeDeserializer(o -> MessageToServerDto.getType(o.get("type").asText())));
            addDeserializer(IncidentDeltaDto.class, subtypeDeserializer(o -> IncidentDeltaDto.getType(o.get("type").asText())));
        }
    }

    private static <T> JsonDeserializer<T> subtypeDeserializer(Function<ObjectNode, Class<? extends T>> resolver) {
        return new JsonDeserializer<>() {
            @Override
            public T deserialize(JsonParser parser, DeserializationContext context) throws IOException {
                var mapper = (ObjectMapper) parser.getCodec();
                ObjectNode o = mapper.readTree(parser);
                return mapper.treeToValue(o, resolver.apply(o));
            }
        };
    }
}
