import assert from 'node:assert/strict';
import test from 'node:test';
import { layoutEventCards } from '../../src/lib/event-card-layout.ts';
const cards = pattern => [...pattern].map((value, id) => ({ id, tier: value === 'F' ? 'featured' : 'standard' }));
test('featured events receive room without reordering neighboring records', () => {
  for (const [pattern, expected] of [['FS', [4, 2]], ['SF', [2, 4]], ['FF', [3, 3]], ['SSFS', [3, 3, 4, 2]], ['SSS', [2, 2, 2]], ['S', [6]], ['', []]]) {
    const input = cards(pattern);
    const result = layoutEventCards(input);
    assert.deepEqual(result.map(card => card.span), expected);
    assert.deepEqual(result.map(card => card.event), input);
  }
});
test('every filtered arrangement fills rows and preserves each record exactly once', () => {
  for (let mask = 0; mask < 256; mask++) {
    const input = cards(mask.toString(2).padStart(8, '0').replaceAll('1', 'F').replaceAll('0', 'S'));
    const original = structuredClone(input);
    const result = layoutEventCards(input);
    let filled = 0;
    for (const card of result) {
      filled += card.span;
      assert.ok(filled <= 6, 'no implicit grid hole before the next card');
      if (filled === 6) filled = 0;
    }
    assert.equal(filled, 0);
    assert.deepEqual(result.map(card => card.event.id), input.map(card => card.id));
    assert.deepEqual(input, original, 'layout never mutates content');
  }
});
