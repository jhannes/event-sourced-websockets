package as.gnist.javazone;

import org.eclipse.jetty.ee10.servlet.ServletHolder;
import org.eclipse.jetty.ee10.webapp.WebAppContext;
import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.util.resource.ResourceFactory;

public class IncidentServer {

    private final Server server = new Server(8080);

    public static void main(String[] args) throws Exception {
        new IncidentServer().start();
    }

    private void start() throws Exception {
        var handler = new WebAppContext();
        handler.setBaseResource(ResourceFactory.of(handler).newClassLoaderResource("/web"));
        handler.addServlet(new ServletHolder(new IncidentApiServlet()), "/api/incidents/*");
        server.setHandler(handler);
        server.start();
    }
}
