package no.gnistconsulting.incidents;

import no.gnistconsulting.incidents.model.MessageFromServerDto;

public interface IncidentListener {
    void sendMessage(MessageFromServerDto message);
}
