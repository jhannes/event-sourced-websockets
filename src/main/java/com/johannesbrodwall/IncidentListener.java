package com.johannesbrodwall;

import com.johannesbrodwall.incidents.model.MessageFromServerDto;

public interface IncidentListener {
    void sendMessage(MessageFromServerDto message);
}
