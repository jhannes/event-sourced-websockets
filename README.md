# Real time applications with Websockets: (JavaScript edition)

Your users expect and deserve applications that update automatically in real time without refreshing or polling. This application is a demonstration of how to use Websockets to get this effect.

## Talk overview:

- Motivation
  - [New digital tool will revolutionize search operations: - This will save many lives](https://www.aftenposten.no/norge/i/Jbwj6R/nytt-digitalt-verktoey-skal-revolusjonere-leteaksjoner-dette-vil-redde-mange-liv)
    in many contexts, getting real time (and offline) information is critical to user success
  - Demonstration: A simple web application for collaborating on emergency calls
- Code demonstration:

  - We start by showing a simplified version of the demo with frontend only state for adding and listing incidents

    - We move the incident state to the server and return it using a websocket

      - On the client: `new WebSocket(url).onmessage = (event) => setIncidents(JSON.parse(event.data))`
      - On the server: `npm install ws` and implement sending data:

        ```typescript
        const app = express();
        const server = app.listen(3000);

        const wsServer = new WebSocketServer({ noServer: true });
        server.on("upgrade", (req, socket, head) => {
          wsServer.handleUpgrade(req, socket, head, (socket) => {
            socket.send(JSON.stringify(incidents));
          });
        });
        ```

    - We move the logic for new incidents to the server

      - On the client:

        ```tsx
        const [incidents, setIncidents] = useState<Incident[]>([]);
        const [websocket, setWebsocket] = useState<WebSocket>();

        function handleMessage(message: MessageFromServer) {
          if (Array.isArray(message)) {
            setIncidents(message);
          } else {
            const incident = message;
            setIncidents((old) => [...old, incident]);
          }
        }

        useEffect(() => {
          const ws = new WebSocket("/ws/incidents");
          ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            handleMessage(message);
          };
          setWebsocket(ws);
        }, []);

        function sendMessage(incident: MessageToServer) {
          websocket?.send(JSON.stringify(incident));
        }

        function handleNewIncident(incident: Incident) {
          sendMessage(incident);
        }
        ```

      - On the server
        ```typescript
        const peers = new Set<WebSocket>();
        const wsServer = new WebSocketServer({ noServer: true });
        server.on("upgrade", (req, socket, head) => {
          wsServer.handleUpgrade(req, socket, head, (socket) => {
            peers.add(socket);
            socket.send(JSON.stringify(allIncidents));
            socket.onmessage = (event) => {
              const message = JSON.parse(event.data.toString());
              for (const peer of peers) {
                peer.send(JSON.stringify(message));
              }
            };
          });
        });
        ```

    - But we have to create a domain language for the messages between the client and the server

      - The contract

        ```typescript
        export const IncidentPriorityValues = [
          "HIGH",
          "MEDIUM",
          "LOW",
        ] as const;
        export type IncidentPriorityEnum =
          (typeof IncidentPriorityValues)[number];

        export interface Incident {
          summary: string;
          priority?: IncidentPriorityEnum;
        }

        export type MessageToServer = IncidentCommand;

        export type MessageFromServer = IncidentSnapshot[] | IncidentEvent;

        export interface IncidentSnapshot {
          updatedAt: Date;
          incidentId: string;
          incident: Incident;
        }

        export interface IncidentCommand {
          eventId: string;
          clientTime: Date;
          incidentId: string;
          delta: IncidentDelta;
        }

        export interface IncidentEvent extends IncidentCommand {
          serverTime: Date;
          username: string;
          sequenceId: number;
        }

        export type IncidentDelta =
          | { type: "CreateIncident"; incident: Incident }
          | { type: "UpdateIncident"; incident: Partial<Incident> };
        ```

      - handling is easier with TypeScript `never`
        ```tsx
        function handleMessage(message: MessageFromServer) {
          if (Array.isArray(message)) {
            setIncidents(message);
          } else {
            const { delta, clientTime: updatedAt, incidentId } = message;
            if (delta.type === "CreateIncident") {
              // ...
            } else if (delta.type === "UpdateIncident") {
              // ...
            } else {
              const unhandled: never = delta;
              console.warn({ unhandled });
            }
          }
        }
        ```

  - Next steps:
    - Saving state of the server (and database)
    - Increasing the contract
    - Offline with IndexedDb
  - Conclusion
    - Websockets is a proven way to create real-time applications
    - Exchanging messages between a client and a server is easy, but you have to model messages in a meaningful way
    - I use the domain language of `command`, `event`, `delta` and `snapshot` to structure the communication between the client and server
    - Implementing the application logic boils down to creating domain events and responding to these events. Normally you will expect some amount of duplication between the client and the server
