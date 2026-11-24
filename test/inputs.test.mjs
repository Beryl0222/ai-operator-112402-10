import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';
import { tailPage, tailHead } from '../inputs/tail-pages.mjs';

const data=JSON.parse(readFileSync(new URL('../inputs/tail-pages.json',import.meta.url),'utf8'));
test('候选簇、尾页和可见字表的格式与关联', () => {
  assert.equal(tailPage(0,0).length,data.pageRows);
  assert.equal(tailPage(0,31).at(-1)[0],data.tailRows-1);
  assert.equal(tailPage(0,0)[14][1],19969);
  assert.equal(tailPage(9,0)[9][1],19969);
  assert.equal(tailPage(9,0,'v2')[9][1],19971);
  assert.ok(data.openLimit<data.clusters*data.tailRows/data.pageRows/10);
  assert.ok(new Set(data.aliasMap.map(a=>a[2])).size===data.aliasMap.length);
  const index=JSON.parse(readFileSync(new URL('../inputs/tail-index.json',import.meta.url),'utf8'));
  assert.equal(index.length,data.clusters);
  const entry=index[9].pages[0];
  assert.ok(entry.alias.some(([i,cp])=>i===9&&cp===19969));
  assert.ok(entry.changes.some(([,c,i,cp])=>c===9&&i===9&&cp===19971));
  assert.ok(Math.abs(index[9].logNormalizer-Math.log(index[9].pages.reduce((s,p)=>s+p.expMass,0)))<1e-12);
  assert.ok(tailHead(8,1)>tailHead(8));
});
