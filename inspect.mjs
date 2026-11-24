import {readFileSync} from 'node:fs';
import * as input from './inputs/tail-pages.mjs';

const source=JSON.parse(readFileSync(new URL('./inputs/tail-pages.json',import.meta.url),'utf8'));
console.log(JSON.stringify({名称:'候选簇、尾页和可见字表',首项:source['clusters'],字段:Object.keys(source),取数函数:Object.keys(input)},null,2));
