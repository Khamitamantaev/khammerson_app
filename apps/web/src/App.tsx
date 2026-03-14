import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ROUTES } from "./lib/routes";
import { Layout } from "./components/layout/Layout";
import { BlogPage } from "./pages/BlogPage";
import { CareersPage } from "./pages/CareersPage";
import { DocsPage } from "./pages/DocsPage";
import { PricingPage } from "./pages/PricingPage";
import { ProductPage } from "./pages/ProductPage";
import { ResourcesPage } from "./pages/ResourcesPage";
import { SolutionsPage } from "./pages/SolutionsPage";
import { WorkspacePage } from "./pages/WorkspacePage";
import { ProfilePage } from "./pages/ProfilePage";
import { ProtectedRoute } from "./components/routes/ProtectedRoute";
import { PublicOnlyRoute } from "./components/routes/PublicOnlyRoute";
import { ReactFlowProvider } from "@xyflow/react";
import { LandingPage } from "./pages/Home";
import { AboutPage } from "./pages/About";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { NotFoundPage } from "./pages/NotFoundPage";

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.HOME} element={<Layout />}>
          {/* Публичные маршруты */}
          <Route index element={<LandingPage />} />
          <Route path={ROUTES.ABOUT} element={<AboutPage />} />
          <Route path={ROUTES.BLOG} element={<BlogPage />} />
          <Route path={ROUTES.CAREERS} element={<CareersPage />} />
          <Route path={ROUTES.DOCS} element={<DocsPage />} />
          <Route path={ROUTES.PRICING} element={<PricingPage />} />
          <Route path={ROUTES.PRODUCT} element={<ProductPage />} />
          <Route path={ROUTES.RESOURCES} element={<ResourcesPage />} />
          <Route path={ROUTES.SOLUTIONS} element={<SolutionsPage />} />

          {/* Маршруты только для неавторизованных */}
          <Route
            path={ROUTES.LOGIN}
            element={
              <PublicOnlyRoute>
                <LoginPage />
              </PublicOnlyRoute>
            }
          />
          <Route
            path={ROUTES.REGISTER}
            element={
              <PublicOnlyRoute>
                <RegisterPage />
              </PublicOnlyRoute>
            }
          />

          {/* Защищенные маршруты */}
          <Route
            path={ROUTES.WORKSPACE}
            element={
              <ProtectedRoute>
                <ReactFlowProvider>
                  <WorkspacePage />
                </ReactFlowProvider>
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.PROFILE}
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* 404 - можно добавить отдельную страницу */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
