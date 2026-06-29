import FtateqiLogo from "./FtateqiLogo";
import svgPaths from "./FtateqiLogo/svg-xhalzhfzcn";

/**
 * Ftareqi brand mark with a continuous diagonal "shine" sweep.
 *
 * Two layers, both clipped to the exact logo silhouette:
 *  1. A static white fill (the logo itself) with a soft white outer glow.
 *  2. A moving 45°-ish light band (linear-gradient) masked to the same shape,
 *     so the highlight only travels across the logo, never the background.
 *
 * The mask is the logo geometry exported as an inline SVG data-URI, applied
 * via CSS `mask-image` to a plain <div> whose background-position animates.
 */
const maskSvg = encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 450 225"><path fill-rule="evenodd" clip-rule="evenodd" d="${svgPaths.p298170c0}" fill="#fff"/><path d="${svgPaths.p269107c0}" fill="#fff"/></svg>`,
);
const maskUrl = `url("data:image/svg+xml,${maskSvg}")`;

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span
      className={`relative inline-block ${className}`}
      style={{ aspectRatio: "450 / 225", filter: "drop-shadow(0 0 10px rgba(255,255,255,0.35))" }}
      aria-label="Ftareqi"
    >
      {/* Base white logo */}
      <FtateqiLogo />

      {/* Animated shine band, clipped to the logo shape */}
      <div
        className="ft-logo-shine pointer-events-none absolute inset-0"
        style={{
          WebkitMaskImage: maskUrl,
          maskImage: maskUrl,
          WebkitMaskSize: "contain",
          maskSize: "contain",
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          WebkitMaskPosition: "center",
          maskPosition: "center",
        }}
      />
    </span>
  );
}
