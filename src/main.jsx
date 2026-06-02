import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/index.jsx";
import { StrictMode } from "react";
import { UserProvider } from "./Context/UserContext.jsx";
import { ProductProvider } from "./Context/ProductContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserProvider>
      <ProductProvider>
        <RouterProvider router={router} />
      </ProductProvider>
    </UserProvider>
  </StrictMode>
);
