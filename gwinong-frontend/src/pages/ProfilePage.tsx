import type { UserProfile } from "../domain/profile";
import { getProfileEducationSuggestions } from "../features/profile/model/profile-completion";

interface ProfilePageProps {
  profile: UserProfile | null;
  onNavigateHome(): void;
  onStartOnboarding(): void;
}

export function ProfilePage({
  profile,
  onNavigateHome,
  onStartOnboarding
}: ProfilePageProps) {
  const suggestions = getProfileEducationSuggestions(profile);

  return (
    <main className="app-shell">
      <section className="home-hero">
        <p className="eyebrow">fixture</p>
        <h1>프로필 마저 설정하기</h1>
        <p className="muted">
          모르겠어요로 남긴 항목을 바탕으로 공식 정보 확인 예시를 보여줍니다.
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

      <section className="flow-panel">
        {profile ? (
          <>
            <p>
              {profile.name}님 프로필의 미확정 항목:{" "}
              {profile.unknownFields.length ? profile.unknownFields.join(", ") : "없음"}
            </p>
            {suggestions.length > 0 ? (
              <div className="result-list">
                {suggestions.map((suggestion) => (
                  <article className="result-row" key={suggestion.id}>
                    <span>{suggestion.title}</span>
                    <a className="text-link" href={suggestion.sourceUrl} rel="noreferrer" target="_blank">
                      공식 정보 보기
                    </a>
                  </article>
                ))}
              </div>
            ) : (
              <p className="muted">현재 추가 추천이 필요한 미확정 항목은 없습니다.</p>
            )}
          </>
        ) : (
          <p>저장된 프로필이 없습니다.</p>
        )}
      </section>
    </main>
  );
}

