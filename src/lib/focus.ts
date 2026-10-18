/** Return focus after a dialog, including actions that disable their opener. */
export function restoreDialogFocus(doc: Document): boolean {
  const opener = doc.querySelector<HTMLElement>('[data-last-focus="true"]');
  opener?.removeAttribute("data-last-focus");
  const fallback = doc.querySelector<HTMLElement>(
    "[data-dialog-focus-fallback]",
  );
  for (const target of [opener, fallback]) {
    if (
      !target?.isConnected ||
      target.matches(':disabled, [aria-disabled="true"], [hidden]')
    )
      continue;
    target.focus({ preventScroll: true });
    if (doc.activeElement === target) return true;
  }
  return false;
}
