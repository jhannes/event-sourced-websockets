package com.johannesbrodwall;

import com.johannesbrodwall.auth.OpenIdClientConfiguration;
import lombok.Data;
import lombok.experimental.Accessors;

import java.net.URI;

@Data
@Accessors(chain = true)
public class ApplicationEnvironment implements OpenIdClientConfiguration {

    private URI discoveryUri = URI.create("http://localhost:20080/.well-known/openid-configuration");

    @Override
    public String getClientId() {
        return "incident-server";
    }

    @Override
    public String getClientSecret() {
        return "";
    }
}
