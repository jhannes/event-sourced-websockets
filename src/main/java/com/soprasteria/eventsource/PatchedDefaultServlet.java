package com.soprasteria.eventsource;

import org.eclipse.jetty.servlet.DefaultServlet;
import org.eclipse.jetty.util.resource.Resource;
import org.eclipse.jetty.util.resource.ResourceCollection;
import org.eclipse.jetty.util.resource.ResourceFactory;

import java.io.IOException;
import java.nio.file.Path;

public class PatchedDefaultServlet extends DefaultServlet {

    private final ResourceFactory resourceFactory;

    public PatchedDefaultServlet(String path) {
        var sourceResource = Resource.newResource(Path.of("src", "main", "resources", path));

        if (sourceResource.exists()) {
            this.resourceFactory = new ResourceCollection(sourceResource, Resource.newClassPathResource(path));
        } else {
            this.resourceFactory = Resource.newClassPathResource(path);
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
