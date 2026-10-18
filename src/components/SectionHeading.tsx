import type { ReactNode } from "react";
export function SectionHeading({
  title,
  text,
  action,
}: {
  title: ReactNode;
  text?: string;
  action?: ReactNode;
}) {
  return (
    <div className="section-heading">
      <div>
        <h2>{title}</h2>
        {text && <p>{text}</p>}
      </div>
      {action}
    </div>
  );
}
