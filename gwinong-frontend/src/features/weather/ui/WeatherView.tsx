import type { WeatherForecast } from "../../../domain/weather";
import type { WeatherSummaryModel } from "../model/useWeatherSummary";

interface WeatherViewProps {
  model: WeatherSummaryModel;
  onNavigateHome(): void;
  onEditProfile(): void;
}

export function WeatherView({ model, onEditProfile, onNavigateHome }: WeatherViewProps) {
  const { summary } = model;

  return (
    <main className="app-shell">
      <section className="home-hero" aria-labelledby="weather-title">
        <p className="eyebrow">PACKET 4</p>
        <h1 id="weather-title">농장 날씨·위험</h1>
        <p className="muted">
          {model.region ?? "지역 미설정"} · {model.crop ?? "작목 미설정"}
        </p>
        <div className="button-row align-start">
          <button className="secondary-button" onClick={onNavigateHome} type="button">
            홈으로
          </button>
          <button className="secondary-button" onClick={onEditProfile} type="button">
            프로필 마저 설정하기
          </button>
          <button
            className="primary-button"
            disabled={model.status === "loading"}
            onClick={model.reload}
            type="button"
          >
            새로고침
          </button>
        </div>
      </section>

      {model.status === "loading" && (
        <section className="flow-panel">
          <p>기상청 예보를 불러오는 중입니다.</p>
        </section>
      )}

      {(model.status === "unsupported-region" || model.status === "error") && (
        <section className="profile-alert">
          <p>{model.errorMessage}</p>
        </section>
      )}

      {summary && (
        <>
          <section className="weather-status" aria-label="날씨 데이터 상태">
            <strong>{summary.live.forecast ? "실시간 기상청 예보" : "데모 fallback 예보"}</strong>
            <span>
              조회 {formatDateTime(summary.fetchedAt)}
              {summary.sourceIssuedAt ? ` · 발표 ${summary.sourceIssuedAt}` : ""}
            </span>
            {summary.fallback?.used && (
              <small>fallback reason: {summary.fallback.reason}</small>
            )}
          </section>

          {summary.warnings.length > 0 && (
            <section className="weather-warning-list" aria-label="기상특보">
              <strong>
                {summary.live.warnings ? "발효 중인 기상특보" : "기상특보 데모 표시"}
              </strong>
              {summary.warnings.map((warning) => (
                <p className="weather-warning-item" key={`${warning.type}-${warning.issuedAt}`}>
                  {warning.title}
                  {warning.issuedAt ? ` · 발표 ${formatDateTime(warning.issuedAt)}` : ""}
                </p>
              ))}
            </section>
          )}

          <section className="weather-grid" aria-label="예보 목록">
            {summary.forecasts.slice(0, 8).map((forecast) => (
              <ForecastCard
                forecast={forecast}
                key={`${forecast.date}-${forecast.time}`}
              />
            ))}
          </section>

          {summary.cropGuidance.length > 0 && (
            <section className="info-card" aria-label="작물 재배정보">
              <strong>{model.crop ?? "작물"} 재배정보 공식 링크</strong>
              <ul className="crop-guidance-list">
                {summary.cropGuidance.map((guidance) => (
                  <li key={guidance.sourceUrl}>
                    <a href={guidance.sourceUrl} rel="noreferrer" target="_blank">
                      {guidance.title}
                    </a>
                    <span> · {guidance.source}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}
    </main>
  );
}

function ForecastCard({ forecast }: { forecast: WeatherForecast }) {
  return (
    <article className="weather-card">
      <h2>
        {formatForecastDate(forecast.date)} {formatForecastTime(forecast.time)}
      </h2>
      <dl>
        <div>
          <dt>기온</dt>
          <dd>{formatValue(forecast.temperatureC, "°C")}</dd>
        </div>
        <div>
          <dt>습도</dt>
          <dd>{formatValue(forecast.humidityPct, "%")}</dd>
        </div>
        <div>
          <dt>강수확률</dt>
          <dd>{formatValue(forecast.precipitationProbabilityPct, "%")}</dd>
        </div>
        <div>
          <dt>강수형태</dt>
          <dd>{precipitationLabel(forecast.precipitationType)}</dd>
        </div>
        <div>
          <dt>풍속</dt>
          <dd>{formatValue(forecast.windSpeedMps, "m/s")}</dd>
        </div>
        <div>
          <dt>하늘상태</dt>
          <dd>{skyLabel(forecast.sky)}</dd>
        </div>
      </dl>
    </article>
  );
}

function formatValue(value: number | null, unit: string): string {
  return value === null ? "확인 중" : `${value}${unit}`;
}

function formatDateTime(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString("ko-KR");
}

function formatForecastDate(value: string): string {
  if (value.includes("-")) {
    return value;
  }

  return `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`;
}

function formatForecastTime(value: string): string {
  return `${value.slice(0, 2)}:${value.slice(2, 4)}`;
}

function precipitationLabel(value: WeatherForecast["precipitationType"]): string {
  switch (value) {
    case "none":
      return "없음";
    case "rain":
      return "비";
    case "rain_snow":
      return "비/눈";
    case "snow":
      return "눈";
    case "shower":
      return "소나기";
    case "unknown":
      return "알 수 없음";
    default:
      return "확인 중";
  }
}

function skyLabel(value: WeatherForecast["sky"]): string {
  switch (value) {
    case "clear":
      return "맑음";
    case "cloudy":
      return "구름많음";
    case "overcast":
      return "흐림";
    case "unknown":
      return "알 수 없음";
    default:
      return "확인 중";
  }
}

