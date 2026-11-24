import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const d = JSON.parse(readFileSync(new URL('../inputs/session.json', import.meta.url), 'utf8'));

test("各码本层有真实误差包络", () => {
  assert.ok(Object.values(d.pieces).flat().every(([id,i,e])=>d.pages.some(p=>p.id===id&&Math.hypot(...p.vectors[i])<=e+1e-10)));
});

test("词表映射到定义的子词", () => {
  assert.ok(d.packs.every(p=>Object.values(p.terms).flat().every(([id])=>id in d.pieces)));
});

test("同名回退与私有别名均有输入", () => {
  assert.ok(d.packs[0].terms.orbit && d.packs[1].terms.orbit && !d.packs[0].terms.orb && d.pieces.secret[1][0]==='p1');
});
