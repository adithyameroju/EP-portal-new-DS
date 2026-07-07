/**
 * Token provenance line (owner-mandated, STATE.md standing gate):
 * every Foundations page states its token source. FE-dev confirmed the
 * published Nexus package as the baseline on 2026-07-07.
 */
export function TokenSourceBanner() {
  return (
    <div
      role="note"
      className="sb-unstyled rounded-md border border-border bg-muted px-4 py-3 font-sans text-sm text-muted-foreground"
    >
      Token source: @acko/enterprise-tokens@1.0.0 (Nexus) — confirmed as
      baseline (FE-dev, 2026-07-07).
    </div>
  );
}
