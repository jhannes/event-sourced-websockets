package as.gnist.javazone;

import as.gnist.javazone.incident.generated.model.IncidentDto;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;

public class IncidentReactor {

    private final ArrayList<IncidentDto> incidents = new ArrayList<>(List.of(new IncidentDto().setSummary("Fire on the server")));
    private final HashSet<IncidentListener> listeners = new HashSet<>();

    public List<IncidentDto> getIncidents() {
        return incidents;
    }

    public void handle(IncidentDto incident) {
        incidents.add(incident);
        for (var listener : listeners) {
            listener.sendMessage(incidents);
        }
    }

    public void subscribe(IncidentListener listener) {
        listeners.add(listener);
    }
}
