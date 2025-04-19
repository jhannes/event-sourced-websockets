package com.johannesbrodwall;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.websocket.Endpoint;
import jakarta.websocket.EndpointConfig;
import jakarta.websocket.RemoteEndpoint;
import jakarta.websocket.Session;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.openapitools.client.model.CreateIncidentDeltaDto;
import org.openapitools.client.model.IncidentCommandDto;
import org.openapitools.client.model.IncidentEventDto;
import org.openapitools.client.model.IncidentSummaryDto;
import org.openapitools.client.model.IncidentSummaryListDto;
import org.openapitools.client.model.MessageFromServerDto;
import org.openapitools.client.model.MessageToServerDto;
import org.openapitools.client.model.SampleModelData;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Slf4j
public class IncidentsWsEndpoint extends Endpoint {

    private static final ObjectMapper mapper = new ApplicationObjectMapper();
    private static final SampleModelData sampleData = new SampleModelData(-1);
    private static final List<IncidentSummaryDto> summaries = new ArrayList<>(List.of(
            sampleData.sampleIncidentSummaryDto().setDescription("Fire"),
            sampleData.sampleIncidentSummaryDto().setDescription("Traffic accident")
    ));
    private RemoteEndpoint.Async remote;
    private final static Set<IncidentsWsEndpoint> clients = new HashSet<>();

    @Override
    public void onOpen(Session session, EndpointConfig config) {
        this.remote = session.getAsyncRemote();
        sendMessageToClient(new IncidentSummaryListDto().setSummaries(summaries));
        session.addMessageHandler(String.class, this::handleMessage);
        clients.add(this);
    }

    @SneakyThrows
    private void sendMessageToClient(MessageFromServerDto message) {
        remote.sendText(mapper.writeValueAsString(message));
    }

    @SneakyThrows
    private void handleMessage(String s) {
        var message = mapper.readValue(s, MessageToServerDto.class);
        switch (message) {
            case IncidentCommandDto command -> {
                switch (command.getDelta()) {
                    case CreateIncidentDeltaDto create -> summaries.add(new IncidentSummaryDto()
                            .setId(command.getIncidentId())
                            .setDescription(create.getDescription()));
                }
                broadcastMessage(new IncidentEventDto()
                        .setUsername("the_user")
                        .putAll(command));
            }
        }
    }

    private void broadcastMessage(MessageFromServerDto message) {
        clients.forEach(c -> c.sendMessageToClient(message));
    }

    @Override
    public void onError(Session session, Throwable throwable) {
        log.error("Web socket error", throwable);
    }

}
