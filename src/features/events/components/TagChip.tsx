// D-8/§8 "Tag chips": Mono, uppercase, hairline border, no fill,
// non-interactive in v1 — don't style them as buttons if they don't click.
export function TagChip({ label }: { label: string }) {
  return (
    <span className="rounded-full border border-hairline px-3 py-1 font-mono text-meta uppercase text-text-muted">
      {label}
    </span>
  );
}
