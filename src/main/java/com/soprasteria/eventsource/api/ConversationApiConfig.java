package com.soprasteria.eventsource.api;

import org.glassfish.jersey.server.ResourceConfig;

import java.util.Map;

public class ConversationApiConfig extends ResourceConfig {
    public ConversationApiConfig() {
        super(ConversationController.class);
        setProperties(Map.of(
                "jersey.config.server.wadl.disableWadl", true
        ));
    }
}
