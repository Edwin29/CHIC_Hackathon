import type { UserProfile } from "../domain/profile";
import { useWeatherSummary } from "../features/weather/model/useWeatherSummary";
import { WeatherView } from "../features/weather/ui/WeatherView";

interface WeatherPageProps {
  profile: UserProfile | null;
  onNavigateHome(): void;
  onEditProfile(): void;
}

export function WeatherPage({
  profile,
  onEditProfile,
  onNavigateHome
}: WeatherPageProps) {
  const weatherModel = useWeatherSummary({ profile });

  return (
    <WeatherView
      model={weatherModel}
      onEditProfile={onEditProfile}
      onNavigateHome={onNavigateHome}
    />
  );
}

