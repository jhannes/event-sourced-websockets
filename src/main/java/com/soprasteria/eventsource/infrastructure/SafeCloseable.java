package com.soprasteria.eventsource.infrastructure;

public interface SafeCloseable extends AutoCloseable {
    @Override
    void close();
}
