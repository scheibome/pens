import { readdirSync, readFileSync, writeFileSync } from "fs";
import path from "path";

const pensDir = "./pens";
const outFile = "./index.html";

const pens = [];

for (const folder of readdirSync(pensDir)) {
  const metaPath = path.join(pensDir, folder, "meta.json");
  try {
    const meta = JSON.parse(readFileSync(metaPath, "utf8"));
    pens.push({ folder, ...meta });
  } catch {
    console.warn(`⚠️  Keine meta.json in ${folder}`);
  }
}

const html = `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Meine Codesammlung</title>
  <style>
    body { font-family: sans-serif; margin: 2rem; background: #f7f7f7; }
    h1 { text-align: center; }
    .grid { display: grid; gap: 1rem; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); }
    .pen { background: white; padding: 1rem; border-radius: 12px; box-shadow: 0 2px 4px rgba(0,0,0,.1); }
    .pen img { max-width: 100%; border-radius: 8px; margin-bottom: .5rem; }
    .tags { font-size: .9em; color: #555; }
    a.btn { display: inline-block; margin-top: .5rem; color: white; background: #007acc; padding: .4rem .8rem; border-radius: 6px; text-decoration: none; }
    a.btn:hover { background: #005f99; }
  </style>
</head>
<body>
  <h1>Meine Code-Sammlung</h1>
  <div class="grid">
    ${pens
.map(
    (p) => `
        <div class="pen">
          <h2>${p.title}</h2>
          ${p.preview ? `<img src="pens/${p.folder}/${p.preview}" alt="${p.title}">` : ""}
          <p>${p.description || ""}</p>
          <p class="tags">${(p.tags || []).join(", ")}</p>
          <a class="btn" href="pens/${p.folder}/index.html" target="_blank">🔍 Vorschau</a>
          <a class="btn" href="https://code.scheibitz.com/?url=https://github.com/scheibome/pens/${p.folder}/index.html" target="_blank">🚀 In LiveCodes öffnen</a>
        </div>`
)
.join("\n")}
  </div>
</body>
</html>
`;

writeFileSync(outFile, html);
console.log(`✅ index.html mit ${pens.length} Pens erzeugt.`);
