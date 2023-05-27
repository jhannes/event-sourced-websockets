import React from "react";

export function ErrorView({ error }: { error: Error }) {
  return <div>Error: {error.toString()}</div>;
}