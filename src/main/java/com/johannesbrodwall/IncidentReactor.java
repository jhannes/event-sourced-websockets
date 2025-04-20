package com.johannesbrodwall;

import org.openapitools.client.model.AddPersonToIncidentDeltaDto;
import org.openapitools.client.model.CreateIncidentDeltaDto;
import org.openapitools.client.model.IncidentCommandDto;
import org.openapitools.client.model.IncidentEventDto;
import org.openapitools.client.model.IncidentInfoDto;
import org.openapitools.client.model.IncidentSnapshotDto;
import org.openapitools.client.model.IncidentSummaryDto;
import org.openapitools.client.model.IncidentSummaryListDto;
import org.openapitools.client.model.UpdateIncidentDeltaDto;
import org.openapitools.client.model.UpdatePersonInIncidentDeltaDto;

import java.util.Collections;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

public class IncidentReactor {
    private final Map<UUID, IncidentSnapshotDto> incidents = new ConcurrentHashMap<>();
    private final Set<IncidentListener> subscriptions = Collections.synchronizedSet(new HashSet<>());

    public IncidentSummaryListDto incidentSummaryList() {
        return new IncidentSummaryListDto().setSummaries(incidents.values().stream()
                .map(s -> new IncidentSummaryDto().putAll(s))
                .toList());
    }

    public IncidentSnapshotDto snapshot(UUID incidentId) {
        return incidents.get(incidentId);
    }

    public void processCommand(IncidentCommandDto command) {
        switch (command.getDelta()) {
            case CreateIncidentDeltaDto create -> incidents.put(
                    command.getIncidentId(),
                    createIncident(command, create.getInfo())
            );
            case UpdateIncidentDeltaDto update -> incidents.get(command.getIncidentId())
                    .setUpdatedAt(command.getClientTime())
                    .getInfo().putAll(update.getInfo());
            case AddPersonToIncidentDeltaDto addPerson -> incidents.get(command.getIncidentId())
                    .getPersons().put(addPerson.getPersonId().toString(), addPerson.getInfo());
            case UpdatePersonInIncidentDeltaDto updatePerson -> incidents.get(command.getIncidentId())
                    .getPersons().get(updatePerson.getPersonId().toString()).putAll(updatePerson.getInfo());
        }
        broadcastMessage(new IncidentEventDto().setUsername("the_user").putAll(command));
    }

    private void broadcastMessage(IncidentEventDto event) {
        this.subscriptions.forEach(s -> s.sendMessage(event));
    }

    static IncidentSnapshotDto createIncident(IncidentCommandDto command, IncidentInfoDto incidentInfo) {
        return new IncidentSnapshotDto()
                .setId(command.getIncidentId())
                .setCreatedAt(command.getClientTime())
                .setUpdatedAt(command.getClientTime())
                .setInfo(incidentInfo);
    }

    public void subscribe(IncidentListener listener) {
        this.subscriptions.add(listener);
        listener.sendMessage(incidentSummaryList());
    }

    public void unsubscribe(IncidentListener listener) {
        this.subscriptions.remove(listener);
    }
}
