import {readFileSync} from 'node:fs';
const data = JSON.parse(readFileSync(new URL('./tail-pages.json', import.meta.url), 'utf8'));
export function tailPage(cluster, page, revision='v1') {
  if (cluster<0 || cluster>=data.clusters || page<0 || page*data.pageRows>=data.tailRows) throw new RangeError('尾页越界');
  const aliases=new Map();
  for (const [a,b,cp] of data.aliasMap) {
    aliases.set(a.join('/'),cp); aliases.set(b.join('/'),cp);
  }
  const changes=new Map(data.changelog.filter(([rev])=>rev===revision).map(([,c,i,cp])=>[`${c}/${i}`,cp]));
  return Array.from({length:data.pageRows},(_,k)=>{
    const index=page*data.pageRows+k, key=`${cluster}/${index}`;
    const logit=(data.dominant.includes(cluster)&&page===0&&k<15) ? 6-0.125*k+.001*cluster : -18+(index%13)/8;
    return [index,changes.get(key)??aliases.get(key)??(0xf0000+cluster*data.tailRows+index),logit];
  });
}
export function tailHead(cluster, context=0) {
  return data.headline[cluster%data.headline.length]-(data.dominant.includes(cluster)?0:8)+(context&&cluster===8?1.25:0);
}
