package as.gnist.javazone;

import as.gnist.javazone.incident.generated.model.IncidentDto;

import java.util.List;

public interface IncidentListener {
    void sendMessage(List<IncidentDto> incidents);
}
