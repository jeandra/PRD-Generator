import { PRD_GENERATING_MESSAGES } from "@/constants/prd";

export default function GeneratingStatus({
  statusIndex,
}: {
  statusIndex: number;
}) {
  return (
    <div className="anim-fade mt-6 flex items-center justify-center gap-3 rounded-2xl border border-white bg-white/90 p-4 text-xs font-bold text-[#5b3b9b] shadow-inner">
      <span className="dot-loading flex items-center">
        <span className="bg-[#ff6b57]" />
        <span className="bg-[#ff6b57]" />
        <span className="bg-[#ff6b57]" />
      </span>
      <span key={statusIndex} className="anim-fade">
        {PRD_GENERATING_MESSAGES[statusIndex]}
      </span>
    </div>
  );
}
