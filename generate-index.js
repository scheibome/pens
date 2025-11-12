import { readdirSync, readFileSync, writeFileSync } from "fs";

const pensDir = "./pens";
const pens = [];

for (const file of readdirSync(pensDir)) {
  if (file.endsWith(".json")) {
    try {
      const meta = JSON.parse(readFileSync(`${pensDir}/${file}`, "utf8"));
      pens.push({
        file,
        title: meta.title || file.replace(".json", ""),
        description: meta.description || "",
      });
    } catch (e) {
      console.warn(`⚠️ Fehler beim Lesen von ${file}: ${e.message}`);
    }
  }
}

const html = `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Meine LiveCodes-Sammlung</title>
  <style>
    body { font-family: system-ui, sans-serif; margin: 2rem; background: #f7f7f7; }
    h1 { text-align: center; }
    .grid { display: grid; gap: 1rem; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); }
    .pen { background: white; padding: 1rem; border-radius: 12px; box-shadow: 0 2px 4px rgba(0,0,0,.1); }
    .pen h2 { margin-top: 0; font-size: 1.1rem; }
    .pen p { color: #555; font-size: 0.9rem; }
    .btn { display: inline-block; margin-top: .5rem; background: #007acc; color: white; padding: .4rem .8rem; border-radius: 6px; text-decoration: none; }
    .btn:hover { background: #005f99; }
  </style>
</head>
<body>
  <h1>Meine LiveCodes Export Pens</h1>
  <div class="grid">
    ${pens
.map(
    (p) => `
        <div class="pen">
          <h2>${p.title}</h2>
          <p>${p.description}</p>
          <a class="btn" href="https://code.scheibitz.com/?config=https://pens.scheibitz.com/pens/${p.file}" target="_blank">
            🚀 Öffnen in LiveCodes
          </a>
          <a class="btn" href="pens/${p.file}" target="_blank">📄 JSON anzeigen</a>
        </div>`
)
.join("\n")}
  </div>
</body>
</html>
`;

writeFileSync("index.html", html);
console.log(`✅ index.html mit ${pens.length} LiveCodes-Exports erstellt.`);
