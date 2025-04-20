package com.johannesbrodwall;

import com.johannesbrodwall.incidents.model.MessageToServerDto;
import com.johannesbrodwall.incidents.model.UnauthenticatedErrorSignalDto;
import com.johannesbrodwall.openid.model.JwtPayloadDto;
import jakarta.websocket.ClientEndpointConfig;
import org.junit.jupiter.api.Test;
import com.johannesbrodwall.incidents.model.CreateIncidentDeltaDto;
import com.johannesbrodwall.incidents.model.IncidentEventDto;
import com.johannesbrodwall.incidents.model.IncidentSummaryDto;
import com.johannesbrodwall.incidents.model.IncidentSummaryListDto;
import com.johannesbrodwall.incidents.model.IncidentSummarySubscribeRequestDto;
import com.johannesbrodwall.incidents.model.MessageFromServerDto;
import com.johannesbrodwall.incidents.model.SampleModelData;
import com.johannesbrodwall.incidents.model.UpdateIncidentDeltaDto;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import static com.johannesbrodwall.OpenidConnectMockServer.base64Json;
import static org.assertj.core.api.Assertions.assertThat;

@LifeCycleExtension
public class IncidentsWsEndpointTest {
    private final OpenidConnectMockServer loginServer = new OpenidConnectMockServer(0);
    private final EventSourcingServer server = new EventSourcingServer(0, loginServer.getClientConfiguration());

    private final SampleModelData sampleData = new SampleModelData(0);

    private JwtPayloadDto createAccessToken() {
        return new JwtPayloadDto()
                .setName("my-user-name")
                .setAud(loginServer.getClientConfiguration().getClientId())
                .setExp(System.currentTimeMillis() + 60 * 60 * 1000);
    }

    private WsClient<MessageFromServerDto, MessageToServerDto> createClient() throws IOException {
        return createClientWithAccessToken(createAccessToken());
    }

    private WsClient<MessageFromServerDto, MessageToServerDto> createClientWithAccessToken(JwtPayloadDto accessToken) throws IOException {
        return createClient(ClientEndpointConfig.Builder.create()
                .configurator(new ClientEndpointConfig.Configurator() {
                    @Override
                    public void beforeRequest(Map<String, List<String>> headers) {
                        headers.put("Cookie", List.of("accessToken=" + base64Json(accessToken)));
                    }
                })
                .build());
    }

    private WsClient<MessageFromServerDto, MessageToServerDto> createClient(ClientEndpointConfig config) throws IOException {
        return new WsClient<>(MessageFromServerDto.class, new ApplicationObjectMapper(), server.getWsUri(), config);
    }

    @Test
    void shouldRequestLogin() throws IOException {
        try (var wsClient = createClient(ClientEndpointConfig.Builder.create().build())) {
            var message = wsClient.pollNext();
            assertThat(message).isInstanceOf(UnauthenticatedErrorSignalDto.class);
        }
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
        var accessToken = createAccessToken().setName(sampleData.randomEmail());
        try (var wsClient = createClientWithAccessToken(accessToken)) {
            var _ = wsClient.request(new IncidentSummarySubscribeRequestDto());
            var delta = sampleData.sampleCreateIncidentDeltaDto();
            IncidentEventDto event = wsClient.request(sampleData.sampleIncidentCommandDto().setDelta(delta));
            assertThat(event.getDelta()).isEqualTo(delta);
            assertThat(event.getUsername()).isEqualTo(accessToken.getName());
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

    @Test
    void resetSequenceIdOnNewReactor() throws IOException {
        try (var client = createClient()) {
            IncidentSummaryListDto summaries = client.request(new IncidentSummarySubscribeRequestDto()
                    .setLastSequenceId(System.currentTimeMillis() - 10_000_000)
            );
            assertThat(summaries.getSummaries()).isEmpty();
            assertThat(summaries.getReplaceList()).isEqualTo(true);
        }
    }
}
