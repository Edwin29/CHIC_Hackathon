import { useEffect, useState } from "react";

export type AppRoute =
  | "/"
  | "/onboarding"
  | "/home"
  | "/weather"
  | "/policies"
  | "/field-programs"
  | "/contract-check"
  | "/profile";

export function useRoute() {
  const [route, setRoute] = useState<AppRoute>(getCurrentRoute);

  useEffect(() => {
    const handlePopState = () => setRoute(getCurrentRoute());

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  return {
    route,
    navigate(nextRoute: AppRoute) {
      window.history.pushState(null, "", nextRoute);
      setRoute(nextRoute);
    }
  };
}

function getCurrentRoute(): AppRoute {
  const route = window.location.pathname as AppRoute;

  if (isAppRoute(route)) {
    return route;
  }

  return "/";
}

function isAppRoute(route: string): route is AppRoute {
  return [
    "/",
    "/onboarding",
    "/home",
    "/weather",
    "/policies",
    "/field-programs",
    "/contract-check",
    "/profile"
  ].includes(route);
}

