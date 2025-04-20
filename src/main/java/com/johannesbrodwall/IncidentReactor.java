package com.johannesbrodwall;

import com.johannesbrodwall.incidents.model.AddPersonToIncidentDeltaDto;
import com.johannesbrodwall.incidents.model.CreateIncidentDeltaDto;
import com.johannesbrodwall.incidents.model.IncidentCommandDto;
import com.johannesbrodwall.incidents.model.IncidentEventDto;
import com.johannesbrodwall.incidents.model.IncidentInfoDto;
import com.johannesbrodwall.incidents.model.IncidentSnapshotDto;
import com.johannesbrodwall.incidents.model.IncidentSummaryDto;
import com.johannesbrodwall.incidents.model.IncidentSummaryListDto;
import com.johannesbrodwall.incidents.model.IncidentSummarySubscribeRequestDto;
import com.johannesbrodwall.incidents.model.UpdateIncidentDeltaDto;
import com.johannesbrodwall.incidents.model.UpdatePersonInIncidentDeltaDto;

import java.security.Principal;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

public class IncidentReactor {
    private final long lowestSequenceId = System.currentTimeMillis();
    private final AtomicLong sequenceId = new AtomicLong(lowestSequenceId);
    private final Map<UUID, IncidentSnapshotDto> incidents = new ConcurrentHashMap<>();
    private final Set<IncidentListener> subscriptions = Collections.synchronizedSet(new HashSet<>());

    public IncidentSnapshotDto snapshot(UUID incidentId) {
        return incidents.get(incidentId);
    }

    public void processCommand(IncidentCommandDto command, Principal userPrincipal) {
        var eventSequence = nextSequenceId();
        switch (command.getDelta()) {
            case CreateIncidentDeltaDto create -> putIncident(createIncident(command, create.getInfo())
                    .setLastSequenceId(eventSequence));
            case UpdateIncidentDeltaDto update -> incidents.get(command.getIncidentId())
                    .setUpdatedAt(command.getClientTime())
                    .setLastSequenceId(eventSequence)
                    .getInfo().putAll(update.getInfo());
            case AddPersonToIncidentDeltaDto addPerson -> incidents.get(command.getIncidentId())
                    .setLastSequenceId(eventSequence)
                    .getPersons().put(addPerson.getPersonId().toString(), addPerson.getInfo());
            case UpdatePersonInIncidentDeltaDto updatePerson -> incidents.get(command.getIncidentId())
                    .setLastSequenceId(eventSequence)
                    .getPersons().get(updatePerson.getPersonId().toString()).putAll(updatePerson.getInfo());
        }
        var event = new IncidentEventDto().setUsername(userPrincipal.getName()).setSequenceId(eventSequence).putAll(command);
        broadcastMessage(event);
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
                .setInfo(incidentInfo);
    }

    public void subscribe(IncidentListener listener, IncidentSummarySubscribeRequestDto subscribe) {
        this.subscriptions.add(listener);

        var requestedSequenceId = subscribe.getLastSequenceId();
        var lastSequenceId = incidents.values().stream().mapToLong(IncidentSnapshotDto::getLastSequenceId).max().orElse(lowestSequenceId);
        if (requestedSequenceId != null && (requestedSequenceId < lowestSequenceId || requestedSequenceId > lastSequenceId)) {
            requestedSequenceId = null;
        }

        listener.sendMessage(new IncidentSummaryListDto()
                .setReplaceList(requestedSequenceId == null)
                .setSummaries(getSummaries(requestedSequenceId))
                .setLastSequenceId(lastSequenceId));
    }

    public void unsubscribe(IncidentListener listener) {
        this.subscriptions.remove(listener);
    }

    private List<IncidentSummaryDto> getSummaries(Long requestedSequenceId) {
        return incidents.values().stream()
                .filter(s -> requestedSequenceId == null || requestedSequenceId < s.getLastSequenceId())
                .map(s -> new IncidentSummaryDto().putAll(s))
                .toList();
    }

    private long nextSequenceId() {
        return sequenceId.incrementAndGet();
    }
}
