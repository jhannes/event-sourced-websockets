package as.gnist.javazone;

import as.gnist.javazone.incident.generated.model.CreateIncidentDto;
import as.gnist.javazone.incident.generated.model.IncidentCommandDto;
import as.gnist.javazone.incident.generated.model.IncidentEventDto;
import as.gnist.javazone.incident.generated.model.IncidentInfoDto;
import as.gnist.javazone.incident.generated.model.IncidentSnapshotDto;
import as.gnist.javazone.incident.generated.model.IncidentSummaryListDto;
import as.gnist.javazone.incident.generated.model.MessageToServerDto;
import as.gnist.javazone.incident.generated.model.SampleModelData;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;

public class IncidentReactor {

    private final SampleModelData sampleData = new SampleModelData(-1);
    private final ArrayList<IncidentSnapshotDto> incidents = new ArrayList<>(List.of(
            sampleData.sampleIncidentSnapshotDto().setInfo(new IncidentInfoDto().setSummary("Fire")))
    );
    private final HashSet<IncidentListener> listeners = new HashSet<>();

    public void handle(MessageToServerDto message) {
        if (message instanceof IncidentCommandDto command) {
            if (command.getDelta() instanceof CreateIncidentDto create) {
                incidents.add(new IncidentSnapshotDto()
                        .setId(command.getIncidentId())
                        .setCreatedAt(command.getClientTime())
                        .setUpdatedAt(command.getClientTime())
                        .setInfo(create.getInfo())
                );
            }
            var event = new IncidentEventDto().putAll(command).setServerTime(OffsetDateTime.now());
            for (var listener : listeners) {
                listener.sendMessage(event);
            }
        }
    }

    public void subscribe(IncidentListener listener) {
        listeners.add(listener);
        listener.sendMessage(new IncidentSummaryListDto().setIncidents(incidents));
    }
}
