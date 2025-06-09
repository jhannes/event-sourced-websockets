# Real time applications with Websockets: (JavaScript edition)

Your users expect and deserve applications that update automatically in real time without refreshing or polling. This application is a demonstration of how to use Websockets to get this effect.

## Why - a demonstration application

This application is a simplified version of an incident management application that would be a part of the process for example to public safety answering points. In this setting, several responders many be observing the same incident and it imperative that they see each other's notes without delay.

## What - websockets

There are a few ways to implement real time applications. Websockets is an approach that has worked well for me. Basic websockets is arguably at least as easy as a REST-call. The following is [typical client code](./frontend/src/hooks/useWebSocket.tsx) for connecting to a websocket:

```typescript
export function useWebSocket(
  url: string,
  onMessage: (message: MessageFromServer) => void,
) {
  const [websocket, setWebsocket] = useState<WebSocket>();
  useEffect(() => {
    const webSocket = new WebSocket(url);
    webSocket.onmessage = (event) => {
      const messageFromServer = JSON.parse(event.data);
      onMessage(messageFromServer);
    };
    setWebsocket(webSocket);
  }, []);

  function sendMessage(messageToServer: MessageToServer) {
    websocket?.send(JSON.stringify(messageToServer));
  }
  return { sendMessage };
}
```

Please note: this code lacks reconnect logic and error handling when sending messages to an offline client, but it's a start.

On the server side, we're using the `ws`-library that plugs into Express.

```typescript
const app = express();
const server = app.listen(3000);

const peers = new Set<WebSocket>();
const subscriptions: Map<WebSocket, Set<string>> = new Map();
const wsServer = new WebSocketServer({ noServer: true });

server.on("upgrade", (req, socket, head) => {
  wsServer.handleUpgrade(req, socket, head, (socket) => {
    peers.add(socket);
    const summaries = getIncidentSummaries();
    sendMessage(socket, { type: "IncidentSummaryList", summaries });
    socket.onmessage = (event) => {
      handleMessageToServer(socket, JSON.parse(event.data.toString()));
    };
    socket.onclose = () => peers.delete(socket);
  });
});
```

## How - message model

WebSockets are simply a channel for sending text between the server and the client. It's up to you to create a meaningful domain language to make these messages. For this application, I use the terms:

- `command` - a request from the client to update the domain model on the server
- `event` - information from the server that the domain model was updated
- `delta` - information about what was changed in the command or event
- `snapshot` - the current state of an entity in the domain model
- `summary` - a subset of a snapshot
- `request` - a message from the client to get specific information

I define a TypeScript [model](./shared/incidents.ts) to communicate between the client and the server (in a polyglot architecture, I define the model in JSON schema to generate the client and server definitions; in a more mature scenario, you might consider using Zod instead of just TypeScript):

```typescript
export type MessageToServer = IncidentCommand | IncidentRequest;

export type MessageFromServer =
  | IncidentEvent
  | IncidentSummaryList
  | IncidentSnapshot;

export interface IncidentCommand {
  id: string;
  incidentId: string;
  clientTime: Date;
  delta: IncidentDelta;
}

export interface IncidentEvent extends IncidentCommand {
  username: string;
  serverTime: Date;
}

export type IncidentRequest =
  | IncidentSubscribeRequest
  | IncidentUnsubscribeRequest;

export type IncidentDelta =
  | {
      delta: "CreateIncidentDelta";
      info: IncidentInfo;
    }
  | {
      delta: "UpdateIncidentDelta";
      info: Partial<IncidentInfo>;
    };

export interface IncidentSummary {
  id: string;
  updatedAt: Date;
  info: IncidentInfo;
}
```

## The reactor - handleMessageFromServer/handleMessageToServer

Implementing the logic of the application boils down to creating commands and responding to events. For example, in the case of the client, you will see [logic like this](./frontend/src/components/incidents/useIncidentsContext.tsx):

```typescript
function handleMessageFromServer(messageFromServer: MessageFromServer) {
  if ("type" in messageFromServer) {
    setIncidents(messageFromServer.summaries);
  } else if ("delta" in messageFromServer) {
    const { incidentId, clientTime: updatedAt, delta } = messageFromServer;
    if (delta.delta === "CreateIncidentDelta") {
      setIncidents((old) => [
        ...old,
        { id: incidentId, updatedAt, info: delta.info, persons: {} },
      ]);
    } else if (delta.delta === "UpdateIncidentDelta") {
      setIncidents((old) =>
        old.map((o) =>
          incidentId !== o.id
            ? o
            : { ...o, updatedAt, info: { ...o.info, ...delta.info } },
        ),
      );
      // More cases here
    } else {
      const unexpected: never = delta;
      console.log({ unexpected });
    }
  } else {
    const snapshot = messageFromServer;
    setSnapshots((old) => ({ ...old, [snapshot.id]: snapshot }));
  }
}
```

This works very well with the built-in state model of React. When we update the state created with setIncidents, the corresponding parts of the user interface are updated automatically.

You should also [implement event handling on the server](./backend/incidents.ts). In a real world application, the server logic would be supplemented with persisting the events to a database.

## Conclusion

- Websockets is a proven way to create real-time applications
- Exchanging messages between a client and a server is easy, but you have to model messages in a meaningful way
- I use the domain language of `command`, `event`, `delta` and `snapshot` to structure the communication between the client and server
- Implementing the application logic boils down to creating domain events and responding to these events. Normally you will expect some amount of duplication between the client and the server
