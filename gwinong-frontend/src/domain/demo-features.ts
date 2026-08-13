import type { DataMode } from "./weather";

export interface PolicyFixture {
  id: string;
  title: string;
  organization: string;
  summary: string;
  targetText: string;
  regionTags: string[];
  sourceUrl: string;
  demoMatchReason: string;
  dataMode: DataMode;
}

export interface FieldProgramFixture {
  id: string;
  title: string;
  organization: string;
  regionTags: string[];
  cropTags: string[];
  summary: string;
  sourceUrl: string;
  dataMode: DataMode;
}

export interface EducationFixture {
  id: string;
  title: string;
  summary: string;
  unknownField: string;
  sourceUrl: string;
  dataMode: DataMode;
}

export interface ContractCheckResult {
  id: string;
  label: string;
  status: "ok" | "check";
}

