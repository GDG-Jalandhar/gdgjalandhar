"use client";

import { useState } from "react";
import styles from "./AgendaTimeline.module.css";
import type { Agenda, AgendaRow } from "@/lib/gdg/types";

type Props = {
  agenda: Agenda | null;
};

// D-5/§8 "Agenda timeline": Mono time in a fixed left column, activity title
// in Sans 700, abstract in Sans 400 muted beneath, a hairline rail with an
// accent dot per row. Day tabs when multiday. Renders nothing (not even the
// section) when there's no agenda — a broken/absent agenda must never break
// the page (§6.5).
export function AgendaTimeline({ agenda }: Props) {
  const [activeDay, setActiveDay] = useState(0);

  if (!agenda || agenda.days.length === 0) return null;

  const day = agenda.days[activeDay];

  return (
    <div className="flex flex-col gap-6">
      {agenda.multiday && agenda.days.length > 1 && (
        <div className="flex gap-2">
          {agenda.days.map((d, i) => (
            <button
              key={d.title + i}
              type="button"
              onClick={() => setActiveDay(i)}
              className={
                i === activeDay
                  ? "rounded-pill bg-accent px-4 py-1.5 font-mono text-meta text-bg"
                  : "rounded-pill border border-hairline px-4 py-1.5 font-mono text-meta text-text-muted"
              }
            >
              Day {i + 1}
            </button>
          ))}
        </div>
      )}
      <ol className={styles.rail}>
        {day.rows.map((row, i) => (
          <AgendaRowItem key={`${row.time}-${row.activity}-${i}`} row={row} />
        ))}
      </ol>
    </div>
  );
}

function AgendaRowItem({ row }: { row: AgendaRow }) {
  const [expanded, setExpanded] = useState(false);
  const hasDescription = row.description.trim().length > 0;

  return (
    <li className={styles.row}>
      {hasDescription && <span className={styles.dot} aria-hidden="true" />}
      <span className={`${styles.time} font-mono text-meta text-text-muted`}>{row.time}</span>
      <p className="text-body font-bold text-text">{row.activity}</p>
      {hasDescription && (
        <>
          <p
            className={`mt-1 whitespace-pre-line text-small text-text-muted ${expanded ? "" : "line-clamp-3"}`}
          >
            {row.description}
          </p>
          {row.description.length > 160 && (
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="mt-1 font-mono text-meta text-accent-text hover:underline"
            >
              {expanded ? "less" : "more"}
            </button>
          )}
        </>
      )}
    </li>
  );
}
