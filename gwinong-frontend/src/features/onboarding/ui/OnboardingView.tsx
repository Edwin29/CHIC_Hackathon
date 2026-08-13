import type { UserProfile } from "../../../domain/profile";
import type { OnboardingController } from "../model/useOnboarding";
import {
  educationExperienceOptions,
  familyDiscussionOptions,
  farmingExperienceOptions,
  informationLevelOptions,
  purposeOptions,
  regionCropOptions,
  stageOptions,
  targetPeriodOptions
} from "../model/onboarding-options";
import { OptionGroup } from "./OptionGroup";

interface OnboardingViewProps {
  controller: OnboardingController;
  onComplete(profile: UserProfile): void;
}

export function OnboardingView({ controller, onComplete }: OnboardingViewProps) {
  const { currentStep, draft } = controller;

  return (
    <main className="app-shell">
      <section className="intro-panel" aria-labelledby="onboarding-title">
        <p className="eyebrow">PACKET 1</p>
        <h1 id="onboarding-title">귀농 프로필 만들기</h1>
        <p className="muted">진행 {controller.progressLabel}</p>
      </section>

      <section className="flow-panel">
        {currentStep === "name" && (
          <>
            <h2>어떻게 불러드릴까요?</h2>
            <input
              className="text-input"
              onChange={(event) => controller.setName(event.target.value)}
              placeholder="예: 김미숙"
              type="text"
              value={draft.name}
            />
          </>
        )}

        {currentStep === "currentStage" && (
          <>
            <h2>요즘 귀농 준비, 어디까지 오셨어요?</h2>
            <OptionGroup
              name="currentStage"
              onChange={(currentStage) => controller.updateDraft({ currentStage })}
              options={stageOptions}
              value={draft.currentStage}
            />
          </>
        )}

        {currentStep === "purpose" && (
          <>
            <h2>C1. 귀농·귀촌 목적은 무엇인가요?</h2>
            <OptionGroup
              name="purpose"
              onChange={(purpose) => controller.updateDraft({ purpose })}
              options={purposeOptions}
              value={draft.purpose}
            />
          </>
        )}

        {currentStep === "targetPeriod" && (
          <>
            <h2>C2. 희망 시기는 어느 정도인가요?</h2>
            <OptionGroup
              name="targetPeriod"
              onChange={(targetPeriod) => controller.updateDraft({ targetPeriod })}
              options={targetPeriodOptions}
              value={draft.targetPeriod}
            />
          </>
        )}

        {currentStep === "informationLevel" && (
          <>
            <h2>C3. 정보수집은 어디까지 해보셨나요?</h2>
            <OptionGroup
              name="informationLevel"
              onChange={(informationLevel) =>
                controller.updateDraft({ informationLevel })
              }
              options={informationLevelOptions}
              value={draft.informationLevel}
            />
          </>
        )}

        {currentStep === "familyDiscussion" && (
          <>
            <h2>C4. 가족과는 어느 정도 이야기했나요?</h2>
            <OptionGroup
              name="familyDiscussion"
              onChange={(familyDiscussion) =>
                controller.updateDraft({ familyDiscussion })
              }
              options={familyDiscussionOptions}
              value={draft.familyDiscussion}
            />
          </>
        )}

        {currentStep === "regionCrop" && (
          <>
            <h2>C5. 관심 지역·작목은 무엇인가요?</h2>
            <div className="option-grid">
              {regionCropOptions.map((option) => (
                <label className="option-card" key={option.label}>
                  <input
                    checked={
                      draft.targetRegion === option.region &&
                      draft.targetCrop === option.crop &&
                      option.unknownFields.every((field) =>
                        draft.unknownFields.includes(field)
                      )
                    }
                    name="regionCrop"
                    onChange={() => {
                      controller.updateDraft({
                        targetRegion: option.region,
                        targetCrop: option.crop
                      });
                      controller.setUnknownFields(option.unknownFields);
                    }}
                    type="radio"
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </>
        )}

        {currentStep === "experience" && (
          <>
            <h2>C6. 교육·영농 경험은 어느 정도인가요?</h2>
            <div className="split-fields">
              <div>
                <h3>교육 경험</h3>
                <OptionGroup
                  name="educationExperience"
                  onChange={(educationExperience) =>
                    controller.updateDraft({ educationExperience })
                  }
                  options={educationExperienceOptions}
                  value={draft.educationExperience}
                />
              </div>
              <div>
                <h3>영농 경험</h3>
                <OptionGroup
                  name="farmingExperience"
                  onChange={(farmingExperience) =>
                    controller.updateDraft({ farmingExperience })
                  }
                  options={farmingExperienceOptions}
                  value={draft.farmingExperience}
                />
              </div>
            </div>
          </>
        )}

        <div className="button-row">
          <button
            className="secondary-button"
            disabled={!controller.canGoBack}
            onClick={controller.back}
            type="button"
          >
            이전
          </button>
          <button
            className="secondary-button"
            onClick={() => onComplete(controller.loadDemoProfile())}
            type="button"
          >
            김미숙 데모 불러오기
          </button>
          <button
            className="primary-button"
            disabled={!controller.canContinue}
            onClick={() => {
              const profile = controller.next();

              if (profile) {
                onComplete(profile);
              }
            }}
            type="button"
          >
            {controller.currentStepIndex === controller.totalSteps - 1
              ? "저장하고 홈으로"
              : "다음"}
          </button>
        </div>
      </section>
    </main>
  );
}

