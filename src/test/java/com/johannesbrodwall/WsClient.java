package com.johannesbrodwall;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.websocket.ClientEndpointConfig;
import jakarta.websocket.ContainerProvider;
import jakarta.websocket.DeploymentException;
import jakarta.websocket.Endpoint;
import jakarta.websocket.EndpointConfig;
import jakarta.websocket.Session;
import lombok.SneakyThrows;
import org.eclipse.jetty.util.BlockingArrayQueue;
import org.openapitools.client.model.MessageToServerDto;

import java.io.Closeable;
import java.io.IOException;
import java.net.URI;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;

class WsClient<T> extends Endpoint implements Closeable {
    private final ObjectMapper mapper;
    private final BlockingArrayQueue<String> buffer = new BlockingArrayQueue<>(1000);
    private final Class<T> valueType;
    private final Session session;

    @SneakyThrows(DeploymentException.class)
    public WsClient(Class<T> valueType, ApplicationObjectMapper mapper, URI uri) throws IOException {
        this.valueType = valueType;
        this.mapper = mapper;
        this.session = ContainerProvider.getWebSocketContainer()
                .connectToServer(this, ClientEndpointConfig.Builder.create().build(), uri);
    }

    @Override
    public void onOpen(Session session, EndpointConfig config) {
        session.addMessageHandler(String.class, this::addMessage);
    }

    private void addMessage(String message) {
        buffer.add(message);
    }

    @SuppressWarnings("unchecked")
    @SneakyThrows
    public <U extends T> U poll(long time, TimeUnit timeUnit) {
        var message = buffer.poll(time, timeUnit);
        if (message == null) throw new TimeoutException("No message received for " + time + " " + timeUnit);
        return (U)mapper.readValue(message, valueType);
    }

    public <U extends T> U pollNext() {
        return poll(1, TimeUnit.SECONDS);
    }

    @Override
    public void close() throws IOException {
        session.close();
    }

    @SneakyThrows
    public <U extends T> U request(MessageToServerDto message) {
        buffer.clear();
        session.getAsyncRemote().sendText(mapper.writeValueAsString(message));
        return pollNext();
    }
}
