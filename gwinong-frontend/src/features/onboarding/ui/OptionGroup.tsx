import type { OnboardingOption } from "../model/onboarding-options";

interface OptionGroupProps<TValue extends string> {
  name: string;
  options: OnboardingOption<TValue>[];
  value: TValue | null;
  onChange(value: TValue): void;
}

export function OptionGroup<TValue extends string>({
  name,
  options,
  value,
  onChange
}: OptionGroupProps<TValue>) {
  return (
    <div className="option-grid">
      {options.map((option) => (
        <label className="option-card" key={option.value}>
          <input
            checked={value === option.value}
            name={name}
            onChange={() => onChange(option.value)}
            type="radio"
          />
          <span>{option.label}</span>
        </label>
      ))}
    </div>
  );
}

