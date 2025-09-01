package no.gnistconsulting.javazone;

import org.openapitools.client.model.CreateIncidentDeltaDto;
import org.openapitools.client.model.IncidentCommandDto;
import org.openapitools.client.model.IncidentEventDto;
import org.openapitools.client.model.IncidentInfoDto;
import org.openapitools.client.model.IncidentSnapshotDto;
import org.openapitools.client.model.IncidentSummaryListDto;
import org.openapitools.client.model.MessageToServerDto;
import org.openapitools.client.model.UpdateIncidentDeltaDto;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class IncidentReactor {
    private final Set<IncidentListener> listeners = new HashSet<>();
    private final List<IncidentSnapshotDto> incidents = new ArrayList<>(List.of(
            new IncidentSnapshotDto()
                    .setCreatedAt(OffsetDateTime.now()).setUpdatedAt(OffsetDateTime.now()).setId(UUID.randomUUID())
                    .setInfo(new IncidentInfoDto().setDescription("Fire from the server")),
            new IncidentSnapshotDto()
                    .setCreatedAt(OffsetDateTime.now()).setUpdatedAt(OffsetDateTime.now()).setId(UUID.randomUUID())
                    .setInfo(new IncidentInfoDto().setDescription("Traffic accident from the server"))
    ));
    private final AtomicLong sequenceId = new AtomicLong(System.currentTimeMillis());

    public void subscribe(IncidentListener listener) {
        listener.sendMessage(new IncidentSummaryListDto().setIncidents(incidents));
        this.listeners.add(listener);
    }

    public void handleMessage(MessageToServerDto message) {
        switch (message) {
            case IncidentCommandDto command -> handleCommand(command);
        }
    }

    private void handleCommand(IncidentCommandDto command) {
        switch (command.getDelta()) {
            case CreateIncidentDeltaDto create -> {
                incidents.add(new IncidentSnapshotDto()
                        .setId(command.getIncidentId())
                        .setCreatedAt(command.getClientTime())
                        .setUpdatedAt(command.getClientTime())
                        .setInfo(create.getInfo())
                );
            }
            case UpdateIncidentDeltaDto update -> {
                incidents.stream().filter(o -> o.getId().equals(command.getIncidentId())).forEach(o -> {
                    o.setUpdatedAt(command.getClientTime()).getInfo().putAll(update.getInfo());
                });
            }
        }
        var event = new IncidentEventDto().putAll(command).setSequenceId(nextSequenceId());
        for (var listener : listeners) {
            listener.sendMessage(event);
        }
    }

    private long nextSequenceId() {
        return sequenceId.incrementAndGet();
    }
}
