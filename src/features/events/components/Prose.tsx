import styles from "./Prose.module.css";

type Props = {
  html: string;
};

// `html` must already be sanitized (src/lib/gdg/sanitize.ts) — this
// component never sanitizes, it only renders.
export function Prose({ html }: Props) {
  if (!html) return null;
  return <div className={styles.prose} dangerouslySetInnerHTML={{ __html: html }} />;
}
