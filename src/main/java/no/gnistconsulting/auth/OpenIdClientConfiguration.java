package no.gnistconsulting.auth;

import java.net.URI;

public interface OpenIdClientConfiguration {
    URI getDiscoveryUri();
    String getClientId();
    String getClientSecret();
}
