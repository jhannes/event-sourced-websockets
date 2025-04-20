package com.johannesbrodwall;

import org.openapitools.client.model.AddPersonToIncidentDeltaDto;
import org.openapitools.client.model.CreateIncidentDeltaDto;
import org.openapitools.client.model.IncidentCommandDto;
import org.openapitools.client.model.IncidentEventDto;
import org.openapitools.client.model.IncidentInfoDto;
import org.openapitools.client.model.IncidentSnapshotDto;
import org.openapitools.client.model.IncidentSummaryDto;
import org.openapitools.client.model.IncidentSummaryListDto;
import org.openapitools.client.model.IncidentSummarySubscribeRequestDto;
import org.openapitools.client.model.UpdateIncidentDeltaDto;
import org.openapitools.client.model.UpdatePersonInIncidentDeltaDto;

import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

public class IncidentReactor {
    private final AtomicLong sequenceId = new AtomicLong(System.currentTimeMillis());
    private final Map<UUID, IncidentSnapshotDto> incidents = new ConcurrentHashMap<>();
    private final Set<IncidentListener> subscriptions = Collections.synchronizedSet(new HashSet<>());

    public IncidentSnapshotDto snapshot(UUID incidentId) {
        return incidents.get(incidentId);
    }

    public void processCommand(IncidentCommandDto command) {
        switch (command.getDelta()) {
            case CreateIncidentDeltaDto create -> putIncident(createIncident(command, create.getInfo()));
            case UpdateIncidentDeltaDto update -> incidents.get(command.getIncidentId())
                    .setUpdatedAt(command.getClientTime())
                    .setLastSequenceId(nextSequenceId())
                    .getInfo().putAll(update.getInfo());
            case AddPersonToIncidentDeltaDto addPerson -> incidents.get(command.getIncidentId())
                    .setLastSequenceId(nextSequenceId())
                    .getPersons().put(addPerson.getPersonId().toString(), addPerson.getInfo());
            case UpdatePersonInIncidentDeltaDto updatePerson -> incidents.get(command.getIncidentId())
                    .setLastSequenceId(nextSequenceId())
                    .getPersons().get(updatePerson.getPersonId().toString()).putAll(updatePerson.getInfo());
        }
        broadcastMessage(new IncidentEventDto().setUsername("the_user").putAll(command));
    }

    private void putIncident(IncidentSnapshotDto incident) {
        if (!incident.missingRequiredFields("").isEmpty()) {
            throw new IllegalArgumentException("Missing required fields " + incident.missingRequiredFields("") + " in " + incident);
        }
        this.incidents.put(incident.getId(), incident);
    }

    private void broadcastMessage(IncidentEventDto event) {
        this.subscriptions.forEach(s -> s.sendMessage(event));
    }

    private IncidentSnapshotDto createIncident(IncidentCommandDto command, IncidentInfoDto incidentInfo) {
        return new IncidentSnapshotDto()
                .setId(command.getIncidentId())
                .setCreatedAt(command.getClientTime())
                .setUpdatedAt(command.getClientTime())
                .setLastSequenceId(nextSequenceId())
                .setInfo(incidentInfo);
    }

    private long nextSequenceId() {
        return sequenceId.incrementAndGet();
    }

    public void subscribe(IncidentListener listener, IncidentSummarySubscribeRequestDto subscribe) {
        this.subscriptions.add(listener);
        var lastSequenceId = subscribe.getLastSequenceId();
        var summaries = incidents.values().stream()
                .filter(s -> lastSequenceId == null || lastSequenceId < s.getLastSequenceId())
                .map(s -> new IncidentSummaryDto().putAll(s))
                .toList();
        var message = new IncidentSummaryListDto()
                .setReplaceList(lastSequenceId == null)
                .setSummaries(summaries)
                .setLastSequenceId(incidents.values().stream().mapToLong(IncidentSnapshotDto::getLastSequenceId).max().orElse(-1));
        listener.sendMessage(message);
    }

    public void unsubscribe(IncidentListener listener) {
        this.subscriptions.remove(listener);
    }
}
