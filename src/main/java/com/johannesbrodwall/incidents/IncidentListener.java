package com.johannesbrodwall.incidents;

import com.johannesbrodwall.incidents.model.MessageFromServerDto;

public interface IncidentListener {
    void sendMessage(MessageFromServerDto message);
}
