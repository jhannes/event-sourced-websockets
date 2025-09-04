package no.gnistconsulting;

import org.openapitools.client.model.CreateIncidentDeltaDto;
import org.openapitools.client.model.IncidentCommandDto;
import org.openapitools.client.model.IncidentDto;
import org.openapitools.client.model.IncidentEventDto;
import org.openapitools.client.model.IncidentSnapshotDto;
import org.openapitools.client.model.IncidentSnapshotListDto;
import org.openapitools.client.model.MessageFromServerDto;
import org.openapitools.client.model.MessageToServerDto;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class IncidentReactor {

    private final List<IncidentSnapshotDto> incidents = new ArrayList<>(List.of(
            new IncidentSnapshotDto().setInfo(new IncidentDto().setDescription("Fire on server")),
            new IncidentSnapshotDto().setInfo(new IncidentDto().setDescription("Traffic on the server")
    )));
    private final Set<IncidentListener> listeners = new HashSet<>();

    public void subscribe(IncidentListener listener) {
        listeners.add(listener);
        listener.sendMessage(new IncidentSnapshotListDto().setIncidents(incidents));
    }

    public void handleMessage(MessageToServerDto message) {
        switch (message) {
            case IncidentCommandDto command -> {
                handleCommand(command);
                broadcastMessage(new IncidentEventDto().putAll(command)
                        .setSequenceId(1L)
                );
            }
        }
    }

    private void handleCommand(IncidentCommandDto command) {
        switch (command.getDelta()) {
            case CreateIncidentDeltaDto create -> {
                incidents.add(new IncidentSnapshotDto()
                        .setId(command.getIncidentId())
                        .setUpdatedAt(command.getClientTime())
                        .setInfo(create.getInfo())
                );
            }
        }
    }

    private void broadcastMessage(MessageFromServerDto message) {
        for (IncidentListener listener : listeners) {
            listener.sendMessage(message);
        }
    }
}
