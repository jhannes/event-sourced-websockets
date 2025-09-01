# Demonstration of Event Sourced WebSockets with Contract First

## Plan - intro

1. Introduction to [real time web applications](https://www.aftenposten.no/norge/i/Jbwj6R/nytt-digitalt-verktoey-skal-revolusjonere-leteaksjoner-dette-vil-redde-mange-liv)
2. Demonstration of the [outcome](https://github.com/jhannes/event-sourced-websockets/tree/demo/java)

## Live programming

1. Create `IncidentDto` in frontend and register
2. Create `src/main/resources/webapp/api-doc/incidents.yaml`
   - Critical part: `openapi: 3.0.3`
3. Add plugin `openapi-generator-maven-plugin` (version `7.12.0`) with dependency `openapi-generator-typescript-fetch-api`
4. Replace `IncidentDto` with generated `IncidentDto`
5. Extend code generation with `openapi-generator-java-lombok`
6. Add `jetty-ee10-websocket-jakarta-server` dependency
7. Configure web sockets with Jetty:
   ```jshelllanguage
   handler.addServletContainerInitializer(new JakartaWebSocketServletContainerInitializer((servletContext, serverContainer) -> {
     serverContainer.addEndpoint(ServerEndpointConfig.Builder.create(IncidentWsEndpoint.class, "/incidents").build());
   }));
   ```
8. Make `IncidentWsEndpoint` send `IncidentSnapshotListDto` (as a `MessageFromServer`)
9. Introduce `IncidentReact`, replace `ServerEndpointConfig.Builder` with
   ```jshelllanguage
   ServerEndpointConfig.Builder.create(IncidentWsEndpoint.class, "/incidents")
     .configurator(new ServerEndpointConfig.Configurator() {
           @Override
           public <T> T getEndpointInstance(Class<T> endpointClass) throws InstantiationException {
               //noinspection unchecked
               return (T)new IncidentWsEndpoint(reactor);
           }
     })
     .build()
   ```
10. Reactor broadcast `IncidentSnapshotList`
11. GOAL: Only broadcast create events
12. Introduce `IncidentCommand` with `IncidentDelta` with `CreateIncidentDelta` as `MessageToServer`
13. Introduce `IncidentEvent` as `MessageFromServer`
14. GOAL: `UpdateIncidentDelta`
