package com.soprasteria.eventsource;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.eclipse.jetty.http.CompressedContentFormat;
import org.eclipse.jetty.http.HttpContent;
import org.eclipse.jetty.http.MimeTypes;
import org.eclipse.jetty.server.CachedContentFactory;
import org.eclipse.jetty.server.ResourceService;
import org.eclipse.jetty.util.URIUtil;
import org.eclipse.jetty.util.resource.Resource;
import org.eclipse.jetty.util.resource.ResourceCollection;
import org.eclipse.jetty.util.resource.ResourceFactory;

import java.io.IOException;
import java.nio.file.Path;

public class ContentServlet extends HttpServlet {

    private final ResourceService resourceService;

    public ContentServlet(HttpContent.ContentFactory contentFactory) {
        this.resourceService = new ResourceService();
        resourceService.setContentFactory(contentFactory);
        resourceService.setDirAllowed(false);
        resourceService.setWelcomeFactory(pathInContext -> URIUtil.addPaths(pathInContext, "index.html"));
    }

    public ContentServlet(ResourceFactory resourceFactory, boolean useFileMappedBuffer) {
        this(new CachedContentFactory(null, resourceFactory, new MimeTypes(), useFileMappedBuffer, false, new CompressedContentFormat[0]));
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        if (!resourceService.doGet(request, response)) {
            response.sendError(404);
        }
    }

    public static HttpServlet create(String path) {
        var sourceResource = Resource.newResource(Path.of("src", "main", "resources", path));
        if (sourceResource.exists()) {
            return new ContentServlet(new ResourceCollection(sourceResource, Resource.newClassPathResource(path)), false);
        } else {
            return new ContentServlet(Resource.newClassPathResource(path), true);
        }
    }
}
