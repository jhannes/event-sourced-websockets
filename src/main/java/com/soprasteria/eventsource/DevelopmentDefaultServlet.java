package com.soprasteria.eventsource;

import org.eclipse.jetty.servlet.DefaultServlet;
import org.eclipse.jetty.util.resource.Resource;
import org.eclipse.jetty.util.resource.ResourceCollection;
import org.eclipse.jetty.util.resource.ResourceFactory;

import java.io.IOException;
import java.nio.file.Path;

public class DevelopmentDefaultServlet extends DefaultServlet {

    private final ResourceFactory resourceFactory;

    public DevelopmentDefaultServlet(ResourceFactory resourceFactory) {
        this.resourceFactory = resourceFactory;
    }

    public static DefaultServlet create(String path) {
        var sourceResource = Resource.newResource(Path.of("srcs", "main", "resources", path));
        if (sourceResource.exists()) {
            return new DevelopmentDefaultServlet(new ResourceCollection(sourceResource, Resource.newClassPathResource(path)));
        } else {
            return new DevelopmentDefaultServlet(Resource.newClassPathResource(path));
        }
    }

    @Override
    public Resource getResource(String pathInContext) {
        try {
            return resourceFactory.getResource(pathInContext);
        } catch (IOException e) {
            return null;
        }

    }
}
