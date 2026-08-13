import type { ContractCheckResult } from "../domain/demo-features";

export const contractCheckFixture: ContractCheckResult[] = [
  { id: "parties", label: "거래 당사자", status: "ok" },
  { id: "amount", label: "거래 금액", status: "ok" },
  { id: "payment-deadline", label: "지급기한", status: "check" },
  { id: "return-deduction", label: "반품·감액 기준", status: "check" }
];

