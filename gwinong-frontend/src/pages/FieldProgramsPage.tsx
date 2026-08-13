import type { UserProfile } from "../domain/profile";
import { getFieldProgramMatches } from "../features/field-programs/model/field-program-model";

interface FieldProgramsPageProps {
  profile: UserProfile | null;
  onNavigateHome(): void;
}

export function FieldProgramsPage({
  profile,
  onNavigateHome
}: FieldProgramsPageProps) {
  const programs = getFieldProgramMatches(profile);

  return (
    <main className="app-shell">
      <section className="home-hero">
        <p className="eyebrow">fixture</p>
        <h1>현장체험 연결</h1>
        <p className="muted">공식 페이지 연결만 제공합니다. 자동예약이나 직접 연락처 중개는 하지 않습니다.</p>
        <button className="secondary-button" onClick={onNavigateHome} type="button">
          홈으로
        </button>
      </section>

      <section className="action-grid">
        {programs.map((program) => (
          <article className="info-card" key={program.id}>
            <p className="eyebrow">{program.organization} · {program.dataMode}</p>
            <h2>{program.title}</h2>
            <p>{program.summary}</p>
            <p className="muted">
              지역 {program.regionTags.join(", ")} · 작목 {program.cropTags.join(", ")}
            </p>
            <a className="text-link" href={program.sourceUrl} rel="noreferrer" target="_blank">
              공식 페이지 열기
            </a>
          </article>
        ))}
      </section>
    </main>
  );
}

