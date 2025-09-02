package no.gnistconsulting.javazone;

import org.openapitools.client.model.CreateIncidentDeltaDto;
import org.openapitools.client.model.IncidentCommandDto;
import org.openapitools.client.model.IncidentDto;
import org.openapitools.client.model.IncidentEventDto;
import org.openapitools.client.model.IncidentSnapshotDto;
import org.openapitools.client.model.IncidentSnapshotListDto;
import org.openapitools.client.model.MessageFromServerDto;
import org.openapitools.client.model.MessageToServerDto;
import org.openapitools.client.model.UpdateIncidentDeltaDto;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

public class IncidentReactor {
    private final Set<IncidentListener> listeners = new HashSet<>();
    private final List<IncidentSnapshotDto> incidents = new ArrayList<>(
            List.of(
                    new IncidentSnapshotDto().setId(UUID.randomUUID()).setUpdatedAt(OffsetDateTime.now()).setInfo(new IncidentDto().setDescription("Fire from the server")),
                    new IncidentSnapshotDto().setId(UUID.randomUUID()).setUpdatedAt(OffsetDateTime.now()).setInfo(new IncidentDto().setDescription("Server traffic"))
            )
    );
    private long sequenceId = System.currentTimeMillis();

    public void subscribe(IncidentListener listener) {
        listeners.add(listener);
        listener.sendMessage(new IncidentSnapshotListDto().setIncidents(incidents));
    }

    public void handleMessage(MessageToServerDto message) {
        switch (message) {
            case IncidentCommandDto command -> {
                handleCommand(command);
                broadcastMessage(new IncidentEventDto().setSequenceId(sequenceId++).putAll(command));
            }
        }
    }

    private void handleCommand(IncidentCommandDto command) {
        switch (command.getDelta()) {
            case CreateIncidentDeltaDto create -> incidents.add(
                    new IncidentSnapshotDto().setUpdatedAt(command.getClientTime()).setId(command.getIncidentId()).setInfo(create.getInfo())
            );
            case UpdateIncidentDeltaDto update -> incidents.stream().filter(o -> o.getId().equals(command.getIncidentId()))
                    .forEach(o -> o.setUpdatedAt(command.getClientTime()).getInfo().putAll(update.getInfo()));
        }
    }

    private void broadcastMessage(MessageFromServerDto message) {
        for (var listener : listeners) {
            listener.sendMessage(message);
        }
    }
}
