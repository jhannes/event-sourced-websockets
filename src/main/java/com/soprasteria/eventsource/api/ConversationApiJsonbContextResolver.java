package com.soprasteria.eventsource.api;

import com.soprasteria.eventsource.generated.api.DeltaDto;
import jakarta.json.JsonObject;
import jakarta.json.bind.Jsonb;
import jakarta.json.bind.JsonbBuilder;
import jakarta.json.bind.JsonbConfig;
import jakarta.json.bind.serializer.DeserializationContext;
import jakarta.json.bind.serializer.JsonbDeserializer;
import jakarta.json.stream.JsonParser;
import jakarta.ws.rs.ext.ContextResolver;
import jakarta.ws.rs.ext.Provider;

import java.lang.reflect.Type;

@Provider
public class ConversationApiJsonbContextResolver implements ContextResolver<Jsonb> {
    @Override
    public Jsonb getContext(Class<?> type) {
        return createJsonb();
    }

    public static Jsonb createJsonb() {
        return JsonbBuilder.create(new JsonbConfig()
                .withDeserializers(createDeltaDeserializer(JsonbBuilder.create()))
        );
    }

    private static AllOfDtoDeserializer<DeltaDto> createDeltaDeserializer(Jsonb jsonb) {
        return new AllOfDtoDeserializer<>(jsonb) {
            @Override
            protected Class<? extends DeltaDto> getType(JsonObject jsonObject) {
                return DeltaDto.getType(jsonObject.getString("delta"));
            }
        };
    }

    public static abstract class AllOfDtoDeserializer<T> implements JsonbDeserializer<T> {
        private final Jsonb jsonb;

        protected AllOfDtoDeserializer(Jsonb jsonb) {
            this.jsonb = jsonb;
        }

        @Override
        public T deserialize(JsonParser parser, DeserializationContext ctx, Type rtType) {
            var jsonObject = parser.getObject();
            return jsonb.fromJson(jsonObject.toString(), getType(jsonObject));
        }

        protected abstract Class<? extends T> getType(JsonObject jsonObject);
    }
}
