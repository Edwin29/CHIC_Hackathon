import type { AppRoute } from "./useRoute";
import { routePlaceholders } from "../fixtures/route-placeholders";

interface FeaturePlaceholderPageProps {
  route: AppRoute;
  onNavigateHome(): void;
  onStartOnboarding(): void;
}

export function FeaturePlaceholderPage({
  route,
  onNavigateHome,
  onStartOnboarding
}: FeaturePlaceholderPageProps) {
  const routeInfo = routePlaceholders.find((item) => item.path === route);

  if (route === "/profile") {
    return (
      <main className="app-shell">
        <section className="intro-panel" aria-labelledby="placeholder-title">
          <p className="eyebrow">PACKET 2</p>
          <h1 id="placeholder-title">프로필 마저 설정하기</h1>
          <p className="muted">
            프로필 수정 화면은 현재 route placeholder입니다. 지금은 온보딩을 다시
            실행해 프로필을 갱신할 수 있습니다.
          </p>
          <div className="button-row align-start">
            <button className="primary-button" onClick={onStartOnboarding} type="button">
              온보딩 다시 시작
            </button>
            <button className="secondary-button" onClick={onNavigateHome} type="button">
              홈으로
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <section className="intro-panel" aria-labelledby="placeholder-title">
        <p className="eyebrow">{routeInfo?.packet ?? "PACKET TBD"}</p>
        <h1 id="placeholder-title">{routeInfo?.label ?? "기능 준비 중"}</h1>
        <p className="muted">
          현재 단계에서는 기능 실행 대신 route 이동만 확인합니다. 실제 데이터와
          fixture 화면은 문서의 다음 패킷 순서에 맞춰 구현합니다.
        </p>
        <button className="secondary-button" onClick={onNavigateHome} type="button">
          홈으로
        </button>
      </section>
    </main>
  );
}

