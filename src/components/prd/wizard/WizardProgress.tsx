export default function WizardProgress({
  currentStep,
  totalSteps,
}: {
  currentStep: number;
  totalSteps: number;
}) {
  return (
    <div className="mb-8 h-2.5 w-full overflow-hidden rounded-full bg-white/60 p-0.5 shadow-inner">
      <div
        className="h-full rounded-full bg-gradient-to-r from-[#ff8c70] via-[#e55375] to-[#7657d4] shadow-sm transition-[width] duration-500 ease-out"
        style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
      />
    </div>
  );
}
