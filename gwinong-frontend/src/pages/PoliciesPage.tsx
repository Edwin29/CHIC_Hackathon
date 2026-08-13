import type { UserProfile } from "../domain/profile";
import { getPolicyMatches } from "../features/policies/model/policy-model";

interface PoliciesPageProps {
  profile: UserProfile | null;
  onNavigateHome(): void;
}

export function PoliciesPage({ profile, onNavigateHome }: PoliciesPageProps) {
  const policies = getPolicyMatches(profile);

  return (
    <main className="app-shell">
      <section className="home-hero">
        <p className="eyebrow">fixture</p>
        <h1>정부 지원 매칭 확인하기</h1>
        <p className="muted">현재 프로필 기준 추천 예시</p>
        <p className="muted">최종 자격은 공식 공고에서 확인</p>
        <button className="secondary-button" onClick={onNavigateHome} type="button">
          홈으로
        </button>
      </section>

      <section className="action-grid">
        {policies.map((policy) => (
          <article className="info-card" key={policy.id}>
            <p className="eyebrow">{policy.organization} · {policy.dataMode}</p>
            <h2>{policy.title}</h2>
            <p>{policy.summary}</p>
            <p className="muted">{policy.targetText}</p>
            <p className="match-reason">{policy.demoMatchReason}</p>
            <a className="text-link" href={policy.sourceUrl} rel="noreferrer" target="_blank">
              공식 페이지 열기
            </a>
          </article>
        ))}
      </section>
    </main>
  );
}

