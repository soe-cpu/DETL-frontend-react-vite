import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import SignInPage from "./pages/auth/SignInPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PrivateRoute from "./components/routes/PrivateRoute";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<PrivateRoute />}>
          <Route element={<MainLayout />}>
            <Route index element={<HomePage />} />
          </Route>
        </Route>
        <Route path=":sign-in" element={<SignInPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
