export type EventCardSpan = 2 | 3 | 4 | 6;

/** Fill desktop rows in chronological order, without CSS dense backfilling.
 * A featured story usually gets 2/3 of a row. Two neighboring features share
 * the row equally; an unpaired final card uses a compact horizontal layout.
 * Below desktop the cards fall back to the ordinary one/two-column grid.
 */
export function layoutEventCards<T extends { tier: "featured" | "standard" }>(events: readonly T[]): { event: T; span: EventCardSpan }[] {
  const cards: { event: T; span: EventCardSpan }[] = [];
  for (let index = 0; index < events.length;) {
    const remaining = events.slice(index);
    const count = remaining.length === 1 ? 1
      : remaining[0].tier === "featured" || remaining[1].tier === "featured" ? 2
      : remaining[2]?.tier === "featured" ? 2
      : Math.min(3, remaining.length);
    const row = remaining.slice(0, count);
    for (const event of row) {
      const span: EventCardSpan = count === 1 ? 6 : count === 3 ? 2
        : row[0].tier === row[1].tier ? 3 : event.tier === "featured" ? 4 : 2;
      cards.push({ event, span });
    }
    index += count;
  }
  return cards;
}
