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
* [x] Post CommandToServer<CreateConversationDelta> to server
  * [x] Update API spec to support commands to server
  * [x] Send command from client
  * [x] Create CommandController and apply delta to conversations
* [ ] Post CommandToServer<AddMessageToConversationDelta> to server
  * [x] Add BrowserRouter
  * [x] Display ConversationMessages
  * [x] Add more interesting test data
  * [ ] Post AddMessageToConversationDelta from client
* [ ] Listen to web sockets
* [ ] Post CommandToServer<UpdateMessageInConversationDelta> to server
* [ ] Implement authentication
* [ ] Post CommandToServer<RegisterDeliveryOfConversationMessageDelta>
* [ ] Post CommandToServer<AddReactionToConversationMessageDelta>
* [ ] Post CommandToServer<UpdateReactionToConversationMessageDelta>
* [ ] Post CommandToServer<RemoveReactionToConversationMessageDelta>
