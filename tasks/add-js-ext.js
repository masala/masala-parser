import path from 'path';
import fs from 'fs';

export default function (file, api) {
  const j = api.jscodeshift;
  const dir = path.dirname(file.path);

  const process = p => {
    const v = p.value.source.value;
    if (!/^\.{1,2}\//.test(v) || v.endsWith('.js')) return; // skip bare & already‑ok

    const abs = path.resolve(dir, v);
    if (fs.existsSync(abs) && fs.statSync(abs).isDirectory()) {
      p.value.source.value = `${v.replace(/\/?$/, '/index.js')}`;
    } else if (fs.existsSync(abs + '.js')) {
      p.value.source.value = `${v}.js`;
    }
  };

  return j(file.source)
    .find(j.ImportDeclaration)
    .forEach(process)
    .toSource();
}
