export interface Incident {
  title: string;
}

export type MessageFromServer = Incident[] | Incident;

export type MessageToServer = Incident;
