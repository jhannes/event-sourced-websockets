package as.gnist.javazone.infrastructure;

import lombok.SneakyThrows;
import org.eclipse.jetty.http.HttpMethod;
import org.eclipse.jetty.server.Request;
import org.eclipse.jetty.server.Response;
import org.eclipse.jetty.server.handler.ResourceHandler;
import org.eclipse.jetty.util.Callback;
import org.eclipse.jetty.util.resource.Resource;
import org.eclipse.jetty.util.resource.ResourceFactory;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Properties;

public class ContentResourceHandler extends ResourceHandler {
    public ContentResourceHandler(Resource baseResource) {
        setBaseResource(baseResource);
    }

    public static ResourceHandler newResourceHandler(Resource baseResource) {
        var contentHandler = new ResourceHandler();
        contentHandler.setBaseResource(baseResource);
        return contentHandler;
    }

    @SneakyThrows
    public static ResourceHandler getWebJarResource(String webjar, ResourceFactory resourceFactory) {
        var properties = new Properties();
        try (var stream = ContentResourceHandler.class.getClassLoader().getResourceAsStream("META-INF/maven/org.webjars/" + webjar + "/pom.properties")) {
            if (stream == null) {
                throw new IllegalArgumentException(webjar + " not found");
            }
            properties.load(stream);
            var version = properties.getProperty("version");
            return ContentResourceHandler.newResourceHandler(resourceFactory.newClassLoaderResource("/META-INF/resources/webjars/" + webjar + "/" + version));
        }
    }

    @SneakyThrows
    public static Resource getProjectResource(String name, ResourceFactory resourceFactory) {
        var targetDir = Path.of("target", "classes").resolve(name);
        var url = ContentResourceHandler.class.getClassLoader().getResource(name);
        if (url == null) {
            throw new IllegalArgumentException("Not found in classpath: " + name);
        } else if (url.getProtocol().equals("file")) {
            var path = Paths.get(url.toURI());
            if (path.endsWith(targetDir)) {
                var projectDir = path;
                for (int i = 0; i < targetDir.getNameCount(); i++) {
                    projectDir = projectDir.getParent();
                }
                path = projectDir
                        .resolve(Path.of("src", "main", "resources"))
                        .resolve(name);
                if (Files.isDirectory(path)) {
                    return resourceFactory.newResource(path);
                }
            }
        }
        return resourceFactory.newResource(url);
    }

    @Override
    public boolean handle(Request request, Response response, Callback callback) throws Exception {
        if (!HttpMethod.GET.is(request.getMethod()) && !HttpMethod.HEAD.is(request.getMethod())) {
            // try another handler
            return super.handle(request, response, callback);
        }

        var content = this.getResourceService().getContent(Request.getPathInContext(request), request);
        if (content == null) {
            content = this.getResourceService().getContent("/index.html", request);
        }
        if (content == null) {
            return super.handle(request, response, callback);
        }

        this.getResourceService().doGet(request, response, callback, content);
        return true;
    }
}