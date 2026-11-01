import type { ReactNode } from "react";
import { FaHeart } from "react-icons/fa";
import ClayCharacter from "./ClayCharacter";

export default function ClayAuthShell({
  title,
  subtitle,
  children,
  footer,
  compact = false,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
  compact?: boolean;
}) {
  return (
    <div className="clay-auth">
      <div className="clay-scene" aria-hidden="true">
        <span className="clay-cloud clay-cloud-a" />
        <span className="clay-cloud clay-cloud-b" />

        <span className="clay-plant">
          <span className="clay-plant-stem" />
          <span className="clay-leaf clay-leaf-left" />
          <span className="clay-leaf clay-leaf-mid" />
          <span className="clay-leaf clay-leaf-right" />
          <span className="clay-pot" />
        </span>

        <span className="clay-flower">
          <span className="clay-flower-stem" />
          <span className="clay-flower-leaf" />
          <span className="clay-petal clay-petal-1" />
          <span className="clay-petal clay-petal-2" />
          <span className="clay-petal clay-petal-3" />
          <span className="clay-petal clay-petal-4" />
          <span className="clay-petal clay-petal-5" />
          <span className="clay-petal clay-petal-6" />
          <span className="clay-flower-center" />
          <span className="clay-flower-pot" />
        </span>

        <span className="clay-blob clay-blob-left" />
        <span className="clay-blob clay-blob-right" />
      </div>

      <div className={`clay-card${compact ? " clay-card-compact" : ""}`}>
        <div className="clay-head">
          <FaHeart className="clay-heart" aria-hidden="true" />
          <div className="clay-title-row">
            <span className="clay-sparkle clay-sparkle-left" aria-hidden="true" />
            <h1>{title}</h1>
            <span className="clay-sparkle clay-sparkle-right" aria-hidden="true" />
          </div>
          <p>{subtitle}</p>
        </div>

        <div className="clay-character-wrap">
          <ClayCharacter className="clay-character" />
        </div>

        <div className="clay-panel">
          {children}
          {footer ? <div className="clay-footer">{footer}</div> : null}
        </div>
      </div>
    </div>
  );
}
