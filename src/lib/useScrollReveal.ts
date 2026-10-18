import { useEffect, type RefObject } from "react";
import { useReducedMotion } from "framer-motion";

/** Content stays visible if observation or animation is unavailable. */
export function useScrollReveal(root: RefObject<HTMLElement | null>) {
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced || !root.current || typeof IntersectionObserver === "undefined")
      return;
    const animations = new Set<Animation>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const element = entry.target as HTMLElement;
          observer.unobserve(element);
          if (!element.animate || element.contains(document.activeElement))
            continue;
          const siblings = Array.from(element.parentElement?.children || []);
          const stagger = element.matches(
            ".treatment-card, .doctor-card, .package-card, .gallery-item, .benefit",
          )
            ? (siblings.indexOf(element) % 4) * 55
            : 0;
          const animation = element.animate(
            [
              { opacity: 0, transform: "translateY(18px)" },
              { opacity: 1, transform: "translateY(0)" },
            ],
            {
              duration: 560,
              delay: stagger,
              easing: "cubic-bezier(.22,1,.36,1)",
              fill: "backwards",
            },
          );
          animations.add(animation);
          animation.finished.then(
            () => animations.delete(animation),
            () => animations.delete(animation),
          );
        }
      },
      { threshold: 0.08 },
    );
    root.current
      .querySelectorAll(
        ".section-heading, .treatment-card, .doctor-card, .package-card, .gallery-item, .benefit, .jaw-panel, .navigator-controls, .booking-layout, .cases-layout, .contacts-layout, .final-cta",
      )
      .forEach((element) => observer.observe(element));
    return () => {
      observer.disconnect();
      animations.forEach((animation) => animation.cancel());
    };
  }, [root, reduced]);
}
