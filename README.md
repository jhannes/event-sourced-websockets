# Event Sourced Websockets with Contract First Development

This project demonstrates how to use an OpenAPI specification to create an event sourced
interaction between a React/TypeScript frontend and a Jetty/Java backend

# Running the example

1. `npm install`
2. `mvn generate-sources`
3. `npm run dev`
4. Import the project into IntelliJ
5. Run `auth.as.gnist.OpenidConnectMockServer` (located under `src/test/java`)
6. Run `as.gnist.IncidentsServer`
7. Go to http://localhost:5173
8. Use two browser windows (or two browsers) to see real time interaction

Alternatively, you can run `mvn package jib:build` to generate a docker image
and run it with `docker run event-sourced-websockets`
(this requires OpenIdConnectMockServer to be started)
