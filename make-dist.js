// Netlify runs "npm run build" and then publishes the "dist" folder.
// This script copies the ready-made site files into dist. It does NOT rebuild bundle.js.
// To rebuild bundle.js after editing the files in src/, run: npm run bundle
const fs = require("fs");

fs.rmSync("dist", { recursive: true, force: true });
fs.mkdirSync("dist");
for (const file of ["index.html", "bundle.js"]) {
  fs.copyFileSync(file, "dist/" + file);
}
console.log("dist ready: index.html, bundle.js");
