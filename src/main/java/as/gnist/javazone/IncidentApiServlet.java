package as.gnist.javazone;

import as.gnist.javazone.incident.generated.model.IncidentDto;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.List;

public class IncidentApiServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json");

        new ObjectMapper().writeValue(
                resp.getWriter(),
                List.of(new IncidentDto().setSummary("Fire from the server"))
        );
    }
}
