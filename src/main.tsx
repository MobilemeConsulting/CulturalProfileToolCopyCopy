import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import App from "./app/App.tsx";
import { AdminPage } from "./app/admin/AdminPage.tsx";
import { AdminAccept } from "./app/admin/AdminAccept.tsx";
import "./styles/index.css";

const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/admin", element: <AdminPage /> },
  { path: "/admin/accept", element: <AdminAccept /> },
]);

createRoot(document.getElementById("root")!).render(<RouterProvider router={router} />);
