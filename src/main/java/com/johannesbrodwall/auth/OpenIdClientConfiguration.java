package com.johannesbrodwall.auth;

import java.net.URI;

public interface OpenIdClientConfiguration {
    URI getDiscoveryUri();
    String getClientId();
    String getClientSecret();
}
