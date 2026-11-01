"use client";

import { FaHeart } from "react-icons/fa";
import { FiArrowLeft, FiArrowRight, FiLoader } from "react-icons/fi";
import { PRD_WIZARD_STEPS } from "@/constants/prd";
import GeneratingStatus from "@/components/prd/wizard/GeneratingStatus";
import StepFeatures from "@/components/prd/wizard/steps/StepFeatures";
import StepProductInfo from "@/components/prd/wizard/steps/StepProductInfo";
import StepTargetProblem from "@/components/prd/wizard/steps/StepTargetProblem";
import StepTemplateDetails from "@/components/prd/wizard/steps/StepTemplateDetails";
import WizardProgress from "@/components/prd/wizard/WizardProgress";
import WizardStepper from "@/components/prd/wizard/WizardStepper";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { usePrdWizard } from "@/hooks/usePrdWizard";

export default function NewPrdPage() {
  const status = useAuthGuard();
  const {
    form,
    currentStep,
    generating,
    statusIndex,
    shake,
    canProceed,
    updateField,
    next,
    previous,
    fillDemo,
    generate,
  } = usePrdWizard();

  if (status === "loading") {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-[#7657d4]" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-8 text-center">
        <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-white bg-white/80 px-3 py-1 text-xs font-bold text-[#543d75] shadow-sm">
          <FaHeart className="text-xs text-[#ff6b57]" />
          <span>Wizard Pembuatan Dokumen</span>
        </div>
        <h1 className="text-3xl font-extrabold text-[#31224d]">
          Buat PRD Baru
        </h1>
        <p className="mt-1 text-sm font-medium text-[#5b467a]">
          Lengkapi langkah sederhana di bawah, AI akan merancang PRD lengkap
          untukmu
        </p>
        <button
          type="button"
          onClick={fillDemo}
          className="clay-btn-white mt-4 px-4 py-2 text-xs font-bold"
        >
          Isi dengan Contoh Demo
        </button>
      </div>

      <WizardProgress
        currentStep={currentStep}
        totalSteps={PRD_WIZARD_STEPS.length}
      />

      <WizardStepper currentStep={currentStep} />

      <div
        className={`clay-surface p-6 transition-all sm:p-10 ${
          shake ? "anim-shake" : ""
        }`}
      >
        <div key={currentStep} className="anim-step">
          {currentStep === 0 && (
            <StepProductInfo form={form} onChange={updateField} />
          )}
          {currentStep === 1 && (
            <StepTargetProblem form={form} onChange={updateField} />
          )}
          {currentStep === 2 && (
            <StepFeatures form={form} onChange={updateField} />
          )}
          {currentStep === 3 && (
            <StepTemplateDetails form={form} onChange={updateField} />
          )}
        </div>

        <div className="mt-10 flex items-center justify-between border-t border-[#f0e3f5] pt-6">
          <button
            type="button"
            onClick={previous}
            disabled={currentStep === 0}
            className="clay-btn-white px-5 py-2.5 text-xs font-bold disabled:cursor-not-allowed disabled:opacity-30"
          >
            <FiArrowLeft /> Sebelumnya
          </button>

          {currentStep < PRD_WIZARD_STEPS.length - 1 ? (
            <button
              type="button"
              onClick={next}
              className={`clay-btn-purple px-6 py-2.5 text-xs font-bold ${
                !canProceed ? "opacity-75" : ""
              }`}
            >
              Selanjutnya <FiArrowRight />
            </button>
          ) : (
            <button
              type="button"
              onClick={generate}
              disabled={generating}
              className="clay-btn-coral px-8 py-2.5 text-xs font-bold shadow-lg disabled:opacity-50"
            >
              {generating ? (
                <>
                  <FiLoader className="animate-spin" /> Menulis PRD...
                </>
              ) : (
                "✨ Generate PRD Sekarang"
              )}
            </button>
          )}
        </div>

        {generating && <GeneratingStatus statusIndex={statusIndex} />}
      </div>
    </div>
  );
}
