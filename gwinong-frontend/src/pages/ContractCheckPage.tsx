import { useEffect, useState } from "react";
import { contractCheckFixture } from "../fixtures/contract-check";

interface ContractCheckPageProps {
  onNavigateHome(): void;
}

export function ContractCheckPage({ onNavigateHome }: ContractCheckPageProps) {
  const [fileName, setFileName] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "analyzing" | "done">("idle");

  useEffect(() => {
    if (status !== "analyzing") {
      return;
    }

    const timeout = window.setTimeout(() => setStatus("done"), 800);
    return () => window.clearTimeout(timeout);
  }, [status]);

  return (
    <main className="app-shell">
      <section className="home-hero">
        <p className="eyebrow">fixture</p>
        <h1>거래 서면 점검</h1>
        <p className="muted">현재 데모에서는 샘플 분석 결과를 제공합니다.</p>
        <button className="secondary-button" onClick={onNavigateHome} type="button">
          홈으로
        </button>
      </section>

      <section className="flow-panel">
        <label className="file-picker">
          <span>{fileName ?? "계약서 파일 선택"}</span>
          <input
            onChange={(event) => {
              const file = event.target.files?.[0];
              setFileName(file?.name ?? null);
              setStatus(file ? "analyzing" : "idle");
            }}
            type="file"
          />
        </label>

        {status === "analyzing" && <p>분석 중입니다.</p>}

        {status === "done" && (
          <div className="result-list">
            {contractCheckFixture.map((item) => (
              <div className="result-row" key={item.id}>
                <span>{item.label}</span>
                <strong>{item.status === "ok" ? "확인" : "확인 필요"}</strong>
              </div>
            ))}
            <p className="muted">현재 데모에서는 샘플 분석 결과를 제공합니다.</p>
          </div>
        )}
      </section>
    </main>
  );
}

