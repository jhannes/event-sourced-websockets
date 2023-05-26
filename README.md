TODO:

* [x] Show web page
* [x] Add logging
* [x] Create docker image with web page (mvn install)
  * [x] Instant reload web page
* [x] React
  * [x] parcel
  * [x] react
  * [x] typescript
  * [x] prettier
  * [x] frontend-maven-plugin
* [ ] Open API display List<ConversationSnapshot> from server
  * [x] Serve openapi spec with swagger-ui
  * [x] Generate code from openapi
  * [x] Create ConversationController
  * [x] Show conversations in React
* [ ] Post CommandToServer<CreateConversationDelta> to server
  * [x] Update API spec to support commands to server
  * [x] Send command from client
  * [ ] Create CommandController and apply delta to conversations
* [ ] Post CommandToServer<AddMessageToConvesationDelta> to server
* [ ] Listen to web sockets
