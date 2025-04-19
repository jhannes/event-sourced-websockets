package com.johannesbrodwall;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.websocket.Endpoint;
import jakarta.websocket.EndpointConfig;
import jakarta.websocket.Session;
import lombok.SneakyThrows;
import org.openapitools.client.model.IncidentSummaryDto;
import org.openapitools.client.model.IncidentSummaryListDto;
import org.openapitools.client.model.SampleModelData;

import java.util.List;

public class IncidentsWsEndpoint extends Endpoint {

    private static final ObjectMapper mapper = new ObjectMapper();
    private static final SampleModelData sampleData = new SampleModelData(-1);
    private final List<IncidentSummaryDto> summaries = List.of(
            sampleData.sampleIncidentSummaryDto().setDescription("Fire"),
            sampleData.sampleIncidentSummaryDto().setDescription("Traffic accident")
    );

    @SneakyThrows
    @Override
    public void onOpen(Session session, EndpointConfig config) {
        session.getAsyncRemote().sendText(mapper.writeValueAsString(new IncidentSummaryListDto().setSummaries(summaries)));
    }
}
