// lib/routes.ts
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  WORKSPACE: "/workspace",
  PROFILE: "/profile",
  TEST: "/test",
  ABOUT: "/about",
  BLOG: "/blog",
  CAREERS: "/careers",
  DOCS: "/docs",
  PRICING: "/pricing",
  PRODUCT: "/product",
  RESOURCES: "/resources",
  SOLUTIONS: "/solutions",
  CANVAS: "/workspace/:projectId",
} as const;

export const getRoute = (route: keyof typeof ROUTES) => ROUTES[route];
