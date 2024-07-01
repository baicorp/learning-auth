import React from "react";
import ReactDOM from "react-dom/client";
import { App, SignIn, SignUp } from "./page";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";

const route = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/Sign-up",
    element: <SignUp />,
  },
  {
    path: "/sign-in",
    element: <SignIn />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={route} />
    <Toaster visibleToasts={1} />
  </React.StrictMode>
);
