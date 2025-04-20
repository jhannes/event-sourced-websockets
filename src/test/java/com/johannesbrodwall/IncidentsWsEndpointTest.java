package com.johannesbrodwall;

import org.junit.jupiter.api.Test;
import org.openapitools.client.model.CreateIncidentDeltaDto;
import org.openapitools.client.model.IncidentEventDto;
import org.openapitools.client.model.IncidentSummaryDto;
import org.openapitools.client.model.IncidentSummaryListDto;
import org.openapitools.client.model.IncidentSummarySubscribeRequestDto;
import org.openapitools.client.model.MessageFromServerDto;
import org.openapitools.client.model.SampleModelData;
import org.openapitools.client.model.UpdateIncidentDeltaDto;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

@LifeCycleExtension
public class IncidentsWsEndpointTest {
    private final EventSourcingServer server = new EventSourcingServer(0);

    private final SampleModelData sampleData = new SampleModelData(-1);

    private WsClient<MessageFromServerDto> createClient() throws IOException {
        return new WsClient<>(MessageFromServerDto.class, new ApplicationObjectMapper(), server.getWsUri());
    }

    @Test
    void shouldReceiveInitialSummaries() throws IOException {
        try (var wsClient = createClient()) {
            IncidentSummaryListDto summaries = wsClient.request(new IncidentSummarySubscribeRequestDto());
            assertThat(summaries.getSummaries()).isEmpty();
        }
    }

    @Test
    void shouldReceiveEventWhenCommandIsAccepted() throws IOException {
        try (var wsClient = createClient()) {
            var _ = wsClient.request(new IncidentSummarySubscribeRequestDto());
            var delta = sampleData.sampleCreateIncidentDeltaDto();
            IncidentEventDto event = wsClient.request(sampleData.sampleIncidentCommandDto().setDelta(delta));
            assertThat(event.getDelta()).isEqualTo(delta);
        }
    }

    @Test
    void otherClientsShouldReceiveMyIncidents() throws IOException {
        var incidentInfo = sampleData.sampleIncidentInfoDto();
        var createCommand = sampleData.sampleIncidentCommandDto()
                .setDelta(new CreateIncidentDeltaDto().setInfo(incidentInfo));
        try (var wsClient = createClient()) {
            wsClient.request(new IncidentSummarySubscribeRequestDto());
            wsClient.request(createCommand);
        }

        try (var wsClient = createClient()) {
            IncidentSummaryListDto summaries = wsClient.request(new IncidentSummarySubscribeRequestDto());
            assertThat(summaries.getSummaries()).singleElement().usingRecursiveComparison().isEqualTo(
                    new IncidentSummaryDto()
                            .setId(createCommand.getIncidentId())
                            .setCreatedAt(createCommand.getClientTime())
                            .setUpdatedAt(createCommand.getClientTime())
                            .setInfo(incidentInfo)
            );
        }
    }

    @Test
    void bothClientsShouldReceiveUpdates() throws IOException {
        var incidentId = UUID.randomUUID();
        try (var firstClient = createClient(); var secondClient = createClient()) {
            firstClient.request(new IncidentSummarySubscribeRequestDto());
            secondClient.request(new IncidentSummarySubscribeRequestDto());

            firstClient.request(sampleData.sampleIncidentCommandDto()
                    .setIncidentId(incidentId)
                    .setDelta(sampleData.sampleCreateIncidentDeltaDto()));
            IncidentEventDto createEvent = secondClient.pollNext();
            assertThat(createEvent.getDelta()).isInstanceOf(CreateIncidentDeltaDto.class);
            assertThat(createEvent.getIncidentId()).isEqualTo(incidentId);

            secondClient.request(sampleData.sampleIncidentCommandDto()
                    .setIncidentId(incidentId)
                    .setDelta(sampleData.sampleUpdateIncidentDeltaDto())
            );
            IncidentEventDto updateEvent = firstClient.pollNext();
            assertThat(updateEvent.getDelta()).isInstanceOf(UpdateIncidentDeltaDto.class);
        }
    }

    @Test
    void shouldOnlyReceiveUpdatedSnapshots() throws IOException {
        var incidentId = UUID.randomUUID();
        try (var client = createClient()) {
            client.request(new IncidentSummarySubscribeRequestDto());
            client.request(sampleData.sampleIncidentCommandDto()
                    .setIncidentId(incidentId)
                    .setDelta(sampleData.sampleCreateIncidentDeltaDto()));
        }

        long lastSequenceId;
        try (var client = createClient()) {
            IncidentSummaryListDto summaries = client.request(new IncidentSummarySubscribeRequestDto());
            lastSequenceId = summaries.getLastSequenceId();
            assertThat(summaries.getSummaries()).extracting(IncidentSummaryDto::getId)
                    .isEqualTo(List.of(incidentId));
            assertThat(summaries.getReplaceList()).isEqualTo(true);
        }
        try (var client = createClient()) {
            IncidentSummaryListDto summaries = client.request(new IncidentSummarySubscribeRequestDto()
                    .setLastSequenceId(lastSequenceId)
            );
            lastSequenceId = summaries.getLastSequenceId();
            assertThat(summaries.getSummaries()).isEmpty();
            assertThat(summaries.getReplaceList()).isEqualTo(false);
        }

        var secondIncidentId = UUID.randomUUID();
        try (var client = createClient()) {
            client.request(new IncidentSummarySubscribeRequestDto());
            client.request(sampleData.sampleIncidentCommandDto()
                    .setIncidentId(secondIncidentId)
                    .setDelta(sampleData.sampleCreateIncidentDeltaDto()));
        }
        try (var client = createClient()) {
            IncidentSummaryListDto summaries = client.request(new IncidentSummarySubscribeRequestDto()
                    .setLastSequenceId(lastSequenceId)
            );
            lastSequenceId = summaries.getLastSequenceId();
            assertThat(summaries.getSummaries()).extracting(IncidentSummaryDto::getId)
                    .isEqualTo(List.of(secondIncidentId));
        }
        try (var client = createClient()) {
            client.request(new IncidentSummarySubscribeRequestDto());
            client.request(sampleData.sampleIncidentCommandDto()
                    .setIncidentId(incidentId)
                    .setDelta(sampleData.sampleUpdateIncidentDeltaDto()));
        }
        try (var client = createClient()) {
            IncidentSummaryListDto summaries = client.request(new IncidentSummarySubscribeRequestDto()
                    .setLastSequenceId(lastSequenceId)
            );
            assertThat(summaries.getSummaries()).extracting(IncidentSummaryDto::getId)
                    .isEqualTo(List.of(incidentId));
        }
    }
}
