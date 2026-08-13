import { createHomeShellModel } from "../features/home/model/home-shell";
import { HomeView } from "../features/home/ui/HomeView";
import { OnboardingView } from "../features/onboarding/ui/OnboardingView";
import { useOnboarding } from "../features/onboarding/model/useOnboarding";
import { localProfileStore } from "../stores/profile-store";
import { ContractCheckPage } from "./ContractCheckPage";
import { FeaturePlaceholderPage } from "./FeaturePlaceholderPage";
import { FieldProgramsPage } from "./FieldProgramsPage";
import { PoliciesPage } from "./PoliciesPage";
import { ProfilePage } from "./ProfilePage";
import { WeatherPage } from "./WeatherPage";
import { useRoute } from "./useRoute";

export function App() {
  const { route, navigate } = useRoute();
  const onboarding = useOnboarding();
  const profile = localProfileStore.load();
  const homeModel = createHomeShellModel(profile);

  if (route === "/onboarding" || (route === "/" && !profile)) {
    return <OnboardingView controller={onboarding} onComplete={() => navigate("/home")} />;
  }

  if (route === "/weather") {
    return (
      <WeatherPage
        onEditProfile={() => navigate("/profile")}
        onNavigateHome={() => navigate("/home")}
        profile={profile}
      />
    );
  }

  if (route === "/policies") {
    return <PoliciesPage profile={profile} onNavigateHome={() => navigate("/home")} />;
  }

  if (route === "/field-programs") {
    return (
      <FieldProgramsPage profile={profile} onNavigateHome={() => navigate("/home")} />
    );
  }

  if (route === "/contract-check") {
    return <ContractCheckPage onNavigateHome={() => navigate("/home")} />;
  }

  if (route === "/profile") {
    return (
      <ProfilePage
        onNavigateHome={() => navigate("/home")}
        onStartOnboarding={() => navigate("/onboarding")}
        profile={profile}
      />
    );
  }

  if (route !== "/" && route !== "/home") {
    return (
      <FeaturePlaceholderPage
        onNavigateHome={() => navigate("/home")}
        onStartOnboarding={() => navigate("/onboarding")}
        route={route}
      />
    );
  }

  return (
    <HomeView
      model={homeModel}
      onLoadDemo={() => {
        onboarding.loadDemoProfile();
        navigate("/home");
      }}
      onNavigate={navigate}
      onStartOnboarding={() => navigate("/onboarding")}
    />
  );
}
