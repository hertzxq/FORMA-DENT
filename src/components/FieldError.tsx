export function FieldError({
  name,
  errors,
}: {
  name: string;
  errors: Record<string, string>;
}) {
  return errors[name] ? (
    <p id={name + "-error"} className="field-error">
      {errors[name]}
    </p>
  ) : null;
}
