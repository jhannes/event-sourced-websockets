import * as React from "react";
import { IncidentDelta, IncidentSnapshot } from "../../../../shared/incidents";

export const IncidentContext = React.createContext({
  sendCommand(incidentId: string, delta: IncidentDelta) {},
  incidents: [] as IncidentSnapshot[],
});
