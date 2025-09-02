package no.gnistconsulting;

import org.openapitools.client.model.MessageFromServerDto;

public interface IncidentListener {
    void sendMessage(MessageFromServerDto message);
}
