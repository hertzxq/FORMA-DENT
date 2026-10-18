import { useEffect, useRef } from "react";
export function ErrorSummary({ errors }: { errors: Record<string, string> }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (Object.keys(errors).length) ref.current?.focus();
  }, [errors]);
  return Object.keys(errors).length ? (
    <div role="alert" tabIndex={-1} ref={ref} className="error-summary">
      <strong>Проверьте данные</strong>
      {Object.entries(errors).map(([k, v]) => (
        <a
          key={k}
          href={"#" + k}
          onClick={(e) => {
            e.preventDefault();
            document.getElementById(k)?.focus();
          }}
        >
          {v}
        </a>
      ))}
    </div>
  ) : null;
}
