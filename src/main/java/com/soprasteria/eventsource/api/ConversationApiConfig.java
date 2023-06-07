package com.soprasteria.eventsource.api;

import com.soprasteria.eventsource.core.ConversationService;
import org.glassfish.jersey.internal.inject.AbstractBinder;
import org.glassfish.jersey.server.ResourceConfig;

import java.util.Map;

public class ConversationApiConfig extends ResourceConfig {

    public ConversationApiConfig(ConversationService service) {
        super(ConversationController.class, CommandsController.class);
        register(ConversationApiJsonbContextResolver.class);
        register(new AbstractBinder() {
            @Override
            protected void configure() {
                bind(service).to(ConversationService.class);
            }
        });
        setProperties(Map.of(
                "jersey.config.server.wadl.disableWadl", true
        ));
    }
}
