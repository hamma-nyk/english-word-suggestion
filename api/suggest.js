import fs from "fs";

let words = [];
let index = {};

function loadWords() {
  if (words.length > 0) return;

  console.log("Loading wordlist...");
  const txt = fs.readFileSync("./words_alpha.txt", "utf8");
  words = txt.split("\n");
  console.log("Loaded:", words.length);

  // buat index berdasar huruf pertama
  for (const w of words) {
    const first = w[0]?.toLowerCase();
    if (!first) continue;
    if (!index[first]) index[first] = [];
    index[first].push(w);
  }

  console.log("Index ready");
}

export default async function handler(req, res) {
  loadWords();

  const word = (req.query.word || "").toLowerCase();

  if (!word) return res.status(200).json([]);

  const first = word[0];
  const list = index[first] || [];

  // prefix search
  const out = [];
  for (const w of list) {
    if (w.startsWith(word)) {
      out.push(w);
      if (out.length >= 20) break;
    }
  }

  return res.status(200).json(out);
}
