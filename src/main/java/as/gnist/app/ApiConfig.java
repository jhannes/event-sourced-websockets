package as.gnist.app;

import as.gnist.auth.LoginController;
import as.gnist.auth.OpenIdClientConfiguration;
import org.glassfish.hk2.utilities.binding.AbstractBinder;
import org.glassfish.jersey.server.ResourceConfig;

import java.util.Map;

public class ApiConfig extends ResourceConfig {
    public ApiConfig(OpenIdClientConfiguration environment) {
        super(LoginController.class);
        setProperties(Map.of(
                "jersey.config.server.wadl.disableWadl", true,
                "jersey.config.disableDefaultProvider", "DATASOURCE"
        ));
        register(new AbstractBinder() {
            @Override
            protected void configure() {
                bind(environment).to(OpenIdClientConfiguration.class);
            }
        });
    }
}
