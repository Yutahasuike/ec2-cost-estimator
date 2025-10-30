import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// In Amplify Hosting, amplify_outputs.json is served at the web root.
// We don't need to configure Amplify explicitly for this simple demo,
// because the frontend calls the API using the endpoint provided in that file.
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
