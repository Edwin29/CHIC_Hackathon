import type { RoutePlaceholder } from "../../../fixtures/route-placeholders";

interface PlaceholderRouteListProps {
  routes: RoutePlaceholder[];
}

export function PlaceholderRouteList({ routes }: PlaceholderRouteListProps) {
  return (
    <nav className="route-list" aria-label="MVP route placeholders">
      {routes.map((route) => (
        <a
          className="route-item"
          href={route.path}
          key={route.path}
          onClick={(event) => {
            if (route.path === "/onboarding" || route.path === "/home") {
              return;
            }

            event.preventDefault();
          }}
        >
          <span>{route.label}</span>
          <small>
            {route.path} · {route.packet}
          </small>
        </a>
      ))}
    </nav>
  );
}
