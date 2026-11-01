import { PRD_WIZARD_STEPS } from "@/constants/prd";

export default function WizardStepper({
  currentStep,
}: {
  currentStep: number;
}) {
  return (
    <div className="mb-8 flex items-center px-2">
      {PRD_WIZARD_STEPS.map((step, index) => (
        <div key={step.title} className="flex flex-1 items-center">
          <div className="flex flex-1 flex-col items-center">
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-extrabold transition-all duration-300 ${
                index <= currentStep
                  ? "scale-105 bg-gradient-to-br from-[#ff9b82] to-[#ff6b57] text-white shadow-[0_4px_12px_rgba(255,107,87,0.45),inset_0_2px_4px_rgba(255,255,255,0.7)]"
                  : "bg-white/80 text-[#8c74a8] shadow-inner"
              }`}
            >
              {index + 1}
            </div>
            <span className="mt-2 hidden text-[11px] font-bold text-[#5b467a] sm:block">
              {step.title}
            </span>
          </div>
          {index < PRD_WIZARD_STEPS.length - 1 && (
            <div
              className={`mx-2 h-1 flex-1 rounded-full transition-colors duration-300 ${
                index < currentStep ? "bg-[#ff8c70]" : "bg-white/60"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
