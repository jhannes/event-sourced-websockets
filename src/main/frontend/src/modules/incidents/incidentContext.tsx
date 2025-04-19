import React from "react";
import { MessageToServerDto } from "../../../../../../target/generated-sources/openapi-typescript";

export const IncidentContext = React.createContext({
  sendMessage: (message: MessageToServerDto) => {},
  isConnected: false,
});
