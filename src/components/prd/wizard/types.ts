import type { PrdWizardForm } from "@/types/prd";

export type WizardFieldChange = <K extends keyof PrdWizardForm>(
  field: K,
  value: PrdWizardForm[K]
) => void;

export type WizardStepProps = {
  form: PrdWizardForm;
  onChange: WizardFieldChange;
};
