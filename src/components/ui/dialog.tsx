import * as D from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import type { ReactNode } from "react";
import { restoreDialogFocus } from "../../lib/focus";
export function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
  wide = false,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <D.Root open={open} onOpenChange={onOpenChange}>
      <D.Portal>
        <D.Overlay className="modal-overlay" />
        <D.Content
          className={"modal-content " + (wide ? "modal-wide" : "")}
          onCloseAutoFocus={(e) => {
            if (restoreDialogFocus(document)) e.preventDefault();
          }}
        >
          <D.Title className="modal-title">{title}</D.Title>
          <D.Description
            className={description ? "modal-description" : "sr-only"}
          >
            {description || "Подробности и доступные действия"}
          </D.Description>
          <D.Close className="modal-close" aria-label="Закрыть">
            <X size={20} />
          </D.Close>
          {children}
        </D.Content>
      </D.Portal>
    </D.Root>
  );
}
export function markFocus() {
  document
    .querySelector("[data-last-focus]")
    ?.removeAttribute("data-last-focus");
  if (document.activeElement instanceof HTMLElement)
    document.activeElement.setAttribute("data-last-focus", "true");
}
