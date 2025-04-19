package com.johannesbrodwall;

import lombok.SneakyThrows;
import org.eclipse.jetty.ee10.servlet.ServletContextHandler;
import org.eclipse.jetty.ee10.servlet.ServletHolder;
import org.eclipse.jetty.server.CustomRequestLog;
import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.server.handler.ContextHandler;
import org.eclipse.jetty.server.handler.ContextHandlerCollection;
import org.eclipse.jetty.server.handler.ResourceHandler;
import org.eclipse.jetty.util.resource.ResourceFactory;

public class EventSourcingServer {

    private final Server server = new Server(9080);
    private final ResourceFactory resourceFactory = ResourceFactory.of(server);

    @SneakyThrows
    EventSourcingServer() {
        server.setHandler(new ContextHandlerCollection(
                getServletContextHandler(),
                new ContextHandler(swaggerUi(), "/api-doc/swagger-ui"),
                new ContextHandler(apiDoc(), "/api-doc"),
                new ContextHandler(reactApplication(), "/")
        ));
        server.setRequestLog(new CustomRequestLog());
    }

    private ContentResourceHandler reactApplication() {
        return new ContentResourceHandler(resourceFactory.newClassLoaderResource("webapp", false));
    }

    private ResourceHandler apiDoc() {
        return new ContentResourceHandler(ContentResourceHandler.getProjectResource("webapp/api-doc", resourceFactory));
    }

    private ResourceHandler swaggerUi() {
        return ContentResourceHandler.getWebJarResource("swagger-ui", resourceFactory);
    }

    private static ServletContextHandler getServletContextHandler() {
        var handler = new ServletContextHandler();
        handler.getServletHandler().setEnsureDefaultServlet(false);
        handler.addServlet(new ServletHolder(new HelloWorldServlet()), "/api/hello");
        return handler;
    }

    private void start() throws Exception {
        server.start();
    }

    public static void main(String[] args) throws Exception {
        new EventSourcingServer().start();
    }

}
