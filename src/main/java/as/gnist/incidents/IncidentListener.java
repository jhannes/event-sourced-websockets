package as.gnist.incidents;

import as.gnist.incidents.model.MessageFromServerDto;

public interface IncidentListener {
    void sendMessage(MessageFromServerDto message);
}
