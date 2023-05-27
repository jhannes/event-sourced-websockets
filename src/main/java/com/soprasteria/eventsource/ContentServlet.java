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
import java.util.Properties;

public class ContentServlet extends HttpServlet {

    private final ResourceService resourceService;

    public ContentServlet(HttpContent.ContentFactory contentFactory) {
        this.resourceService = new ResourceService();
        resourceService.setContentFactory(contentFactory);
        resourceService.setDirAllowed(false);
        resourceService.setPathInfoOnly(true);
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

    public static HttpServlet webjar(String artifactId) {
        try {
            return new ContentServlet(getWebjarResource(artifactId), true);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @SuppressWarnings("resource")
    private static Resource getWebjarResource(String artifactId) throws IOException {
        var propertiesResource = Resource.newClassPathResource("META-INF/maven/org.webjars")
                                         .getResource(artifactId).getResource("/pom.properties");
        var properties = new Properties();
        try (var inputStream = propertiesResource.getInputStream()) {
            properties.load(inputStream);
        }
        return Resource.newClassPathResource("META-INF/resources/webjars")
                .getResource(artifactId).getResource(properties.getProperty("version"));
    }

    public static HttpServlet createWithDefault(String path, String defaultPath) {
        var sourceResource = Resource.newResource(Path.of("src", "main", "resources", path));
        if (sourceResource.exists()) {
            var resourceFactory = new ResourceCollection(sourceResource, Resource.newClassPathResource(path));
            return new ContentServlet(withDefault(resourceFactory, defaultPath), false);
        } else {
            var resourceFactory = Resource.newClassPathResource(path);
            return new ContentServlet(withDefault(resourceFactory, defaultPath), true);
        }
    }

    private static ResourceFactory withDefault(ResourceFactory resourceFactory, String defaultPath) {
        return path -> {
            var resource = resourceFactory.getResource(path);
            if (resource.exists()) {
                return resource;
            }
            return resourceFactory.getResource(defaultPath);
        };
    }
}
