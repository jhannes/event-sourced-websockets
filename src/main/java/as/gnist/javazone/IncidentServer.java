package as.gnist.javazone;

import org.eclipse.jetty.server.Server;

public class IncidentServer {

    private final Server server = new Server(8080);

    public static void main(String[] args) throws Exception {
        new IncidentServer().start();
    }

    private void start() throws Exception {
        server.start();
    }
}
