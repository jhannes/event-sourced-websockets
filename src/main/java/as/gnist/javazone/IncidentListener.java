package as.gnist.javazone;

import as.gnist.javazone.incident.generated.model.MessageFromServerDto;

public interface IncidentListener {
    void sendMessage(MessageFromServerDto message);
}
