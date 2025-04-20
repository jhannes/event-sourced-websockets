package com.johannesbrodwall;

import org.junit.jupiter.api.Test;
import org.openapitools.client.model.IncidentSummaryListDto;
import org.openapitools.client.model.MessageFromServerDto;

import java.util.concurrent.TimeUnit;

import static org.assertj.core.api.Assertions.assertThat;

@LifeCycleExtension
public class IncidentsWsEndpointTest {
    private final EventSourcingServer server = new EventSourcingServer(0);

    @Test
    void testHello() throws Exception {
        try (var wsClient = new WsClient<>(MessageFromServerDto.class, new ApplicationObjectMapper(), server.getWsUri())) {
            IncidentSummaryListDto summaries = wsClient.poll(5, TimeUnit.SECONDS);
            assertThat(summaries.getSummaries()).isEmpty();
        }
    }
}
