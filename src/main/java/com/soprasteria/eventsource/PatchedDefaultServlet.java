package com.soprasteria.eventsource;

import jakarta.servlet.Servlet;
import org.eclipse.jetty.servlet.DefaultServlet;
import org.eclipse.jetty.servlet.Source;
import org.eclipse.jetty.util.resource.Resource;
import org.eclipse.jetty.util.resource.ResourceFactory;

import java.io.IOException;

public class PatchedDefaultServlet extends DefaultServlet {

    private final ResourceFactory resourceFactory;

    public PatchedDefaultServlet(String resource) {
        this.resourceFactory = Resource.newClassPathResource(resource);
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
