package as.gnist.javazone;

import as.gnist.javazone.incident.generated.model.CreateIncidentDto;
import as.gnist.javazone.incident.generated.model.IncidentCommandDto;
import as.gnist.javazone.incident.generated.model.IncidentEventDto;
import as.gnist.javazone.incident.generated.model.IncidentSnapshotDto;
import as.gnist.javazone.incident.generated.model.IncidentSummaryDto;
import as.gnist.javazone.incident.generated.model.IncidentSummaryListDto;
import as.gnist.javazone.incident.generated.model.MessageToServerDto;
import as.gnist.javazone.incident.generated.model.SampleModelData;
import as.gnist.javazone.incident.generated.model.UpdateIncidentDto;

import java.time.OffsetDateTime;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.UUID;

public class IncidentReactor {

    private final Map<UUID, IncidentSnapshotDto> incidents = new HashMap<>();
    private final HashSet<IncidentListener> listeners = new HashSet<>();

    public IncidentReactor() {
        var sampleData = new SampleModelData(-1);
        addIncident(sampleData.sampleIncidentSnapshotDto().setInfo(sampleData.sampleIncidentInfoDto().setSummary("Fire")));
    }

    public void handle(MessageToServerDto message) {
        if (message instanceof IncidentCommandDto command) {
            handleCommand(command);
            var event = new IncidentEventDto().putAll(command).setServerTime(OffsetDateTime.now());
            for (var listener : listeners) {
                listener.sendMessage(event);
            }
        }
    }

    private void handleCommand(IncidentCommandDto command) {
        switch (command.getDelta()) {
            case CreateIncidentDto create -> addIncident(new IncidentSnapshotDto()
                    .setId(command.getIncidentId())
                    .setCreatedAt(command.getClientTime())
                    .setUpdatedAt(command.getClientTime())
                    .setInfo(create.getInfo()));
            case UpdateIncidentDto update -> incidents.get(command.getIncidentId())
                    .setUpdatedAt(command.getClientTime())
                    .getInfo().putAll(update.getInfo());
            default -> {
            }
        }
    }

    private void addIncident(IncidentSnapshotDto incident) {
        incidents.put(incident.getId(), incident);
    }

    public void subscribe(IncidentListener listener) {
        listeners.add(listener);
        listener.sendMessage(new IncidentSummaryListDto().setIncidents(incidents.values()
                .stream()
                .map(o -> new IncidentSummaryDto().putAll(o))
                .toList()));
    }
}
