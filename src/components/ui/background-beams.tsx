"use client";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export const BackgroundBeams = ({ className }: { className?: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const createBeam = () => {
      const beam = document.createElement("div");
      beam.className = "beam";
      beam.style.cssText = `
        position: absolute;
        top: ${Math.random() * 100}%;
        left: ${Math.random() * 100}%;
        width: ${Math.random() * 2 + 1}px;
        height: ${Math.random() * 200 + 100}px;
        background: linear-gradient(
          180deg,
          rgba(255,255,255,0) 0%,
          rgba(255,255,255,0.3) 50%,
          rgba(255,255,255,0) 100%
        );
        transform: rotate(${Math.random() * 360}deg);
        opacity: ${Math.random() * 0.3};
        animation: beam-animation ${Math.random() * 5 + 5}s linear infinite;
      `;
      return beam;
    };

    const beams = Array.from({ length: 20 }, createBeam);
    beams.forEach(beam => container.appendChild(beam));

    return () => {
      beams.forEach(beam => beam.remove());
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        "absolute inset-0 overflow-hidden [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]",
        className
      )}
    >
      <style jsx>{`
        @keyframes beam-animation {
          from {
            transform: translateY(100%) rotate(var(--rotation));
            opacity: var(--opacity);
          }
          to {
            transform: translateY(-100%) rotate(var(--rotation));
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}; 