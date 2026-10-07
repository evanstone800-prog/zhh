// Wraps game.html (the artifact body) into a standalone index.html you can open directly.
import { readFileSync, writeFileSync } from 'node:fs';
const body = readFileSync(new URL('../game.html', import.meta.url), 'utf8');
const html = `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover,user-scalable=no">
</head>
<body>
${body}
</body>
</html>
`;
writeFileSync(new URL('../index.html', import.meta.url), html);
console.log('index.html written');
