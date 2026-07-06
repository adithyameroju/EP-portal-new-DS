/**
 * Owner-mandated UNVERIFIED flag (STATE.md standing gate, 2026-07-07):
 * every Foundations page carries this factual line until FE-dev confirms
 * the published Nexus package matches their latest local copy.
 */
export function TokenSourceBanner() {
  return (
    <div
      role="note"
      className="sb-unstyled rounded-md border border-border bg-muted px-4 py-3 font-sans text-sm text-muted-foreground"
    >
      Token source: @acko/enterprise-tokens@1.0.0 (Nexus) — pending FE-dev
      verification against latest local copy.
    </div>
  );
}
