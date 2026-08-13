# Weather API Contract v1

## 목적

기상청 단기예보 고유 형식을 Frontend에서 숨기고 앱용 `WeatherSummary`만 제공한다.

## Endpoint

```http
GET /v1/weather/summary?region={region}&crop={crop}
```

예:
`region=충청북도 괴산군&crop=고추`

## Request

```ts
interface WeatherSummaryQuery {
  region: string;
  crop?: string;
}
```

v1 실제 지원지역: `충청북도 괴산군`.

## Response

```ts
interface WeatherSummary {
  location: { id: string; name: string };
  crop: string | null;
  fetchedAt: string;
  sourceIssuedAt: string | null;
  forecasts: Array<{
    date: string;
    time: string;
    temperatureC: number | null;
    humidityPct: number | null;
    precipitationProbabilityPct: number | null;
    precipitationType: "none" | "rain" | "rain_snow" | "snow" | "shower" | "unknown" | null;
    windSpeedMps: number | null;
    sky: "clear" | "cloudy" | "overcast" | "unknown" | null;
  }>;
  warnings: Array<{ type: string; level: string | null; title: string; issuedAt: string | null }>;
  cropGuidance: Array<{ title: string; source: string; sourceUrl: string; live: boolean }>;
  live: { forecast: boolean; warnings: boolean; cropGuidance: boolean };
}
```

v1은 forecast만 true 가능.

## KMA mapping

| KMA | 앱 |
|---|---|
| TMP | temperatureC |
| REH | humidityPct |
| POP | precipitationProbabilityPct |
| PTY | precipitationType |
| WSD | windSpeedMps |
| SKY | sky |

## LocationResolver

```ts
interface WeatherLocation {
  id: string;
  name: string;
  nx: number;
  ny: number;
}
```

괴산 nx/ny는 **기상청 공식 격자자료에서 검증한 값만** 사용한다. 기억이나 임의 좌표 금지.

## base_date / base_time

- KST 기준
- 현재 공식 API 가이드의 발표시각 규칙 확인
- 아직 발표되지 않은 미래 base_time 금지
- 최신 사용 가능한 발표시각 선택

## Error

```ts
type WeatherErrorCode =
  | "unsupported_region"
  | "missing_api_key"
  | "upstream_timeout"
  | "upstream_error"
  | "invalid_upstream_response";
```

fallback 사용 시 `live.forecast=false`.

## Security

환경변수: `KMA_SERVICE_KEY`

- Frontend 노출 금지
- 응답 포함 금지
- key가 포함된 전체 URL 로그 금지

## Timeout

3~5초, retry 최대 1회 또는 없음. 발표 안정성을 위해 fallback 우선.

## Frontend service

```ts
interface WeatherService {
  getSummary(region: string, crop?: string): Promise<WeatherSummary>;
}
```

구현:
- HttpWeatherService
- MockWeatherService

## 후속

v2: 기상특보
v3: 농촌진흥청 농작업정보

날씨에서 병명/농약 행동을 자동 생성하지 않는다.
