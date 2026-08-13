import type { AppRoute } from "../../../pages/useRoute";
import type { HomeShellModel } from "../model/home-shell";

interface HomeViewProps {
  model: HomeShellModel;
  onNavigate(route: AppRoute): void;
  onLoadDemo(): void;
  onStartOnboarding(): void;
}

export function HomeView({
  model,
  onNavigate,
  onLoadDemo,
  onStartOnboarding
}: HomeViewProps) {
  if (!model.profile) {
    return (
      <main className="app-shell">
        <section className="intro-panel" aria-labelledby="home-title">
          <p className="eyebrow">PACKET 2</p>
          <h1 id="home-title">귀농 통합서비스 MVP</h1>
          <p>저장된 프로필이 없습니다.</p>
          <div className="button-row align-start">
            <button className="primary-button" onClick={onStartOnboarding} type="button">
              온보딩 시작하기
            </button>
            <button className="secondary-button" onClick={onLoadDemo} type="button">
              김미숙 데모 불러오기
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <section className="home-hero" aria-labelledby="home-title">
        <p className="eyebrow">PACKET 2</p>
        <h1 id="home-title">안녕하세요, {model.name}님</h1>
        <p className="stage-copy">지금은 {model.stageLabel}이에요</p>
        <p className="muted">
          {model.profile.targetRegion ?? "관심 지역 미설정"} ·{" "}
          {model.profile.targetCrop ?? "관심 작목 미설정"}
        </p>
      </section>

      <section className="home-section" aria-labelledby="roadmap-title">
        <div className="section-heading">
          <h2 id="roadmap-title">귀농 준비 로드맵</h2>
          <span className="muted">사용자가 직접 선택한 현재 단계</span>
        </div>
        <ol className="roadmap-list">
          {model.roadmap.map((item) => (
            <li className={item.active ? "roadmap-item active" : "roadmap-item"} key={item.stage}>
              {item.label}
            </li>
          ))}
        </ol>
      </section>

      {model.hasMissingProfileFields && (
        <section className="profile-alert" aria-label="프로필 미완성 안내">
          <p>
            아직 답하지 않은 항목이 {model.missingFieldCount}개 있습니다. 프로필을
            채우면 이후 기능에서 같은 정보를 다시 묻지 않을 수 있습니다.
          </p>
          <button
            className="secondary-button"
            onClick={() => onNavigate("/profile")}
            type="button"
          >
            프로필 마저 설정하기
          </button>
        </section>
      )}

      <section className="home-section" aria-labelledby="actions-title">
        <div className="section-heading">
          <h2 id="actions-title">기능 바로가기</h2>
        </div>
        <div className="action-grid">
          {model.actions.map((action) => (
            <button
              className={action.primary ? "action-card primary-action" : "action-card"}
              key={action.id}
              onClick={() => onNavigate(action.route)}
              type="button"
            >
              <span>{action.label}</span>
              <small>{action.description}</small>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}

